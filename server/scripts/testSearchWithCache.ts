import dotenv from 'dotenv';
import axios from 'axios';
import { connectDB } from '../config/database';
import SearchCache from '../models/SearchCache';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

/**
 * Tests the search functionality with cache simulation
 * Demonstrates the performance improvement from caching
 */
async function testSearchWithCache() {
  console.log('🧪 Testing Search with Cache Simulation\n');
  console.log('='.repeat(60));

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    const testQuery = process.argv[2] || 'The Matrix';
    console.log(`🔍 Test Query: "${testQuery}"\n`);

    // Check if query exists in cache
    const normalizedQuery = testQuery.toLowerCase().trim();
    const cachedResult = await SearchCache.findOne({ normalizedQuery });

    if (cachedResult) {
      console.log('✅ CACHE HIT!');
      console.log('-'.repeat(60));
      console.log(`Title: ${cachedResult.title}`);
      console.log(`Year: ${cachedResult.year || 'N/A'}`);
      console.log(`Cached: ${new Date(cachedResult.createdAt).toLocaleString()}`);
      console.log(`Search count: ${cachedResult.searchCount}`);
      console.log(`Expires: ${new Date(cachedResult.expiresAt).toLocaleString()}`);
      console.log('\n📊 Ratings:');
      cachedResult.ratings.forEach(rating => {
        console.log(`  ${rating.source}:`);
        if (rating.criticsRating) console.log(`    Critics: ${rating.criticsRating}`);
        if (rating.audienceRating) console.log(`    Audience: ${rating.audienceRating}`);
      });

      // Update search count and last searched date
      cachedResult.searchCount += 1;
      cachedResult.lastSearchedAt = new Date();
      await cachedResult.save();

      console.log('\n✨ Cache hit would save 5-15 seconds of scraping time!');
    } else {
      console.log('❌ CACHE MISS - Would perform live scraping');
      console.log('-'.repeat(60));

      // Make actual API call
      console.log('⏳ Making API request...\n');
      const startTime = Date.now();

      try {
        const response = await axios.post(`${API_BASE_URL}/api/search`, {
          query: testQuery
        }, {
          timeout: 30000,
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log(`✅ API Response received in ${duration} seconds`);
        console.log('-'.repeat(60));
        console.log(`Title: ${response.data.title}`);
        console.log(`Year: ${response.data.year || 'N/A'}`);
        console.log('\n📊 Ratings:');
        response.data.ratings?.forEach((rating: { source: string; criticsRating?: string; audienceRating?: string }) => {
          console.log(`  ${rating.source}:`);
          if (rating.criticsRating) console.log(`    Critics: ${rating.criticsRating}`);
          if (rating.audienceRating) console.log(`    Audience: ${rating.audienceRating}`);
        });

        // Cache the result
        console.log('\n💾 Caching result for future searches...');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await SearchCache.create({
          query: testQuery,
          normalizedQuery,
          title: response.data.title,
          year: response.data.year,
          posterUrl: response.data.posterUrl,
          ratings: response.data.ratings,
          plot: response.data.plot,
          cast: response.data.cast,
          reviewerSummary: response.data.reviewerSummary,
          searchCount: 1,
          lastSearchedAt: new Date(),
          expiresAt,
        });

        console.log('✅ Result cached successfully!');
        console.log(`📅 Cache expires: ${expiresAt.toLocaleString()}`);

      } catch (apiError) {
        const err = apiError as { response?: { data?: { error?: string } }; message: string };
        console.error('\n❌ API request failed:', err.response?.data?.error || err.message);
        console.log('\n💡 Make sure the server is running on port 3000');
        console.log('   Run: npm run dev');
        process.exit(1);
      }
    }

    // Show cache statistics
    console.log('\n' + '='.repeat(60));
    const totalCached = await SearchCache.countDocuments();
    const totalSearches = await SearchCache.aggregate([
      { $group: { _id: null, total: { $sum: '$searchCount' } } }
    ]);

    console.log('📈 Cache Statistics:');
    console.log(`   Cached queries: ${totalCached}`);
    console.log(`   Total searches: ${totalSearches[0]?.total || 0}`);
    if (totalSearches[0]?.total > 0) {
      const hitRate = ((totalCached / totalSearches[0].total) * 100).toFixed(1);
      console.log(`   Potential hit rate: ${hitRate}%`);
    }

    console.log('\n✅ Test completed!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed:', (error as Error).message);
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testSearchWithCache();
