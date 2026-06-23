// Script to verify Gemini API integration and itinerary generation
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateItinerary } from './utils/itineraryGenerator.js';

// Setup __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Using Gemini API Key:', process.env.GEMINI_API_KEY ? 'FOUND (starts with ' + process.env.GEMINI_API_KEY.slice(0, 7) + ')' : 'MISSING');

async function testGemini() {
  const testParams = {
    destination: 'Hunza Valley, Pakistan',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    budget: 35000,
    currency: 'PKR',
    travelStyle: 'adventure',
    travelers: 2
  };

  console.log('\n--- 1. Generating Itinerary via Gemini API ---');
  console.log('Parameters:', testParams);

  try {
    const result = await generateItinerary(testParams);
    
    console.log('\n--- 2. Generation Successful! ---');
    console.log('Destination:', result.destination);
    console.log('Dates:', result.startDate, 'to', result.endDate);
    console.log('Budget:', result.budget, result.currency);
    console.log('Travel Style:', result.travelStyle);
    console.log('Travelers:', result.travelers);
    console.log('Language Tips:', result.languageTips);
    
    console.log('\n--- 3. Verifying Itinerary Day-by-Day ---');
    if (!result.itinerary || !Array.isArray(result.itinerary)) {
      throw new Error('Itinerary is missing or not an array!');
    }
    
    console.log(`Found ${result.itinerary.length} days of plans.`);
    result.itinerary.forEach((day, index) => {
      console.log(`\nDay ${day.dayNumber} (${day.date}):`);
      if (!day.activities || !Array.isArray(day.activities)) {
        throw new Error(`Day ${day.dayNumber} is missing activities!`);
      }
      day.activities.forEach(act => {
        console.log(`  - [${act.timeSlot}] ${act.title}`);
        console.log(`    Location: ${act.locationName}`);
        console.log(`    Coordinates: ${JSON.stringify(act.coordinates)}`);
        console.log(`    Cost: ${act.costEstimate} ${act.costCurrency}`);
        console.log(`    Description: ${act.description}`);
        if (act.alternatives && act.alternatives.length > 0) {
          console.log(`    Alternatives: ${act.alternatives.map(a => a.title).join(', ')}`);
        }
      });
    });

    console.log('\n--- 4. Test Passed! ---');
  } catch (error) {
    console.error('\n--- Test Failed! ---');
    console.error(error);
    process.exit(1);
  }
}

testGemini();
