import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';
import mongoose from 'mongoose';

dotenv.config();

const cleanDatabase = async () => {
  try {
    console.log('🧹 Starting database cleanup...');

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Get counts before deletion
    const userCount = await User.countDocuments();
    console.log(`📊 Found ${userCount} user(s) in database`);

    // Ask for confirmation (in automated scripts, we'll just proceed)
    console.log('⚠️  WARNING: This will delete ALL data from the database!');

    // Delete all users
    const userResult = await User.deleteMany({});
    console.log(`✅ Deleted ${userResult.deletedCount} user(s)`);

    // Get all collections and drop them
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      const collectionName = collection.collectionName;
      const count = await collection.countDocuments();
      if (count > 0) {
        await collection.deleteMany({});
        console.log(`✅ Cleaned collection: ${collectionName} (${count} documents)`);
      }
    }

    console.log('✅ Database cleanup completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  }
};

cleanDatabase();
