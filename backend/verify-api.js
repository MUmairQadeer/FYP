// Global fetch is used natively in Node.js

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runVerificationTests = async () => {
  console.log('Starting automated route verification tests...');
  let jwtToken = '';
  let tripId = '';
  let expenseId = '';

  try {
    // 1. Test Base Endpoint
    console.log('\n--- 1. Testing Base Endpoint ---');
    const baseRes = await fetch(`${BASE_URL}`);
    const baseData = await baseRes.json();
    console.log('Status Response:', baseData);
    if (baseRes.status !== 200 || !baseData.message) {
      throw new Error('Base endpoint failure');
    }

    // 2. Register Test User
    console.log('\n--- 2. Testing User Registration ---');
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Traveler',
        email: testEmail,
        password: 'Password123'
      })
    });
    const regData = await regRes.json();
    console.log('Register Response:', regData);
    if (regRes.status !== 201 || !regData.token) {
      throw new Error('Registration failed');
    }
    jwtToken = regData.token;

    // 3. Login Test User
    console.log('\n--- 3. Testing User Login ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
    if (loginRes.status !== 200 || !loginData.token) {
      throw new Error('Login failed');
    }

    // 4. Get Profile
    console.log('\n--- 4. Testing Profile Route ---');
    const profileRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    });
    const profileData = await profileRes.json();
    console.log('Profile Response:', profileData);
    if (profileRes.status !== 200 || profileData.email !== testEmail) {
      throw new Error('Profile retrieval failed');
    }

    // 5. Generate Trip (AI Itinerary Fallback/Mock Mode)
    console.log('\n--- 5. Testing Trip Generation ---');
    const genRes = await fetch(`${BASE_URL}/trips/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        destination: 'Lahore, Pakistan',
        startDate: '2026-10-01',
        endDate: '2026-10-04',
        budget: 50000,
        currency: 'PKR',
        travelStyle: 'cultural',
        travelers: 2
      })
    });
    const genData = await genRes.json();
    console.log('Generated Itinerary Day 1 Sample:', genData.itinerary[0]);
    if (genRes.status !== 200 || !genData.itinerary || genData.itinerary.length !== 4) {
      throw new Error('Trip generation failed');
    }

    // 6. Save Trip
    console.log('\n--- 6. Testing Save Trip ---');
    const saveRes = await fetch(`${BASE_URL}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        ...genData,
        isPublic: true
      })
    });
    const saveData = await saveRes.json();
    console.log('Saved Trip ID:', saveData._id);
    if (saveRes.status !== 201 || !saveData._id) {
      throw new Error('Save trip failed');
    }
    tripId = saveData._id;

    // 7. Get User Trips
    console.log('\n--- 7. Testing Get User Trips ---');
    const getTripsRes = await fetch(`${BASE_URL}/trips`, {
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    });
    const getTripsData = await getTripsRes.json();
    console.log('Number of User Trips found:', getTripsData.length);
    if (getTripsRes.status !== 200 || getTripsData.length === 0) {
      throw new Error('Get user trips failed');
    }

    // 8. Add Expense
    console.log('\n--- 8. Testing Log Expense ---');
    const expRes = await fetch(`${BASE_URL}/trips/${tripId}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        title: 'Dinner at Food Street',
        amount: 3500,
        category: 'food',
        currency: 'PKR'
      })
    });
    const expData = await expRes.json();
    console.log('Logged Expense:', expData);
    if (expRes.status !== 201 || !expData._id) {
      throw new Error('Log expense failed');
    }
    expenseId = expData._id;

    // 9. Get Expense Tracker Breakdown
    console.log('\n--- 9. Testing Expense Summary ---');
    const summaryRes = await fetch(`${BASE_URL}/trips/${tripId}/expenses`, {
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    });
    const summaryData = await summaryRes.json();
    console.log('Expense Summary Data:', summaryData.summary);
    if (summaryRes.status !== 200 || summaryData.expenses.length === 0) {
      throw new Error('Get expense summary failed');
    }

    // 10. Travel Tools Verification
    console.log('\n--- 10. Testing Travel Tools ---');
    
    // 10a. Visa Checker
    const visaRes = await fetch(`${BASE_URL}/tools/visa?passport=Pakistan&destination=Turkey`);
    const visaData = await visaRes.json();
    console.log('Visa Checker Response:', visaData);
    if (visaRes.status !== 200 || !visaData.requirement) {
      throw new Error('Visa tool failed');
    }

    // 10b. Weather Forecast
    const weatherRes = await fetch(`${BASE_URL}/tools/weather?destination=Hunza`);
    const weatherData = await weatherRes.json();
    console.log('Weather Forecast Day 1:', weatherData.forecast[0]);
    if (weatherRes.status !== 200 || weatherData.forecast.length !== 7) {
      throw new Error('Weather tool failed');
    }

    // 10c. Country Info (adapters/currency)
    const infoRes = await fetch(`${BASE_URL}/tools/country-info?country=Japan`);
    const infoData = await infoRes.json();
    console.log('Country Info Response:', infoData);
    if (infoRes.status !== 200 || !infoData.plugs) {
      throw new Error('Country Info tool failed');
    }

    // 10d. Prayer Times
    const prayerRes = await fetch(`${BASE_URL}/tools/prayer-times?destination=Lahore`);
    const prayerData = await prayerRes.json();
    console.log('Prayer Times Response:', prayerData.prayerTimes);
    if (prayerRes.status !== 200 || !prayerData.prayerTimes.Fajr) {
      throw new Error('Prayer Times tool failed');
    }

    console.log('\n=========================================');
    console.log('ALL BACKEND ROUTE TESTS COMPLETED SUCCESSFULLY!');
    console.log('=========================================');
    process.exit(0);
  } catch (error) {
    console.error('\n=========================================');
    console.error('VERIFICATION TEST FAILED!');
    console.error(error.message);
    console.error('=========================================');
    process.exit(1);
  }
};

runVerificationTests();
