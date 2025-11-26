import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import SearchCache from '../models/SearchCache';

// Load environment variables
dotenv.config();

/**
 * Displays search statistics from the cache
 */
async function showSearchStats() {
  console.log('📊 Search Statistics Report\n');
  console.log('='.repeat(60));

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // Total cached searches
    const totalCached = await SearchCache.countDocuments();
    console.log(`📦 Total Cached Searches: ${totalCached}`);

    if (totalCached === 0) {
      console.log('\n⚠️  No cached searches found.');
      console.log('💡 Run "npm run script:seed-cache" to populate cache with popular titles.\n');
      process.exit(0);
    }

    // Most searched titles
    console.log('\n🔥 Most Popular Searches:');
    console.log('-'.repeat(60));
    const topSearches = await SearchCache.find()
      .sort({ searchCount: -1 })
      .limit(10)
      .select('title year searchCount lastSearchedAt');

    topSearches.forEach((search, index) => {
      const lastSearched = new Date(search.lastSearchedAt).toLocaleDateString();
      console.log(`${index + 1}. ${search.title} (${search.year || 'N/A'})`);
      console.log(`   Searches: ${search.searchCount} | Last searched: ${lastSearched}`);
    });

    // Recently cached
    console.log('\n🆕 Recently Cached:');
    console.log('-'.repeat(60));
    const recentSearches = await SearchCache.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title year createdAt');

    recentSearches.forEach((search, index) => {
      const cachedDate = new Date(search.createdAt).toLocaleDateString();
      console.log(`${index + 1}. ${search.title} (${search.year || 'N/A'}) - ${cachedDate}`);
    });

    // Expiring soon
    console.log('\n⏰ Expiring Soon (within 24 hours):');
    console.log('-'.repeat(60));
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const expiringSoon = await SearchCache.find({
      expiresAt: { $lte: tomorrow }
    })
      .sort({ expiresAt: 1 })
      .select('title year expiresAt');

    if (expiringSoon.length === 0) {
      console.log('None');
    } else {
      expiringSoon.forEach((search, index) => {
        const expiresDate = new Date(search.expiresAt).toLocaleString();
        console.log(`${index + 1}. ${search.title} (${search.year || 'N/A'}) - expires ${expiresDate}`);
      });
    }

    // Cache age distribution
    console.log('\n📅 Cache Age Distribution:');
    console.log('-'.repeat(60));
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const last24h = await SearchCache.countDocuments({ createdAt: { $gte: oneDayAgo } });
    const last3days = await SearchCache.countDocuments({ createdAt: { $gte: threeDaysAgo, $lt: oneDayAgo } });
    const lastWeek = await SearchCache.countDocuments({ createdAt: { $gte: weekAgo, $lt: threeDaysAgo } });
    const older = await SearchCache.countDocuments({ createdAt: { $lt: weekAgo } });

    console.log(`Last 24 hours: ${last24h}`);
    console.log(`2-3 days ago:  ${last3days}`);
    console.log(`4-7 days ago:  ${lastWeek}`);
    console.log(`Older:         ${older}`);

    // Average search count
    const avgResult = await SearchCache.aggregate([
      {
        $group: {
          _id: null,
          avgSearchCount: { $avg: '$searchCount' },
          totalSearches: { $sum: '$searchCount' }
        }
      }
    ]);

    if (avgResult.length > 0) {
      console.log('\n📈 Search Metrics:');
      console.log('-'.repeat(60));
      console.log(`Total searches performed: ${avgResult[0].totalSearches}`);
      console.log(`Average searches per title: ${avgResult[0].avgSearchCount.toFixed(2)}`);
      console.log(`Cache hit potential: ${((totalCached / avgResult[0].totalSearches) * 100).toFixed(1)}%`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Statistics report complete!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Failed to generate statistics:', (error as Error).message);
    console.error(error);
    process.exit(1);
  }
}

// Run the stats
showSearchStats();
