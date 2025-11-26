# CineCite - Scripts & Database Management Guide

## Overview

This guide explains the utility scripts available for CineCite and provides practical examples of how to use them for development, testing, and production deployment.

## Quick Reference

### Database Management
```bash
npm run script:clean          # Delete all database data
npm run script:seed-admin     # Create admin user
npm run script:seed-users     # Create test users
```

### API Testing
```bash
npm run script:test-auth      # Test authentication flow
npm run script:test-search    # Test single search
npm run script:test-searches  # Test multiple searches
npm run script:test-contender # Test specific movie
```

## Common Workflows

### 1. Fresh Development Setup

When starting fresh or resetting your development environment:

```bash
# Step 1: Clean existing data
npm run script:clean

# Step 2: Create admin account
npm run script:seed-admin

# Step 3: Create test users
npm run script:seed-users
```

**Result:** Database with 5 users ready for testing.

### 2. Testing Authentication

To verify the authentication system works correctly:

```bash
# Requires server to be running on localhost:3000
npm run script:test-auth
```

**What it tests:**
- ✅ User registration
- ✅ Login with credentials
- ✅ Profile retrieval
- ✅ Token refresh
- ✅ Logout
- ✅ Protected route access denial

### 3. Testing Search/Scraping

To verify the web scraping and search functionality:

```bash
# Test single search query
npm run script:test-search

# Test multiple queries at once
npm run script:test-searches

# Test specific movie
npm run script:test-contender
```

**What it tests:**
- ✅ API endpoint connectivity
- ✅ Web scraping from RT, Metacritic, IMDB
- ✅ Data aggregation and formatting
- ✅ Response structure

### 4. Production Deployment Setup

Before deploying to production:

```bash
# Step 1: Clean any test data
npm run script:clean

# Step 2: Create production admin
npm run script:seed-admin

# Step 3: Change default password immediately!
# Use the admin credentials to log in and update password
```

**⚠️ Security Note:** Always change default passwords in production!

### 5. Daily Development Workflow

Typical day-to-day development:

```bash
# Morning: Fresh start
npm run script:clean
npm run script:seed-users

# Throughout the day: Test changes
npm run script:test-auth      # After auth changes
npm run script:test-search    # After scraping changes

# End of day: Clean up
npm run script:clean
```

## Default Credentials

### Admin User (production-ready)
- **Email:** `admin@cinecite.com`
- **Password:** `Admin123!@#`
- **Role:** admin
- **Created by:** `npm run script:seed-admin`

### Test Users (development only)

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| admin@test.com | Admin123! | admin | Test admin features |
| user1@test.com | User123! | user | General testing |
| user2@test.com | User123! | user | Multi-user scenarios |
| demo@test.com | Demo123! | user | Demo/presentation |

**Created by:** `npm run script:seed-users`

## Script Details

### Database Scripts

#### `script:clean`
**Purpose:** Removes ALL data from the database.

**Use Cases:**
- Resetting development environment
- Cleaning test data before production deployment
- Starting fresh after major schema changes

**⚠️ Warning:** Irreversible! All data will be permanently deleted.

```bash
npm run script:clean
```

**Output:**
```
🧹 Starting database cleanup...
✅ Database connected
📊 Found 5 user(s) in database
⚠️  WARNING: This will delete ALL data from the database!
✅ Deleted 5 user(s)
✅ Database cleanup completed successfully!
```

#### `script:seed-admin`
**Purpose:** Creates a default admin user.

**Use Cases:**
- Initial production setup
- Restoring admin access
- Quick admin account creation

**Features:**
- ✅ Checks for existing admin
- ✅ Won't create duplicates
- ✅ Secure password hashing

```bash
npm run script:seed-admin
```

**Output:**
```
🌱 Starting admin user seed...
✅ Database connected
✅ Admin user created successfully!
📧 Email: admin@cinecite.com
🔑 Password: Admin123!@#
👤 User ID: 507f1f77bcf86cd799439011
⚠️  IMPORTANT: Change this password after first login!
```

#### `script:seed-users`
**Purpose:** Creates multiple test users with different roles.

**Use Cases:**
- Development testing
- Demo preparation
- Multi-user feature testing

**Features:**
- ✅ Creates 4 users (1 admin, 3 regular)
- ✅ Skips existing users
- ✅ Summary report

```bash
npm run script:seed-users
```

