import type { Rating } from "@shared/schema";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getSlugVariations(title: string, year: number | null): string[] {
  const baseSlug = slugify(title);
  const variations = [baseSlug];
  
  // Try without leading articles (the, a, an)
  const withoutArticle = title
    .replace(/^(the|a|an)\s+/i, "")
    .trim();
  if (withoutArticle !== title) {
    variations.push(slugify(withoutArticle));
  }
  
  // Try with year appended (common for remakes/same-name movies)
  if (year) {
    variations.push(`${baseSlug}_${year}`);
    if (withoutArticle !== title) {
      variations.push(`${slugify(withoutArticle)}_${year}`);
    }
  }
  
  return variations;
}

export interface RTScores {
  audienceScore: Rating | null;
  criticsScore: number | null;
}

async function fetchRT(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    },
    redirect: "follow",
  });
}

export async function scrapeRottenTomatoes(
  title: string,
  year: number | null,
  type: "movie" | "tv"
): Promise<RTScores> {
  const emptyResult: RTScores = { audienceScore: null, criticsScore: null };
  
  try {
    const slugVariations = getSlugVariations(title, year);
    const mediaType = type === "tv" ? "tv" : "m";
    
    let html = "";
    let successUrl = "";
    
    // Try each slug variation until one works
    for (const slug of slugVariations) {
      const url = `https://www.rottentomatoes.com/${mediaType}/${slug}`;
      const response = await fetchRT(url);
      
      if (response.ok) {
        html = await response.text();
        if (html.length >= 5000) {
          successUrl = url;
          break;
        }
      }
    }
    
    if (!html || html.length < 5000) {
      console.log(`RT: Failed to fetch any URL variation for ${title}`);
      return emptyResult;
    }
    
    let audienceScore: Rating | null = null;
    let criticsScore: number | null = null;

    // Look for JSON embedded data with scorePercent and title
    // Pattern: "scorePercent":"XX%","title":"Popcornmeter" for audience
    // Pattern: "scorePercent":"XX%","title":"Tomatometer" for critics (or just look for criticsScore)
    
    // Extract audience score (Popcornmeter)
    const popcornMatch = html.match(/"scorePercent"\s*:\s*"(\d+)%"[^}]*"title"\s*:\s*"Popcornmeter"/i) ||
                         html.match(/"title"\s*:\s*"Popcornmeter"[^}]*"scorePercent"\s*:\s*"(\d+)%"/i);
    
    if (popcornMatch) {
      const score = parseInt(popcornMatch[1]);
      if (score >= 0 && score <= 100) {
        audienceScore = {
          source: "Rotten Tomatoes Users",
          score: score,
          maxScore: 100,
          displayScore: `${score}`,
        };
      }
    }
    
    // Extract critics score for verification
    const tomatoMatch = html.match(/"criticsScore"[^}]*"score"\s*:\s*"(\d+)"/i) ||
                        html.match(/"scorePercent"\s*:\s*"(\d+)%"[^}]*"title"\s*:\s*"Tomatometer"/i);
    
    if (tomatoMatch) {
      const score = parseInt(tomatoMatch[1]);
      if (score >= 0 && score <= 100) {
        criticsScore = score;
      }
    }

    // Fallback: try to find audienceScore in JSON format
    if (!audienceScore) {
      const audienceJsonMatch = html.match(/"audienceScore"[^}]*"scorePercent"\s*:\s*"(\d+)%"/i);
      if (audienceJsonMatch) {
        const score = parseInt(audienceJsonMatch[1]);
        if (score >= 0 && score <= 100) {
          audienceScore = {
            source: "Rotten Tomatoes Users",
            score: score,
            maxScore: 100,
            displayScore: `${score}`,
          };
        }
      }
    }

    if (!audienceScore && !criticsScore) {
      console.log("RT: Could not find scores in HTML for", title);
    }

    return { audienceScore, criticsScore };
  } catch (error) {
    console.error("RT scraping error:", error);
    return emptyResult;
  }
}
