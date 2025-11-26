import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';
import { generatePasswordHash } from '../utils/password';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('🌱 Starting admin user seed...');

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Admin user details
    const adminEmail = 'admin@cinecite.com';
    const adminPassword = 'Admin123!@#';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log(`   Email: ${adminEmail}`);
      process.exit(0);
    }

    // Create admin user
    const passwordHash = await generatePasswordHash(adminPassword);
    const adminUser = await User.create({
      email: adminEmail,
      passwordHash,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 User ID:', adminUser._id);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
