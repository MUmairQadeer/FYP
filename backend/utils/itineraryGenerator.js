// High-quality travel plans generator (OpenAI or Local fallback)

// Local database of detailed POIs for popular destinations to provide stunning mock data
const destinationDatabase = {
  lahore: {
    currency: 'PKR',
    coordinates: { lat: 31.5204, lng: 74.3587 },
    pois: [
      { name: 'Badshahi Mosque & Lahore Fort', lat: 31.5881, lng: 74.3096, description: 'Explore the grand Mughal architecture, majestic arches, and historical museum inside the fort.' },
      { name: 'Wazir Khan Mosque & Delhi Gate', lat: 31.5822, lng: 74.3214, description: 'Walk through the historical streets of the Walled City and witness the exquisite tile work of Wazir Khan.' },
      { name: 'Fort Road Food Street', lat: 31.5895, lng: 74.3121, description: 'Enjoy traditional Lahori cuisine (Siri Paye, Karahi) with a breathtaking rooftop view of the illuminated Badshahi Mosque.' },
      { name: 'Shalimar Gardens', lat: 31.5861, lng: 74.3731, description: 'Stroll around the UNESCO World Heritage Mughal garden complex featuring triple-terraced lawns and hundreds of fountains.' },
      { name: 'Wagah Border Ceremony', lat: 31.6047, lng: 74.5744, description: 'Witness the high-energy military drill and flag-lowering ceremony conducted jointly by Pakistan and India border forces.' },
      { name: 'Anarkali Bazaar & Lahore Museum', lat: 31.5684, lng: 74.3083, description: 'Browse one of Asia\'s oldest surviving markets and view rich Gandharan art and historical manuscripts in the museum.' },
      { name: 'Greater Iqbal Park & Minar-e-Pakistan', lat: 31.5925, lng: 74.3092, description: 'Visit the national monument marking the location of the Pakistan Resolution, surrounded by lush green lawns and dancing fountains.' },
      { name: 'Yousuf Falooda & Liberty Market', lat: 31.5097, lng: 74.3484, description: 'Indulge in some shopping at Liberty and treat yourself to the famous traditional Rabri Falooda.' }
    ]
  },
  hunza: {
    currency: 'PKR',
    coordinates: { lat: 36.3167, lng: 74.6500 },
    pois: [
      { name: 'Baltit Fort', lat: 36.3217, lng: 74.6719, description: 'Visit the 700-year-old Tibetan-influenced fort offering majestic panoramic views of Karimabad and surrounding peaks.' },
      { name: 'Altit Fort & Royal Gardens', lat: 36.3142, lng: 74.6908, description: 'Explore the oldest monument in Hunza (900 years old) standing tall on a sheer cliff above the Indus River.' },
      { name: 'Attabad Lake boating', lat: 36.3101, lng: 74.8653, description: 'Enjoy a boat ride on the breathtaking, vibrant turquoise waters of the landslide-formed lake surrounded by Karakoram peaks.' },
      { name: 'Passu Cones view & Glacier trek', lat: 36.4789, lng: 74.8967, description: 'Photograph the iconic jagged cathedral peaks of Passu and enjoy a small trek to the white glacier.' },
      { name: 'Eagle\'s Nest Duiker sunset', lat: 36.3312, lng: 74.6901, description: 'Watch the sun paint the snow-capped Rakaposhi, Golden Peak, and Ladyfinger peaks with gold from the highest viewpoint.' },
      { name: 'Hussaini Suspension Bridge', lat: 36.4222, lng: 74.8778, description: 'Walk across the adventurous, widely-spaced wooden plank bridge suspended over the rushing Hunza River.' },
      { name: 'Karimabad Bazaar shopping', lat: 36.3198, lng: 74.6685, description: 'Shop for local handicrafts, gemstones, handmade rugs, and delicious dried apricots and walnuts.' },
      { name: 'Cafe de Hunza Walnut Cake', lat: 36.3201, lng: 74.6690, description: 'Relax at the famous cafe, sip local herbal tumuro tea, and eat their legendary walnut cake.' }
    ]
  },
  paris: {
    currency: 'EUR',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    pois: [
      { name: 'Eiffel Tower & Champ de Mars', lat: 48.8584, lng: 2.2945, description: 'Ascend the iconic wrought-iron tower for breathtaking city views and enjoy a picnic on the lawns below.' },
      { name: 'Louvre Museum', lat: 48.8606, lng: 2.3376, description: 'Marvel at world-class masterpieces including the Mona Lisa and Venus de Milo in the world\'s largest art museum.' },
      { name: 'Notre-Dame Cathedral & Seine River Cruise', lat: 48.8530, lng: 2.3499, description: 'Admire the gothic cathedral and embark on a relaxing glass-canopy boat tour to see Paris from the river.' },
      { name: 'Champs-Élysées & Arc de Triomphe', lat: 48.8738, lng: 2.2950, description: 'Walk the famous shopping avenue up to the colossal triumphal arch honoring French military victories.' },
      { name: 'Sacré-Cœur & Montmartre', lat: 48.8867, lng: 2.3431, description: 'Explore the bohemian artists\' quarter and visit the white-domed basilica perched on Paris\'s highest hill.' },
      { name: 'Palace of Versailles', lat: 48.8049, lng: 2.1204, description: 'Take a short trip to see the opulent Hall of Mirrors and the expansive, manicured palace gardens.' },
      { name: 'Musée d\'Orsay', lat: 48.8600, lng: 2.3266, description: 'View the world\'s finest collection of Impressionist and Post-Impressionist paintings inside a grand former railway station.' },
      { name: 'Le Marais food walk', lat: 48.8575, lng: 2.3601, description: 'Sample delicious French pastries, cheeses, and street food in this trendy, historic neighborhood.' }
    ]
  },
  tokyo: {
    currency: 'JPY',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    pois: [
      { name: 'Shibuya Crossing & Hachiko Statue', lat: 35.6580, lng: 139.7016, description: 'Experience the world\'s busiest pedestrian intersection and pay respects to the legendary loyal dog statue.' },
      { name: 'Senso-ji Temple (Asakusa)', lat: 35.7148, lng: 139.7967, description: 'Explore Tokyo\'s oldest Buddhist temple and stroll down Nakamise shopping street for traditional souvenirs.' },
      { name: 'Meiji Shrine & Harajuku', lat: 35.6764, lng: 139.6993, description: 'Walk through a serene cedar forest to the Shinto shrine, then dive into the vibrant youth culture of Takeshita Street.' },
      { name: 'Shinjuku Gyoen National Garden', lat: 35.6852, lng: 139.7101, description: 'Relax in one of Tokyo\'s largest and most beautiful parks, featuring traditional Japanese, English, and French gardens.' },
      { name: 'Akihabara Electric Town', lat: 35.6997, lng: 139.7715, description: 'Explore the hub of anime, manga, retro video games, and multi-story electronics shops.' },
      { name: 'Tokyo Skytree', lat: 35.7101, lng: 139.8107, description: 'Ascend the tallest tower in the world for an unparalleled 360-degree view of the Tokyo metropolis (and Mt. Fuji on clear days).' },
      { name: 'Tsukiji Outer Market', lat: 35.6655, lng: 139.7699, description: 'Tast test incredibly fresh sushi, grilled seafood, tamagoyaki (sweet omelet), and local delicacies.' },
      { name: 'TeamLab Planets digital art', lat: 35.6489, lng: 139.7901, description: 'Immerse yourself in a museum where you walk through water and interact with colorful, projected digital art installations.' }
    ]
  },
  dubai: {
    currency: 'AED',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    pois: [
      { name: 'Burj Khalifa & Dubai Mall', lat: 25.1972, lng: 55.2744, description: 'Go to the 124th-floor observation deck of the world\'s tallest building and watch the spectacular fountain show.' },
      { name: 'Desert Safari & BBQ Dinner', lat: 24.9547, lng: 55.5890, description: 'Experience adrenaline-pumping dune bashing, camel riding, sandboarding, and a traditional buffet dinner in a desert camp.' },
      { name: 'Dubai Marina & Yacht Cruise', lat: 25.0805, lng: 55.1403, description: 'Stroll along the marina promenade surrounded by futuristic skyscrapers, or board a sunset boat cruise.' },
      { name: 'Old Dubai & Gold/Spice Souks', lat: 25.2687, lng: 55.2974, description: 'Ride a traditional wooden Abra boat across Dubai Creek and bargain for gold, spices, and perfumes.' },
      { name: 'Palm Jumeirah & Atlantis Aquaventure', lat: 25.1304, lng: 55.1172, description: 'Visit the world-famous man-made palm-shaped island and enjoy thrilling waterslides at the waterpark.' },
      { name: 'Museum of the Future', lat: 25.2192, lng: 55.2818, description: 'Explore futuristic technologies, space exploration, and bio-design inside an architectural marvel.' },
      { name: 'Global Village', lat: 25.0682, lng: 55.3005, description: 'Browse pavilions representing 80+ cultures with authentic crafts, cultural shows, and global street food.' },
      { name: 'Miracle Garden', lat: 25.0594, lng: 55.2443, description: 'Wander through a 72,000 sqm garden displaying over 150 million blooming flowers arranged in extravagant shapes.' }
    ]
  },
  new_york: {
    currency: 'USD',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    pois: [
      { name: 'Empire State Building & Times Square', lat: 40.7484, lng: -73.9857, description: 'Take in views from the famous art-deco skyscraper and stand amidst the neon billboard lights of Times Square.' },
      { name: 'Statue of Liberty & Ellis Island', lat: 40.6892, lng: -74.0445, description: 'Take the ferry to visit America\'s symbol of freedom and explore the immigration museum.' },
      { name: 'Central Park tour', lat: 40.7851, lng: -73.9683, description: 'Walk, cycle, or take a carriage ride through the sprawling 843-acre urban park containing lakes, castles, and a zoo.' },
      { name: 'Metropolitan Museum of Art (The Met)', lat: 40.7794, lng: -73.9632, description: 'Examine over two million works of art spanning 5,000 years of global history in a colossal museum.' },
      { name: 'Brooklyn Bridge walk', lat: 40.7061, lng: -73.9969, description: 'Stroll across the historic suspension bridge from Manhattan to Brooklyn for beautiful skyline views at sunset.' },
      { name: 'High Line park & Chelsea Market', lat: 40.7480, lng: -74.0048, description: 'Walk along the elevated, planted railway line and stop for gourmet food at Chelsea Market.' },
      { name: 'Top of the Rock (Rockefeller Center)', lat: 40.7587, lng: -73.9787, description: 'Get an incredible view of Manhattan including the Empire State Building and Central Park.' },
      { name: 'Broadway Show & Theater District', lat: 40.7590, lng: -73.9845, description: 'Catch a world-famous musical performance in the heart of New York\'s entertainment district.' }
    ]
  }
};

