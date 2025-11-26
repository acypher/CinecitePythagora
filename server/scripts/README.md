# Server Scripts

This directory contains utility scripts for database management, seeding, and testing.

## Why Does This Backend Exist?

The backend server is **essential** for CineCite because:

1. **Web Scraping Cannot Run in Browser**
   - CORS (Cross-Origin Resource Security) policies prevent browsers from scraping external websites
   - Rotten Tomatoes, Metacritic, and IMDB don't provide public APIs
   - Server-side scraping bypasses CORS restrictions

2. **Rate Limiting & Request Management**
   - Prevents overwhelming scraped websites with too many requests
   - Implements delays and throttling to avoid being blocked
   - Uses server-side libraries like Cheerio and Axios

3. **User Authentication & Data Persistence**
   - Secure password hashing with bcrypt
   - JWT token management for sessions
   - MongoDB for storing user accounts and preferences

4. **Performance & Caching**
   - Server can implement caching strategies
   - Reduces redundant scraping requests
   - Better control over API rate limits

5. **Security**
   - Keeps API keys and secrets secure (not exposed in frontend code)
   - Validates and sanitizes scraped HTML before sending to client
   - Protects against XSS and injection attacks

## Available Scripts

### Database Management

#### Clean Database
Removes all data from the database (useful for testing).

```bash
npm run script:clean
```

**⚠️ Warning:** This permanently deletes all data!

### Seed Scripts

#### Seed Admin User
Creates a default admin user for testing and initial setup.

```bash
npm run script:seed-admin
```

**Default Credentials:**
- Email: `admin@cinecite.com`
- Password: `Admin123!@#`

#### Seed Test Users
Creates multiple test users with different roles.

```bash
npm run script:seed-users
```

**Test Users Created:**
- `admin@test.com` / `Admin123!` (admin role)
- `user1@test.com` / `User123!` (user role)
- `user2@test.com` / `User123!` (user role)
- `demo@test.com` / `Demo123!` (user role)

### Cache Management Scripts

#### Seed Search Cache
Pre-caches popular movie and TV show searches to reduce scraping load.

```bash
npm run script:seed-cache
```

This script:
- Fetches and caches 10+ popular titles
- Sets 7-day expiration for cached entries
- Helps reduce initial load time for common searches
- Can take 30-60 seconds due to rate limiting

#### View Search Statistics
Displays analytics about cached searches and usage patterns.

```bash
npm run script:search-stats
```

Shows:
- Most popular searches
- Recently cached titles
- Expiring cache entries
- Cache age distribution
- Search metrics and hit rates

#### Clean Search Cache
Removes old or expired cache entries with multiple cleanup options.

```bash
npm run script:clean-cache [option]
```

Options:
- `1` - Remove expired entries only (default)
- `2` - Remove entries older than 3 days
- `3` - Remove entries with low search count (< 2)
- `4` - Remove all cache entries

Examples:
```bash
npm run script:clean-cache 1    # Clean expired only
npm run script:clean-cache 4    # Clear entire cache
```

#### Test Search with Cache
Tests search functionality while demonstrating cache performance benefits.

```bash
npm run script:test-cache ["query"]
```

Examples:
```bash
npm run script:test-cache "The Matrix"
npm run script:test-cache "Breaking Bad"
```

This script:
- Checks if query exists in cache (cache hit)
- If not cached, performs live API search (cache miss)
- Automatically caches new searches
- Shows time savings from caching

### API Testing Scripts

#### Test Search API
Tests the media search endpoint with a sample query.

```bash
npm run script:test-search
```

#### Test Multiple Searches
Runs multiple search queries to validate the scraping service.

```bash
npm run script:test-searches
```

#### Test Authentication Flow
Tests the complete authentication flow (register, login, profile, refresh, logout).

```bash
npm run script:test-auth
```

#### Test Specific Movie (The Contender)
Tests scraping for a specific movie to validate rating aggregation.

```bash
npm run script:test-contender
```

## Common Use Cases

### Setting Up Development Environment
```bash
# 1. Clean existing data
npm run script:clean

# 2. Seed admin user
npm run script:seed-admin

# 3. Seed test users
npm run script:seed-users

# 4. Test authentication
npm run script:test-auth
```

### Testing Search Functionality
```bash
# Run single search test
npm run script:test-search

# Run multiple searches
npm run script:test-searches

# Test specific movie
npm run script:test-contender
```

### Resetting for Production
```bash
# Clean all test data
npm run script:clean

# Create admin user only
npm run script:seed-admin
```

## Script Development Guidelines

When creating new scripts:

1. **Always use TypeScript** for type safety
2. **Import dotenv** at the top: `import dotenv from 'dotenv'; dotenv.config();`
3. **Connect to database** using `connectDB()` from `config/database`
4. **Handle errors gracefully** with try/catch blocks
5. **Log meaningful messages** with emojis for readability
6. **Exit with proper codes**: `process.exit(0)` for success, `process.exit(1)` for errors
7. **Add comments** explaining complex logic

## Adding New Scripts

1. Create your script in `server/scripts/your-script.ts`
2. Add script command to `server/package.json`:
   ```json
   "scripts": {
     "script:your-script": "tsx scripts/your-script.ts"
   }
   ```
3. Document it in this README
4. Test it thoroughly before committing
