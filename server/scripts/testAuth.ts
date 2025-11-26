import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

interface RefreshResponse {
  accessToken: string;
}

interface UserResponse {
  user: {
    _id: string;
    email: string;
    role: string;
  };
}

const testAuth = async () => {
  try {
    console.log('🧪 Starting authentication flow test...\n');

    // Test data
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Test123!@#';

    // Step 1: Register
    console.log('1️⃣  Testing registration...');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);

    const registerResponse = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/register`,
      {
        email: testEmail,
        password: testPassword,
      }
    );

    console.log('✅ Registration successful!');
    console.log(`   User ID: ${registerResponse.data.user._id}`);
    console.log(`   Role: ${registerResponse.data.user.role}`);
    console.log(`   Access Token: ${registerResponse.data.accessToken.substring(0, 20)}...`);

    const { accessToken, refreshToken } = registerResponse.data;

    // Step 2: Get user profile
    console.log('\n2️⃣  Testing get user profile...');

    const profileResponse = await axios.get<UserResponse>(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('✅ Profile retrieved successfully!');
    console.log(`   Email: ${profileResponse.data.user.email}`);
    console.log(`   Role: ${profileResponse.data.user.role}`);

    // Step 3: Login
    console.log('\n3️⃣  Testing login...');

    const loginResponse = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPassword,
    });

    console.log('✅ Login successful!');
    console.log(`   New Access Token: ${loginResponse.data.accessToken.substring(0, 20)}...`);

    // Step 4: Refresh token
    console.log('\n4️⃣  Testing token refresh...');

    const refreshResponse = await axios.post<RefreshResponse>(
      `${API_BASE_URL}/auth/refresh`,
      {
        refreshToken,
      }
    );

    console.log('✅ Token refresh successful!');
    console.log(`   New Access Token: ${refreshResponse.data.accessToken.substring(0, 20)}...`);

    // Step 5: Logout
    console.log('\n5️⃣  Testing logout...');

    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('✅ Logout successful!');

    // Step 6: Try to access protected route after logout
    console.log('\n6️⃣  Testing protected route after logout...');

    try {
      await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('❌ ERROR: Should not be able to access protected route after logout');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log('✅ Protected route correctly denied access after logout');
      } else {
        throw error;
      }
    }

    console.log('\n✅ All authentication tests passed!');
    process.exit(0);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Authentication test failed:', error.response?.data || error.message);
    } else {
      console.error('❌ Authentication test failed:', error);
    }
    process.exit(1);
  }
};

testAuth();
