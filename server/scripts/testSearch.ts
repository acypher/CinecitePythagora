import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testSearch() {
  console.log('========================================');
  console.log('Testing Search API');
  console.log('========================================\n');

  try {
    console.log('Searching for "Breaking Bad"...\n');

    const response = await axios.post(`${BASE_URL}/api/search`, {
      query: 'Breaking Bad'
    });

    console.log('✅ Search successful!\n');
    console.log('Response:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n========================================');
    console.log('Test completed successfully!');
    console.log('========================================');
  } catch (error) {
    console.error('❌ Search failed!\n');
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Error:', err.response?.data || err.message);
    console.log('\n========================================');
    console.log('Test failed!');
    console.log('========================================');
    process.exit(1);
  }
}

testSearch();
