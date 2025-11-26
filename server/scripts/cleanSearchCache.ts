import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import SearchCache from '../models/SearchCache';

// Load environment variables
dotenv.config();

/**
 * Cleans old or expired search cache entries
 * Provides options for different cleanup strategies
 */
async function cleanSearchCache() {
  console.log('🧹 Search Cache Cleanup\n');
  console.log('='.repeat(60));

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    const totalBefore = await SearchCache.countDocuments();
    console.log(`📦 Current cache entries: ${totalBefore}\n`);

    if (totalBefore === 0) {
      console.log('⚠️  Cache is already empty. Nothing to clean.\n');
      process.exit(0);
    }

    // Cleanup strategies
    console.log('🔧 Cleanup Options:');
    console.log('1. Remove expired entries only');
    console.log('2. Remove entries older than 3 days');
    console.log('3. Remove entries with low search count (< 2)');
    console.log('4. Remove all cache entries');
    console.log('');

    // For automation, we'll remove expired entries
    // In a real scenario, you might pass an argument or use an interactive prompt
    const cleanupOption = process.argv[2] || '1';

    let deletedCount = 0;
    const now = new Date();

    switch (cleanupOption) {
      case '1':
        console.log('🗑️  Removing expired entries...');
        const expiredResult = await SearchCache.deleteMany({
          expiresAt: { $lte: now }
        });
        deletedCount = expiredResult.deletedCount || 0;
        console.log(`   Removed ${deletedCount} expired entries`);
        break;

      case '2':
        console.log('🗑️  Removing entries older than 3 days...');
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        const oldResult = await SearchCache.deleteMany({
          createdAt: { $lt: threeDaysAgo }
        });
        deletedCount = oldResult.deletedCount || 0;
        console.log(`   Removed ${deletedCount} old entries`);
        break;

      case '3':
        console.log('🗑️  Removing entries with low search count...');
        const lowCountResult = await SearchCache.deleteMany({
          searchCount: { $lt: 2 }
        });
        deletedCount = lowCountResult.deletedCount || 0;
        console.log(`   Removed ${deletedCount} low-traffic entries`);
        break;

      case '4':
        console.log('🗑️  Removing ALL cache entries...');
        const allResult = await SearchCache.deleteMany({});
        deletedCount = allResult.deletedCount || 0;
        console.log(`   Removed ${deletedCount} entries (entire cache cleared)`);
        break;

      default:
        console.log(`❌ Invalid option: ${cleanupOption}`);
        console.log('Usage: npm run script:clean-cache [1|2|3|4]');
        process.exit(1);
    }

    const totalAfter = await SearchCache.countDocuments();
    const percentReduced = totalBefore > 0
      ? ((deletedCount / totalBefore) * 100).toFixed(1)
      : 0;

    console.log('\n📊 Cleanup Summary:');
    console.log('-'.repeat(60));
    console.log(`Before:  ${totalBefore} entries`);
    console.log(`Deleted: ${deletedCount} entries`);
    console.log(`After:   ${totalAfter} entries`);
    console.log(`Reduced: ${percentReduced}%`);

    if (totalAfter > 0) {
      // Show what's left
      const oldestEntry = await SearchCache.findOne().sort({ createdAt: 1 });
      const newestEntry = await SearchCache.findOne().sort({ createdAt: -1 });

      if (oldestEntry && newestEntry) {
        console.log('\n📅 Remaining Cache Range:');
        console.log(`Oldest: ${new Date(oldestEntry.createdAt).toLocaleDateString()}`);
        console.log(`Newest: ${new Date(newestEntry.createdAt).toLocaleDateString()}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Cache cleanup completed!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Cleanup failed:', (error as Error).message);
    console.error(error);
    process.exit(1);
  }
}

// Run the cleanup
cleanSearchCache();