**Output:**
```
🌱 Starting test users seed...
✅ Created: admin@test.com (admin)
✅ Created: user1@test.com (user)
✅ Created: user2@test.com (user)
✅ Created: demo@test.com (user)

📊 Summary:
   Created: 4 user(s)
   Skipped: 0 user(s)
   Total: 4 user(s)
```

### Testing Scripts

#### `script:test-auth`
**Purpose:** Comprehensive authentication flow validation.

**Requirements:**
- ✅ Server running on localhost:3000
- ✅ Database connected

**Tests:**
1. Registration with new email
2. Profile retrieval with token
3. Login with credentials
4. Token refresh mechanism
5. Logout functionality
6. Protected route access denial

```bash
npm run script:test-auth
```

**Success Output:**
```
🧪 Starting authentication flow test...
1️⃣  Testing registration... ✅
2️⃣  Testing get user profile... ✅
3️⃣  Testing login... ✅
4️⃣  Testing token refresh... ✅
5️⃣  Testing logout... ✅
6️⃣  Testing protected route after logout... ✅
✅ All authentication tests passed!
```

#### `script:test-search`
**Purpose:** Single search query test ("Breaking Bad").

**Requirements:**
- ✅ Server running
- ✅ Internet connection (for scraping)

```bash
npm run script:test-search
```

#### `script:test-searches`
**Purpose:** Multiple search queries (Inception, The Crown, Stranger Things).

**Use Cases:**
- Regression testing
- Performance benchmarking
- Rate limiting validation

```bash
npm run script:test-searches
```

#### `script:test-contender`
**Purpose:** Specific movie test ("The Contender").

**Use Cases:**
- Edge case testing
- Validation of specific title format

```bash
npm run script:test-contender
```

## Troubleshooting

### Script Fails: "Cannot connect to database"

**Problem:** MongoDB not running or connection string incorrect.

**Solution:**
```bash
# Check MongoDB is running
mongod --version

# Verify .env file has correct MONGODB_URL
cat server/.env | grep MONGODB_URL
```

### Script Fails: "ECONNREFUSED localhost:3000"

**Problem:** Server not running (affects test scripts).

**Solution:**
```bash
# Start the server
npm start
```

### Script Fails: "User already exists"

**Problem:** Trying to seed duplicate users.

**Solution:**
```bash
# Clean database first
npm run script:clean

# Then seed again
npm run script:seed-admin
```

### Script Fails: "Module not found"

**Problem:** Dependencies not installed.

**Solution:**
```bash
# Install dependencies
npm install

# Rebuild shared module
cd shared && npm run build && cd ..
```

## Best Practices

### 🔒 Security

1. **Never commit .env files** with real credentials
2. **Change default passwords** immediately in production
3. **Use strong passwords** (min 12 characters, mixed case, numbers, symbols)
4. **Rotate credentials** regularly

### 🧪 Testing

1. **Run scripts before committing** code changes
2. **Clean database** between major test runs
3. **Document test scenarios** in comments
4. **Keep test data realistic** but not production data

### 🚀 Deployment

1. **Clean database** before deploying to production
2. **Seed admin only** (not test users) in production
3. **Test scripts locally** before running on server
4. **Backup database** before running clean script

### 📝 Development

1. **Use test users** for development (not admin)
2. **Seed fresh data** at start of each day
3. **Run tests** after major changes
4. **Clean up** test data regularly

## Script Locations

All scripts are located in:
```
server/scripts/
├── README.md              # This guide
├── cleanDatabase.ts       # Clean all data
├── seedAdmin.ts          # Create admin user
├── seedTestUsers.ts      # Create test users
├── testAuth.ts           # Test authentication
├── testSearch.ts         # Test single search
├── testMultipleSearches.ts # Test multiple searches
└── testContender.ts      # Test specific movie
```

## Adding New Scripts

To add a new script:

1. Create `server/scripts/yourScript.ts`
2. Add command to `server/package.json`:
   ```json
   "scripts": {
     "script:your-script": "tsx scripts/yourScript.ts"
   }
   ```
3. Document it in `server/scripts/README.md`
4. Test it thoroughly
5. Commit

## Need Help?

- See `WHY_BACKEND.md` for architecture explanation
- See `server/scripts/README.md` for detailed script docs
- See `DEPLOYMENT.md` for production deployment
- Check server logs for error details

---

**Happy scripting! 🚀**
