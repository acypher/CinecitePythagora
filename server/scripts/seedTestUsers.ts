import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';
import { generatePasswordHash } from '../utils/password';

dotenv.config();

interface TestUser {
  email: string;
  password: string;
  role: string;
  description: string;
}

const testUsers: TestUser[] = [
  {
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin',
    description: 'Test admin user',
  },
  {
    email: 'user1@test.com',
    password: 'User123!',
    role: 'user',
    description: 'Test regular user 1',
  },
  {
    email: 'user2@test.com',
    password: 'User123!',
    role: 'user',
    description: 'Test regular user 2',
  },
  {
    email: 'demo@test.com',
    password: 'Demo123!',
    role: 'user',
    description: 'Demo user for testing',
  },
];

const seedTestUsers = async () => {
  try {
    console.log('🌱 Starting test users seed...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    const createdUsers = [];
    const skippedUsers = [];

    for (const testUser of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: testUser.email });
        if (existingUser) {
          console.log(`⚠️  User already exists: ${testUser.email}`);
          skippedUsers.push(testUser.email);
          continue;
        }

        // Create user
        const passwordHash = await generatePasswordHash(testUser.password);
        const user = await User.create({
          email: testUser.email,
          passwordHash,
          role: testUser.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`✅ Created: ${testUser.email}`);
        console.log(`   Role: ${testUser.role}`);
        console.log(`   Password: ${testUser.password}`);
        console.log(`   Description: ${testUser.description}`);
        console.log(`   User ID: ${user._id}\n`);

        createdUsers.push(testUser.email);
      } catch (error) {
        console.error(`❌ Error creating user ${testUser.email}:`, error);
      }
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`   Created: ${createdUsers.length} user(s)`);
    console.log(`   Skipped: ${skippedUsers.length} user(s)`);
    console.log(`   Total: ${testUsers.length} user(s)`);

    if (createdUsers.length > 0) {
      console.log('\n✅ Test users created successfully!');
      console.log('\n📝 Login Credentials:');
      testUsers
        .filter((u) => createdUsers.includes(u.email))
        .forEach((u) => {
          console.log(`   ${u.email} / ${u.password} (${u.role})`);
        });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test users:', error);
    process.exit(1);
  }
};

seedTestUsers();
