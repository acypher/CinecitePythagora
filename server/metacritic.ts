import type { Rating } from "@shared/schema";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function scrapeMetacriticUserScore(
  title: string,
  year: number | null,
  type: "movie" | "tv"
): Promise<Rating | null> {
  try {
    const slug = slugify(title);
    const mediaType = type === "tv" ? "tv" : "movie";
    const url = `https://www.metacritic.com/${mediaType}/${slug}/`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      console.log(`Metacritic: Failed to fetch ${url} - ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Look for user score patterns in the HTML
    // Metacritic user scores appear in various formats
    const patterns = [
      /data-v-[a-z0-9]+="">(\d+(?:\.\d+)?)<\/span>[\s\S]*?User Score/i,
      /"userscore"[^>]*>(\d+(?:\.\d+)?)</i,
      /class="[^"]*user[^"]*"[^>]*>(\d+(?:\.\d+)?)</i,
      /User Score[^<]*<[^>]*>(\d+(?:\.\d+)?)/i,
      /<span[^>]*class="[^"]*c-siteReviewScore[^"]*"[^>]*>(\d+(?:\.\d+)?)<\/span>/gi,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const score = parseFloat(match[1]);
        if (score >= 0 && score <= 10) {
          const scorePercent = Math.round(score * 10);
          return {
            source: "Metacritic Users",
            score: scorePercent,
            maxScore: 100,
            displayScore: `${scorePercent}`,
          };
        }
      }
    }

    // Try to find any score-like number near "user" text
    const userScoreMatch = html.match(/user[^<]{0,50}?(\d+(?:\.\d+)?)[^<]{0,20}(?:score|rating)/i);
    if (userScoreMatch && userScoreMatch[1]) {
      const score = parseFloat(userScoreMatch[1]);
      if (score >= 0 && score <= 10) {
        const scorePercent = Math.round(score * 10);
        return {
          source: "Metacritic Users",
          score: scorePercent,
          maxScore: 100,
          displayScore: `${scorePercent}`,
        };
      }
    }

    console.log("Metacritic: Could not find user score in HTML for", title);
    return null;
  } catch (error) {
    console.error("Metacritic scraping error:", error);
    return null;
  }
}
