import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import SearchCache from '../models/SearchCache';
import { scrapeMediaData } from '../services/scrapingService';

// Load environment variables
dotenv.config();

/**
 * Seeds the search cache with popular movies/shows
 * This helps reduce initial scraping load for common searches
 */
async function seedSearchCache() {
  console.log('🌱 Starting search cache seeding...\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // Popular titles to pre-cache
    const popularQueries = [
      'The Godfather',
      'Breaking Bad',
      'The Shawshank Redemption',
      'The Dark Knight',
      'Inception',
      'Stranger Things',
      'Game of Thrones',
      'The Crown',
      'Oppenheimer',
      'Barbie',
    ];

    console.log(`📊 Pre-caching ${popularQueries.length} popular titles...\n`);

    for (const query of popularQueries) {
      try {
        console.log(`🔍 Searching for: ${query}`);

        // Check if already cached
        const normalizedQuery = query.toLowerCase().trim();
        const existing = await SearchCache.findOne({ normalizedQuery });

        if (existing) {
          console.log(`  ⏭️  Already cached, skipping\n`);
          continue;
        }

        // Scrape fresh data
        const mediaData = await scrapeMediaData(query);

        // Calculate expiration (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Create cache entry
        await SearchCache.create({
          query,
          normalizedQuery,
          title: mediaData.title,
          year: mediaData.year,
          posterUrl: mediaData.posterUrl,
          ratings: mediaData.ratings,
          plot: mediaData.plot,
          cast: mediaData.cast,
          reviewerSummary: mediaData.reviewerSummary,
          searchCount: 1,
          lastSearchedAt: new Date(),
          expiresAt,
        });

        console.log(`  ✅ Cached: ${mediaData.title} (${mediaData.year || 'N/A'})`);
        console.log(`  📅 Expires: ${expiresAt.toISOString()}\n`);

        // Wait a bit to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`  ❌ Failed to cache ${query}:`, (error as Error).message);
        console.log('  Continuing with next title...\n');
      }
    }

    // Print summary
    const totalCached = await SearchCache.countDocuments();
    console.log('\n📊 Cache Summary:');
    console.log(`   Total cached searches: ${totalCached}`);
    console.log('   Cache duration: 7 days');

    console.log('\n✅ Search cache seeding completed!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Seeding failed:', (error as Error).message);
    console.error(error);
    process.exit(1);
  }
}

// Run the seeding
seedSearchCache();