// Travel Phrases helper (FR-14)
const languageTipsDatabase = {
  pakistan: ['Assalam-o-Alaikum (Peace be upon you / Hello)', 'Shukriya (Thank you)', 'Aap kaise hain? (How are you?)', 'Yeh kitne ka hai? (How much is this?)', 'Paani (Water)', 'Allah Hafiz (Goodbye)'],
  france: ['Bonjour (Hello)', 'Merci (Thank you)', 'S\'il vous plaît (Please)', 'Combien ça coûte? (How much does it cost?)', 'Où sont les toilettes? (Where is the bathroom?)', 'Au revoir (Goodbye)'],
  japan: ['Konnichiwa (Hello)', 'Arigatou gozaimasu (Thank you)', 'Sumimasen (Excuse me)', 'Ikura desu ka? (How much is it?)', 'Mizu (Water)', 'Sayounara (Goodbye)'],
  uae: ['Marhaban (Hello)', 'Shukran (Thank you)', 'Min fadlak (Please)', 'Bikam hadha? (How much is this?)', 'Maa\' (Water)', 'Ma\'as salama (Goodbye)'],
  spain: ['Hola (Hello)', 'Gracias (Thank you)', 'Por favor (Please)', '¿Cuánto cuesta? (How much does it cost?)', 'Agua (Water)', 'Adiós (Goodbye)']
};

