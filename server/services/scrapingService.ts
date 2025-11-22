import axios from 'axios';
import * as cheerio from 'cheerio';
import Bottleneck from 'bottleneck';

// Rate limiter to prevent overwhelming target sites
const limiter = new Bottleneck({
  minTime: 1000, // Minimum 1 second between requests
  maxConcurrent: 1,
});

interface RatingData {
  source: string;
  criticsRating?: string;
  audienceRating?: string;
}

interface ScrapedData {
  title: string;
  year?: string;
  posterUrl?: string;
  ratings: RatingData[];
  plot?: string;
  cast?: string[];
  reviewerSummary?: string;
}

/**
 * Scrapes Rotten Tomatoes for movie/TV show data
 */
async function scrapeRottenTomatoes(query: string): Promise<Partial<ScrapedData>> {
  console.log(`[ScrapingService] Scraping Rotten Tomatoes for: ${query}`);

  try {
    // Search for the title
    const searchUrl = `https://www.rottentomatoes.com/search?search=${encodeURIComponent(query)}`;
    const response = await limiter.schedule(() =>
      axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      })
    );

    const $ = cheerio.load(response.data);

    // Try to find the first movie/TV result
    const firstResult = $('search-page-media-row').first();

    if (firstResult.length === 0) {
      console.log('[ScrapingService] No Rotten Tomatoes results found');
      return {
        ratings: [{
          source: 'Rotten Tomatoes',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    // Extract the link to the movie page
    const movieLink = firstResult.find('a[slot="title"]').attr('href');

    if (!movieLink) {
      console.log('[ScrapingService] No Rotten Tomatoes movie link found');
      return {
        ratings: [{
          source: 'Rotten Tomatoes',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    // Fetch the movie page
    const movieUrl = movieLink.startsWith('http') ? movieLink : `https://www.rottentomatoes.com${movieLink}`;
    const movieResponse = await limiter.schedule(() =>
      axios.get(movieUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      })
    );

    const $movie = cheerio.load(movieResponse.data);

    // Extract title
    const title = $movie('h1[slot="titleIntro"]').text().trim() ||
                  $movie('h1.title').text().trim() ||
                  query;

    // Extract year
    const year = $movie('p[slot="releaseDate"]').text().trim().match(/\d{4}/)?.[0];

    // Extract ratings
    const tomatometer = $movie('rt-button[slot="criticsScore"]').attr('percentage') ||
                       $movie('score-board').attr('tomatometerscore');
    const audienceScore = $movie('rt-button[slot="audienceScore"]').attr('percentage') ||
                         $movie('score-board').attr('audiencescore');

    // Extract plot
    const plot = $movie('p[slot="description"]').text().trim() ||
                $movie('div.movie_synopsis').text().trim();

    // Extract cast
    const cast: string[] = [];
    $movie('div.cast-item').each((_, el) => {
      const actorName = $movie(el).find('a').text().trim();
      if (actorName) cast.push(actorName);
    });

    console.log(`[ScrapingService] Rotten Tomatoes data extracted: Tomatometer=${tomatometer}%, Audience=${audienceScore}%`);

    return {
      title,
      year,
      ratings: [{
        source: 'Rotten Tomatoes',
        criticsRating: tomatometer ? `${tomatometer}%` : 'N/A',
        audienceRating: audienceScore ? `${audienceScore}%` : 'N/A',
      }],
      plot: plot || undefined,
      cast: cast.length > 0 ? cast.slice(0, 8) : undefined,
    };
  } catch (error) {
    console.error(`[ScrapingService] Rotten Tomatoes error: ${error.message}`);
    return {
      ratings: [{
        source: 'Rotten Tomatoes',
        criticsRating: 'N/A',
        audienceRating: 'N/A',
      }],
    };
  }
}

/**
 * Scrapes Metacritic for movie/TV show data
 */
async function scrapeMetacritic(query: string): Promise<Partial<ScrapedData>> {
  console.log(`[ScrapingService] Scraping Metacritic for: ${query}`);

  try {
    const searchUrl = `https://www.metacritic.com/search/${encodeURIComponent(query)}/`;
    const response = await limiter.schedule(() =>
      axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      })
    );

    const $ = cheerio.load(response.data);

    // Find first movie or TV result
    const firstResult = $('.c-finderProductCard').first();

    if (firstResult.length === 0) {
      console.log('[ScrapingService] No Metacritic results found');
      return {
        ratings: [{
          source: 'Metacritic',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    const movieLink = firstResult.find('a.c-finderProductCard_link').attr('href');

    if (!movieLink) {
      console.log('[ScrapingService] No Metacritic movie link found');
      return {
        ratings: [{
          source: 'Metacritic',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    // Fetch the movie page
    const movieUrl = movieLink.startsWith('http') ? movieLink : `https://www.metacritic.com${movieLink}`;
    const movieResponse = await limiter.schedule(() =>
      axios.get(movieUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      })
    );

    const $movie = cheerio.load(movieResponse.data);

    // Extract Metascore (critics)
    const metascore = $movie('.c-siteReviewScore_background span').first().text().trim() ||
                     $movie('div[title*="Metascore"]').text().trim();

    // Extract User Score
    const userScore = $movie('.c-siteReviewScore_user span').first().text().trim() ||
                     $movie('div.c-productScoreInfo_scoreNumber span').text().trim();

    // Extract plot summary
    const plot = $movie('.c-productionDetailsGame_description span').text().trim() ||
                $movie('.c-productDetails_description').text().trim();

    // Extract cast
    const cast: string[] = [];
    $movie('.c-castList_item').each((_, el) => {
      const actorName = $movie(el).find('span').first().text().trim();
      if (actorName) cast.push(actorName);
    });

    console.log(`[ScrapingService] Metacritic data extracted: Metascore=${metascore}, User Score=${userScore}`);

    return {
      ratings: [{
        source: 'Metacritic',
        criticsRating: metascore && metascore !== 'tbd' ? metascore : 'N/A',
        audienceRating: userScore && userScore !== 'tbd' ? userScore : 'N/A',
      }],
      plot: plot || undefined,
      cast: cast.length > 0 ? cast.slice(0, 8) : undefined,
    };
  } catch (error) {
    console.error(`[ScrapingService] Metacritic error: ${error.message}`);
    return {
      ratings: [{
        source: 'Metacritic',
        criticsRating: 'N/A',
        audienceRating: 'N/A',
      }],
    };
  }
}

/**
 * Scrapes IMDB for movie/TV show data
 */
async function scrapeIMDB(query: string): Promise<Partial<ScrapedData>> {
  console.log(`[ScrapingService] Scraping IMDB for: ${query}`);

  try {
    const searchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(query)}&s=tt&exact=true`;
    const response = await limiter.schedule(() =>
      axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000,
      })
    );

    const $ = cheerio.load(response.data);

    // Find first movie or TV result
    const firstResult = $('section[data-testid="find-results-section-title"] ul li').first();

    if (firstResult.length === 0) {
      console.log('[ScrapingService] No IMDB results found');
      return {
        ratings: [{
          source: 'IMDB',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    const movieLink = firstResult.find('a').attr('href');

    if (!movieLink) {
      console.log('[ScrapingService] No IMDB movie link found');
      return {
        ratings: [{
          source: 'IMDB',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    // Fetch the movie page
    const movieUrl = movieLink.startsWith('http') ? movieLink : `https://www.imdb.com${movieLink}`;
    const movieResponse = await limiter.schedule(() =>
      axios.get(movieUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000,
      })
    );

    const $movie = cheerio.load(movieResponse.data);

    // Extract title
    const title = $movie('h1[data-testid="hero__pageTitle"]').text().trim() ||
                 $movie('h1').first().text().trim() ||
                 query;

    // Extract year
    const year = $movie('a[href*="releaseinfo"]').first().text().trim() ||
                $movie('span.sc-').text().match(/\d{4}/)?.[0];

    // Extract rating
    const rating = $movie('div[data-testid="hero-rating-bar__aggregate-rating__score"] span').first().text().trim() ||
                  $movie('span[itemprop="ratingValue"]').text().trim();

    // Extract plot
    const plot = $movie('span[data-testid="plot-xl"]').text().trim() ||
                $movie('span[data-testid="plot-l"]').text().trim() ||
                $movie('p span.sc-').first().text().trim();

    // Extract poster
    const posterUrl = $movie('img[data-testid="hero-media__poster"]').attr('src') ||
                     $movie('div.ipc-media img').attr('src');

    // Extract cast
    const cast: string[] = [];
    $movie('a[data-testid="title-cast-item__actor"]').each((_, el) => {
      const actorName = $movie(el).text().trim();
      if (actorName) cast.push(actorName);
    });

    // Extract reviewer summary from first few reviews
    const reviewTexts: string[] = [];
    $movie('div.review-container div.text').slice(0, 3).each((_, el) => {
      const reviewText = $movie(el).text().trim();
      if (reviewText) reviewTexts.push(reviewText);
    });

    console.log(`[ScrapingService] IMDB data extracted: Rating=${rating}/10`);

    return {
      title,
      year,
      posterUrl,
      ratings: [{
        source: 'IMDB',
        criticsRating: rating ? `${rating}/10` : 'N/A',
        audienceRating: undefined, // IMDB doesn't separate critic/audience
      }],
      plot: plot || undefined,
      cast: cast.length > 0 ? cast.slice(0, 8) : undefined,
      reviewerSummary: reviewTexts.length > 0 ? reviewTexts.join(' ') : undefined,
    };
  } catch (error) {
    console.error(`[ScrapingService] IMDB error: ${error.message}`);
    return {
      ratings: [{
        source: 'IMDB',
        criticsRating: 'N/A',
        audienceRating: 'N/A',
      }],
    };
  }
}

/**
 * Aggregates data from multiple sources
 */
function aggregateData(rtData: Partial<ScrapedData>, mcData: Partial<ScrapedData>, imdbData: Partial<ScrapedData>): ScrapedData {
  console.log('[ScrapingService] Aggregating data from all sources');

  // Prioritize IMDB for title and basic info, fallback to RT, then MC
  const title = imdbData.title || rtData.title || mcData.title || 'Unknown';
  const year = imdbData.year || rtData.year || mcData.year;
  const posterUrl = imdbData.posterUrl;

  // Combine all ratings
  const ratings: RatingData[] = [
    ...(rtData.ratings || []),
    ...(mcData.ratings || []),
    ...(imdbData.ratings || []),
  ];

  // Prioritize plot: IMDB > RT > MC
  const plot = imdbData.plot || rtData.plot || mcData.plot;

  // Combine cast (prefer IMDB, fallback to others)
  const cast = imdbData.cast || rtData.cast || mcData.cast;

  // Use IMDB reviewer summary if available
  const reviewerSummary = imdbData.reviewerSummary;

  return {
    title,
    year,
    posterUrl,
    ratings,
    plot,
    cast,
    reviewerSummary,
  };
}

/**
 * Main function to scrape all sources and aggregate data
 */
export async function scrapeMediaData(query: string): Promise<ScrapedData> {
  console.log(`[ScrapingService] Starting scrape for query: ${query}`);

  try {
    // Run all scrapers in parallel for better performance
    const [rtData, mcData, imdbData] = await Promise.all([
      scrapeRottenTomatoes(query),
      scrapeMetacritic(query),
      scrapeIMDB(query),
    ]);

    const aggregatedData = aggregateData(rtData, mcData, imdbData);

    console.log(`[ScrapingService] Scraping completed successfully for: ${query}`);

    return aggregatedData;
  } catch (error) {
    console.error(`[ScrapingService] Fatal scraping error: ${error.message}`, error);
    throw new Error('Failed to scrape media data from all sources');
  }
}
