import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testSearch(query: string) {
  console.log(`\n🔍 Searching for "${query}"...`);

  try {
    const response = await axios.post(`${BASE_URL}/api/search`, {
      query
    });

    console.log('✅ Success!');
    console.log(`   Title: ${response.data.title} (${response.data.year || 'N/A'})`);
    console.log(`   Ratings:`);
    response.data.ratings.forEach((rating: { source: string; criticsRating?: string; audienceRating?: string }) => {
      const critic = rating.criticsRating || 'N/A';
      const audience = rating.audienceRating || '-';
      console.log(`     ${rating.source}: ${critic}${audience !== '-' ? ` / ${audience}` : ''}`);
    });
    console.log(`   Plot: ${response.data.plot?.substring(0, 80)}...`);
    console.log(`   Cast: ${response.data.cast?.length || 0} members`);
  } catch (error) {
    console.error('❌ Failed!');
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    console.error(`   Error: ${err.response?.data?.error || err.message}`);
  }
}

async function runTests() {
  console.log('========================================');
  console.log('Testing Search API with Multiple Queries');
  console.log('========================================');

  await testSearch('Inception');
  await testSearch('The Crown');
  await testSearch('Stranger Things');

  console.log('\n========================================');
  console.log('All tests completed!');
  console.log('========================================');
}

runTests();