// Main function
export const generateItinerary = async (params) => {
  const { destination, startDate, endDate, budget, currency, travelStyle } = params;

  // Calculate length
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

  const cleanDest = destination.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  
  // 1. Gemini 1.5 Flash API Mode (Prioritized)
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are an expert AI Travel Planner. Generate a day-by-day travel itinerary for "${destination}" for ${durationDays} days.
The itinerary must fit a ${travelStyle} travel style and a budget of ${budget} ${currency}.
Respond STRICTLY with a JSON object following this exact schema:
{
  "destination": "${destination}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "travelers": ${params.travelers || 1},
  "budget": ${budget},
  "currency": "${currency}",
  "travelStyle": "${travelStyle}",
  "itinerary": [
    {
      "dayNumber": 1,
      "date": "${startDate}",
      "activities": [
        {
          "timeSlot": "Morning",
          "title": "Activity Title",
          "description": "Specific localized activity description, including cultural/logistical context",
          "costEstimate": 15,
          "costCurrency": "${currency}",
          "locationName": "Point of Interest Name",
          "coordinates": { "lat": 1.234, "lng": 5.678 },
          "alternatives": [
            { "title": "Alternative Activity 1", "description": "Quick description" },
            { "title": "Alternative Activity 2", "description": "Quick description" }
          ]
        }
      ]
    }
  ],
  "languageTips": ["Phrase 1", "Phrase 2", "Phrase 3"]
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates[0].content.parts[0].text;
        const itineraryJson = JSON.parse(jsonText);
        return itineraryJson;
      } else {
        const errorText = await response.text();
        console.warn('Gemini API request failed, falling back to OpenAI/local. Error:', errorText);
      }
    } catch (err) {
      console.warn('Failed to contact Gemini API, falling back to OpenAI/local. Error:', err.message);
    }
  }

  // 2. OpenAI GPT-4o Mode
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an expert AI Travel Planner. Generate a day-by-day travel itinerary for "${destination}" for ${durationDays} days.
The itinerary must fit a ${travelStyle} travel style and a budget of ${budget} ${currency}.
Respond STRICTLY with a JSON object following this exact schema:
{
  "destination": "${destination}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "travelers": ${params.travelers || 1},
  "budget": ${budget},
  "currency": "${currency}",
  "travelStyle": "${travelStyle}",
  "itinerary": [
    {
      "dayNumber": 1,
      "date": "${startDate}",
      "activities": [
        {
          "timeSlot": "Morning",
          "title": "Activity Title",
          "description": "Specific localized activity description, including cultural/logistical context",
          "costEstimate": 15,
          "costCurrency": "${currency}",
          "locationName": "Point of Interest Name",
          "coordinates": { "lat": 1.234, "lng": 5.678 },
          "alternatives": [
            { "title": "Alternative Activity 1", "description": "Quick description" },
            { "title": "Alternative Activity 2", "description": "Quick description" }
          ]
        }
      ]
    }
  ],
  "languageTips": ["Phrase 1", "Phrase 2", "Phrase 3"]
}`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const itineraryJson = JSON.parse(data.choices[0].message.content);
        return itineraryJson;
      } else {
        const errorText = await response.text();
        console.warn('OpenAI API request failed, falling back to local generator. Error:', errorText);
      }
    } catch (err) {
      console.warn('Failed to contact OpenAI API, using offline generation. Error:', err.message);
    }
  }

  // 2. Offline Fallback Mode
  // Determine target language tips key
  let langKey = 'spain';
  if (cleanDest.includes('lahore') || cleanDest.includes('karachi') || cleanDest.includes('hunza') || cleanDest.includes('pakistan') || cleanDest.includes('islamabad')) {
    langKey = 'pakistan';
  } else if (cleanDest.includes('paris') || cleanDest.includes('france')) {
    langKey = 'france';
  } else if (cleanDest.includes('tokyo') || cleanDest.includes('japan')) {
    langKey = 'japan';
  } else if (cleanDest.includes('dubai') || cleanDest.includes('uae') || cleanDest.includes('saudi') || cleanDest.includes('riyadh')) {
    langKey = 'uae';
  }

  const languageTips = languageTipsDatabase[langKey] || languageTipsDatabase['spain'];

  // Retrieve destination POIs or fallback to generic
  let destData = null;
  for (const key of Object.keys(destinationDatabase)) {
    if (cleanDest.includes(key) || key.includes(cleanDest)) {
      destData = destinationDatabase[key];
      break;
    }
  }

  if (!destData) {
    // Generate mock destination info
    destData = {
      currency: currency || 'USD',
      coordinates: { lat: 40.4168, lng: -3.7038 }, // Madrid coordinates as generic
      pois: [
        { name: `${destination} Historic Center`, description: 'Explore the old historical alleys, central plaza, and local architectural monuments.' },
        { name: `${destination} National Art Gallery`, description: 'Examine ancient and modern cultural artifacts representing the country\'s history.' },
        { name: `Traditional Culinary Tasting`, description: 'Indulge in authentic local meals and street foods in the popular central food market.' },
        { name: `Scenic Viewpoint Lookout`, description: 'Climb or take a cable car to the panoramic summit displaying gorgeous city views.' },
        { name: `Royal Palace & Gardens`, description: 'Stroll the grand royal residence halls, courtyard, and surrounding flower gardens.' },
        { name: `Local Handcrafts Bazaar`, description: 'Shop for souvenirs, fabrics, custom spices, and handmade goods from local artisans.' },
        { name: `City Botanical Conservatory`, description: 'Walk through giant glass greenhouses containing tropical flora and exotic plant varieties.' },
        { name: `Riverfront Promenade Cruise`, description: 'Board a relaxing water taxi or walk along the harbor for scenic skyline vistas.' }
      ]
    };
  }

  const destPois = destData.pois;
  const destCurrency = destData.currency;
  const itinerary = [];

  for (let d = 1; d <= durationDays; d++) {
    const currentDayDate = new Date(start);
    currentDayDate.setDate(start.getDate() + (d - 1));

    // Get 3 POIs sequentially for Morning, Afternoon, Evening
    const startIndex = ((d - 1) * 3) % destPois.length;
    const morningPoi = destPois[startIndex];
    const afternoonPoi = destPois[(startIndex + 1) % destPois.length];
    const eveningPoi = destPois[(startIndex + 2) % destPois.length];

    // Budgets split: budget / duration / 3 activities
    const activityBudget = Math.round((budget / durationDays / 3) * 0.8);

    const dayObj = {
      dayNumber: d,
      date: currentDayDate.toISOString().split('T')[0],
      activities: [
        {
          timeSlot: 'Morning',
          title: `Visit ${morningPoi.name}`,
          description: morningPoi.description,
          costEstimate: travelStyle === 'luxury' ? activityBudget * 2 : (travelStyle === 'budget' ? Math.round(activityBudget * 0.4) : activityBudget),
          costCurrency: destCurrency,
          locationName: morningPoi.name,
          coordinates: {
            lat: morningPoi.lat || destData.coordinates.lat + (Math.random() - 0.5) * 0.05,
            lng: morningPoi.lng || destData.coordinates.lng + (Math.random() - 0.5) * 0.05
          },
          alternatives: [
            { title: 'Relaxing Coffee Break', description: 'Visit a highly-rated local coffee shop and try regional pastries.' },
            { title: 'Self-guided street exploration', description: 'Walk along nearby residential streets to admire regional architecture.' }
          ]
        },
        {
          timeSlot: 'Afternoon',
          title: `Explore ${afternoonPoi.name}`,
          description: afternoonPoi.description,
          costEstimate: travelStyle === 'luxury' ? activityBudget * 2.5 : (travelStyle === 'budget' ? Math.round(activityBudget * 0.5) : activityBudget),
          costCurrency: destCurrency,
          locationName: afternoonPoi.name,
          coordinates: {
            lat: afternoonPoi.lat || destData.coordinates.lat + (Math.random() - 0.5) * 0.05,
            lng: afternoonPoi.lng || destData.coordinates.lng + (Math.random() - 0.5) * 0.05
          },
          alternatives: [
            { title: 'Local Art Gallery', description: 'Visit a small neighborhood art collective showcase.' },
            { title: 'Central Park Walk', description: 'Take a calm walk in a nearby public green park.' }
          ]
        },
        {
          timeSlot: 'Evening',
          title: `Dine near ${eveningPoi.name}`,
          description: eveningPoi.description,
          costEstimate: travelStyle === 'luxury' ? activityBudget * 3 : (travelStyle === 'budget' ? Math.round(activityBudget * 0.6) : activityBudget),
          costCurrency: destCurrency,
          locationName: eveningPoi.name,
          coordinates: {
            lat: eveningPoi.lat || destData.coordinates.lat + (Math.random() - 0.5) * 0.05,
            lng: eveningPoi.lng || destData.coordinates.lng + (Math.random() - 0.5) * 0.05
          },
          alternatives: [
            { title: 'Live Music Lounge', description: 'Listen to traditional live music performances in a historical bar.' },
            { title: 'Panoramic Night Bus Tour', description: 'Board an open-top bus to view illuminated historical landmarks.' }
          ]
        }
      ]
    };

    itinerary.push(dayObj);
  }

  return {
    destination,
    startDate,
    endDate,
    travelers: parseInt(params.travelers) || 1,
    budget: parseFloat(budget),
    currency,
    travelStyle,
    itinerary,
    languageTips
  };
};
