import type { CastMember, Rating } from "@shared/schema";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  media_type: string;
  vote_average?: number;
  vote_count?: number;
}

interface TMDBSearchResponse {
  results: TMDBSearchResult[];
}

interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface TMDBCreditsResponse {
  cast: TMDBCastMember[];
}

export interface TMDBData {
  cast: CastMember[];
  audienceRating: Rating | null;
}

export async function searchTMDB(
  title: string,
  year: number | null,
  type: "movie" | "tv"
): Promise<TMDBData> {
  const emptyResult: TMDBData = { cast: [], audienceRating: null };
  
  if (!TMDB_API_KEY) {
    console.log("TMDB_API_KEY not configured");
    return emptyResult;
  }

  try {
    // Search for the title
    const searchUrl = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}${year ? `&year=${year}` : ""}`;
    const searchResponse = await fetch(searchUrl);
    const searchData: TMDBSearchResponse = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      console.log("TMDB: No results found for", title);
      return emptyResult;
    }

    // Find the best match - prefer matching type
    let match = searchData.results.find(r => {
      const mediaType = r.media_type === "tv" ? "tv" : "movie";
      return mediaType === type;
    });

    // Fall back to first result if no type match
    if (!match) {
      match = searchData.results[0];
    }

    // Extract audience rating from the search result
    let audienceRating: Rating | null = null;
    if (match.vote_average !== undefined && match.vote_count && match.vote_count > 0) {
      const score = Math.round(match.vote_average * 10); // Convert 0-10 to 0-100
      audienceRating = {
        source: "TMDB Users",
        score: score,
        maxScore: 100,
        displayScore: `${score}`,
      };
    }

    const mediaType = match.media_type === "tv" ? "tv" : "movie";
    const creditsEndpoint = mediaType === "tv" ? "aggregate_credits" : "credits";
    
    // Get credits/cast
    const creditsUrl = `${TMDB_BASE_URL}/${mediaType}/${match.id}/${creditsEndpoint}?api_key=${TMDB_API_KEY}`;
    const creditsResponse = await fetch(creditsUrl);
    const creditsData = await creditsResponse.json();

    if (!creditsData.cast || creditsData.cast.length === 0) {
      console.log("TMDB: No cast found for", title);
      return { cast: [], audienceRating };
    }

    // For TV shows with aggregate_credits, the structure is slightly different
    const castList = creditsData.cast.slice(0, 6).map((member: any) => {
      let character = "";
      
      if (mediaType === "tv" && member.roles && member.roles.length > 0) {
        // TV aggregate credits have roles array
        character = member.roles[0].character || "";
      } else {
        character = member.character || "";
      }

      return {
        name: member.name,
        character: character,
        imageUrl: member.profile_path 
          ? `${TMDB_IMAGE_BASE}${member.profile_path}` 
          : undefined,
      };
    });

    return { cast: castList, audienceRating };
  } catch (error) {
    console.error("TMDB error:", error);
    return emptyResult;
  }
}
