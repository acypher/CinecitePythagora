import type { MovieResult, Rating, CastMember } from "@shared/schema";
import { searchTMDB } from "./tmdb";
import { scrapeMetacriticUserScore } from "./metacritic";
import { scrapeRottenTomatoes } from "./rottentomatoes";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = "https://www.omdbapi.com/";

interface OMDBRating {
  Source: string;
  Value: string;
}

interface OMDBResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OMDBRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons?: string;
  Response: string;
  Error?: string;
}

interface OMDBSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface OMDBSearchResponse {
  Search?: OMDBSearchResult[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

function parseRating(source: string, value: string): Rating | null {
  if (!value || value === "N/A") return null;

  // Parse different rating formats
  if (source === "Internet Movie Database") {
    const match = value.match(/^([\d.]+)\/(\d+)$/);
    if (match) {
      const rawScore = parseFloat(match[1]);
      const normalizedScore = Math.round(rawScore * 10);
      return {
        source: "IMDb Users",
        score: normalizedScore,
        maxScore: 100,
        displayScore: `${normalizedScore}`,
      };
    }
  }

  if (source === "Rotten Tomatoes") {
    const match = value.match(/^(\d+)%$/);
    if (match) {
      const score = parseInt(match[1]);
      return {
        source: "Rotten Tomatoes Critics",
        score: score,
        maxScore: 100,
        displayScore: `${score}`,
      };
    }
  }

  if (source === "Metacritic") {
    const match = value.match(/^(\d+)\/(\d+)$/);
    if (match) {
      const score = parseInt(match[1]);
      return {
        source: "Metacritic Critics",
        score: score,
        maxScore: 100,
        displayScore: `${score}`,
      };
    }
  }

  return null;
}

function parseActors(actorsString: string): CastMember[] {
  if (!actorsString || actorsString === "N/A") return [];

  return actorsString.split(", ").slice(0, 5).map((name) => ({
    name: name.trim(),
    character: "",
  }));
}

function parseGenres(genreString: string): string[] {
  if (!genreString || genreString === "N/A") return [];
  return genreString.split(", ").map((g) => g.trim());
}

function parseYear(yearString: string): number | null {
  if (!yearString || yearString === "N/A") return null;
  // Handle ranges like "2008-2013" for TV series
  const match = yearString.match(/^(\d{4})/);
  return match ? parseInt(match[1]) : null;
}

interface TransformResult {
  movie: MovieResult;
  warnings: string[];
}

async function transformOMDBToMovieResult(omdb: OMDBResponse): Promise<TransformResult> {
  const ratings: Rating[] = [];
  const warnings: string[] = [];
  let omdbRTScore: number | null = null;

  // Parse OMDB ratings array
  if (omdb.Ratings) {
    for (const rating of omdb.Ratings) {
      const parsed = parseRating(rating.Source, rating.Value);
      if (parsed) {
        ratings.push(parsed);
        if (parsed.source === "Rotten Tomatoes Critics") {
          omdbRTScore = parsed.score;
        }
      }
    }
  }

  // Also check for standalone imdbRating if not in Ratings array
  if (omdb.imdbRating && omdb.imdbRating !== "N/A" && !ratings.find(r => r.source === "IMDb Users")) {
    const normalizedScore = Math.round(parseFloat(omdb.imdbRating) * 10);
    ratings.push({
      source: "IMDb Users",
      score: normalizedScore,
      maxScore: 100,
      displayScore: `${normalizedScore}`,
    });
  }

  // Check for Metascore if not in Ratings array
  if (omdb.Metascore && omdb.Metascore !== "N/A" && !ratings.find(r => r.source === "Metacritic Critics")) {
    const score = parseInt(omdb.Metascore);
    ratings.push({
      source: "Metacritic Critics",
      score: score,
      maxScore: 100,
      displayScore: `${score}`,
    });
  }

  const year = parseYear(omdb.Year);
  const type = omdb.Type === "series" ? "tv" : "movie";
  
  // Get cast and audience rating from TMDB
  const tmdbData = await searchTMDB(omdb.Title, year, type);
  
  // Add TMDB audience rating if available
  if (tmdbData.audienceRating) {
    ratings.push(tmdbData.audienceRating);
  }
  
  // Scrape Rotten Tomatoes for audience score and verify critics score
  const rtScores = await scrapeRottenTomatoes(omdb.Title, year, type);
  if (rtScores.audienceScore) {
    ratings.push(rtScores.audienceScore);
  }
  
  // Check for RT critics score mismatch
  if (rtScores.criticsScore !== null && omdbRTScore !== null) {
    const diff = Math.abs(rtScores.criticsScore - omdbRTScore);
    if (diff > 2) {
      warnings.push(`Rotten Tomatoes score mismatch: OMDB reports ${omdbRTScore}%, RT website shows ${rtScores.criticsScore}%`);
    }
  }
  
  // Scrape Metacritic for user score
  const metacriticUserScore = await scrapeMetacriticUserScore(omdb.Title, year, type);
  if (metacriticUserScore) {
    ratings.push(metacriticUserScore);
  }
  
  // Sort ratings in the desired order
  const ratingOrder = [
    "Rotten Tomatoes Critics",
    "Rotten Tomatoes Users",
    "Metacritic Critics",
    "Metacritic Users",
    "IMDb Users",
    "TMDB Users",
  ];
  ratings.sort((a, b) => {
    const aIndex = ratingOrder.indexOf(a.source);
    const bIndex = ratingOrder.indexOf(b.source);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });
  
  // Use TMDB cast, fall back to OMDB actors if TMDB fails
  let cast = tmdbData.cast;
  if (cast.length === 0) {
    cast = parseActors(omdb.Actors);
  }

  return {
    movie: {
      id: omdb.imdbID,
      title: omdb.Title,
      year,
      type,
      posterUrl: omdb.Poster !== "N/A" ? omdb.Poster : "",
      plotSummary: omdb.Plot !== "N/A" ? omdb.Plot : "No plot summary available.",
      ratings,
      cast,
      director: omdb.Director !== "N/A" ? omdb.Director : undefined,
      genres: parseGenres(omdb.Genre),
      runtime: omdb.Runtime !== "N/A" ? omdb.Runtime : undefined,
      streaming: [],
    },
    warnings,
  };
}

export async function searchOMDB(query: string): Promise<{
  result: MovieResult | null;
  suggestions: Array<{ id: string; title: string; year: number | null; type: "movie" | "tv"; posterUrl: string }>;
  matchConfidence: "high" | "medium" | "low";
  warnings?: string[];
}> {
  if (!OMDB_API_KEY) {
    throw new Error("OMDB_API_KEY is not configured");
  }

  // First, search for titles matching the query
  const searchUrl = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`;
  const searchResponse = await fetch(searchUrl);
  const searchData: OMDBSearchResponse = await searchResponse.json();

  if (searchData.Response === "False" || !searchData.Search || searchData.Search.length === 0) {
    console.log("OMDB search failed:", searchData.Error || "No results");
    // Try direct title lookup as fallback
    const directUrl = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(query)}&plot=full`;
    const directResponse = await fetch(directUrl);
    const directData: OMDBResponse = await directResponse.json();

    if (directData.Response === "True") {
      const transformed = await transformOMDBToMovieResult(directData);
      return {
        result: transformed.movie,
        suggestions: [],
        matchConfidence: "medium",
        warnings: transformed.warnings.length > 0 ? transformed.warnings : undefined,
      };
    }
    
    console.log("OMDB direct lookup also failed:", directData.Error || "Unknown error");

    return {
      result: null,
      suggestions: [],
      matchConfidence: "low",
    };
  }

  // Get full details for the top result
  const topResult = searchData.Search[0];
  const detailUrl = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${topResult.imdbID}&plot=full`;
  const detailResponse = await fetch(detailUrl);
  const detailData: OMDBResponse = await detailResponse.json();

  if (detailData.Response === "False") {
    return {
      result: null,
      suggestions: [],
      matchConfidence: "low",
    };
  }

  // Build suggestions from other search results
  const suggestions = searchData.Search.slice(1, 6).map((item) => ({
    id: item.imdbID,
    title: item.Title,
    year: parseYear(item.Year),
    type: (item.Type === "series" ? "tv" : "movie") as "movie" | "tv",
    posterUrl: item.Poster !== "N/A" ? item.Poster : "",
  }));

  // Determine match confidence based on title similarity
  const resultTitle = detailData.Title.toLowerCase();
  const queryLower = query.toLowerCase();
  let matchConfidence: "high" | "medium" | "low" = "medium";

  if (resultTitle === queryLower || resultTitle.startsWith(queryLower) || queryLower.startsWith(resultTitle)) {
    matchConfidence = "high";
  } else if (resultTitle.includes(queryLower) || queryLower.includes(resultTitle)) {
    matchConfidence = "medium";
  } else {
    matchConfidence = "low";
  }

  const transformed = await transformOMDBToMovieResult(detailData);
  return {
    result: transformed.movie,
    suggestions,
    matchConfidence,
    warnings: transformed.warnings.length > 0 ? transformed.warnings : undefined,
  };
}

export async function getOMDBById(imdbId: string): Promise<{ movie: MovieResult; warnings: string[] } | null> {
  if (!OMDB_API_KEY) {
    throw new Error("OMDB_API_KEY is not configured");
  }

  const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`;
  const response = await fetch(url);
  const data: OMDBResponse = await response.json();

  if (data.Response === "False") {
    return null;
  }

  return await transformOMDBToMovieResult(data);
}
