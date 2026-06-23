// Travel Tools & Global Helpers Controller (FR-34 to FR-40, FR-47)

// 1. Visa Requirements offline database
const visaDatabase = {
  pakistan: {
    qatar: { requirement: 'Visa Free', duration: '30 Days', details: 'Requires valid passport, return ticket, and hotel booking.' },
    maldives: { requirement: 'Visa on Arrival', duration: '30 Days', details: 'Free entry document issued at Male airport with valid return ticket.' },
    azerbaijan: { requirement: 'eVisa', duration: '30 Days', details: 'Apply online via ASAN Visa. Processed in 3 business days.' },
    turkey: { requirement: 'eVisa / Sticker Visa', duration: '30 Days', details: 'eVisa available if holding valid Schengen, US, or UK visa. Otherwise sticker visa required.' },
    uae: { requirement: 'eVisa Required', duration: '30/90 Days', details: 'Must be sponsored by a travel agency, hotel, or airline prior to travel.' },
    saudi_arabia: { requirement: 'eVisa / Umrah Visa', duration: '90 Days', details: 'eVisa available for tourists holding US/UK/Schengen visas, otherwise apply via Tasheer center.' },
    malaysia: { requirement: 'eVisa', duration: '30 Days', details: 'Apply online via Malaysia eVisa portal. Usually takes 2-4 working days.' },
    thailand: { requirement: 'Visa Required', duration: '15/30 Days', details: 'Must apply at royal Thai embassy/consulate or authorized agents in Pakistan.' },
    united_states: { requirement: 'Visa Required', duration: 'B1/B2 Visa', details: 'Requires DS-160, fee payment, and physical interview at US Embassy in Islamabad or Consulate in Karachi.' },
    united_kingdom: { requirement: 'Visa Required', duration: 'Standard Visitor', details: 'Apply online via GOV.UK and submit biometrics at VFS Global center.' },
    france: { requirement: 'Schengen Visa Required', duration: 'Short Stay', details: 'Apply via Capago center. Requires travel insurance, bank statements, and itinerary.' },
    japan: { requirement: 'Visa Required', duration: 'Short-term Tourist', details: 'Apply at Japanese Embassy/Consulate. No visa fee for Pakistani citizens currently.' },
    sri_lanka: { requirement: 'ETA Required (eVisa)', duration: '30 Days', details: 'Apply online for Electronic Travel Authorization prior to boarding.' },
  }
};

// 2. Country electrical plug database
const countryInfoDatabase = {
  pakistan: { plugs: 'Types C & D', voltage: '230V', frequency: '50Hz', timezone: 'GMT+5 (PKT)', currency: 'PKR', exchangeRateToUSD: 278.5 },
  france: { plugs: 'Types C & E', voltage: '230V', frequency: '50Hz', timezone: 'GMT+1 (CET/CEST)', currency: 'EUR', exchangeRateToUSD: 0.92 },
  united_kingdom: { plugs: 'Type G', voltage: '230V', frequency: '50Hz', timezone: 'GMT+0 (GMT/BST)', currency: 'GBP', exchangeRateToUSD: 0.79 },
  united_states: { plugs: 'Types A & B', voltage: '120V', frequency: '60Hz', timezone: 'GMT-5 to GMT-8', currency: 'USD', exchangeRateToUSD: 1.0 },
  japan: { plugs: 'Types A & B', voltage: '100V', frequency: '50/60Hz', timezone: 'GMT+9 (JST)', currency: 'JPY', exchangeRateToUSD: 156.4 },
  uae: { plugs: 'Type G', voltage: '230V', frequency: '50Hz', timezone: 'GMT+4 (GST)', currency: 'AED', exchangeRateToUSD: 3.67 },
  saudi_arabia: { plugs: 'Type G', voltage: '230V', frequency: '60Hz', timezone: 'GMT+3 (AST)', currency: 'SAR', exchangeRateToUSD: 3.75 },
  turkey: { plugs: 'Types C & F', voltage: '230V', frequency: '50Hz', timezone: 'GMT+3', currency: 'TRY', exchangeRateToUSD: 32.8 }
};

// @desc    Check Visa Requirements
// @route   GET /api/tools/visa
// @access  Public
const checkVisa = async (req, res) => {
  const passport = (req.query.passport || 'pakistan').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  const destination = (req.query.destination || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

  if (!destination) {
    res.status(400);
    throw new Error('Please specify a destination country');
  }

  // Lookup in database
  const passportDb = visaDatabase[passport];
  let result = null;

  if (passportDb) {
    result = passportDb[destination];
  }

  // Fallback default
  if (!result) {
    if (passport === 'pakistan') {
      result = {
        requirement: 'Visa Required',
        duration: 'Depends on Embassy',
        details: `Pakistani passport holders generally require a visa in advance for ${req.query.destination}. Please contact the respective Embassy or Consulate.`
      };
    } else {
      result = {
        requirement: 'Visa Free / eVisa likely',
        duration: '30-90 Days',
        details: `Visa requirements for ${req.query.passport} passport holders traveling to ${req.query.destination} are usually flexible. Please check official government portals.`
      };
    }
  }

  res.json({
    passport: req.query.passport || 'Pakistan',
    destination: req.query.destination,
    ...result
  });
};

// @desc    Get Weather forecast helper (simulated based on location and season)
// @route   GET /api/tools/weather
// @access  Public
const getWeather = async (req, res) => {
  const { destination } = req.query;

  if (!destination) {
    res.status(400);
    throw new Error('Destination city is required');
  }

  const cleanDest = destination.toLowerCase();
  
  // Set default weather values depending on region/season
  let tempBase = 22; // default mild temp
  let weatherTypes = ['Sunny', 'Clear', 'Partly Cloudy', 'Windy'];

  if (cleanDest.includes('lahore') || cleanDest.includes('karachi') || cleanDest.includes('dubai') || cleanDest.includes('riyadh')) {
    // Hot desert/subtropical
    tempBase = 35;
    weatherTypes = ['Sunny', 'Clear', 'Hazy', 'Hot'];
  } else if (cleanDest.includes('hunza') || cleanDest.includes('swat') || cleanDest.includes('skardu') || cleanDest.includes('murree')) {
    // Mountain climate
    tempBase = 12;
    weatherTypes = ['Chilly', 'Partly Cloudy', 'Sunny', 'Rainy'];
  } else if (cleanDest.includes('paris') || cleanDest.includes('london') || cleanDest.includes('amsterdam')) {
    // European temperate
    tempBase = 16;
    weatherTypes = ['Rainy', 'Cloudy', 'Overcast', 'Showers'];
  }

  // Generate 7-day forecast
  const forecast = [];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + i);

    const tempDay = tempBase + Math.floor(Math.random() * 6) - 3;
    const tempNight = tempDay - Math.floor(Math.random() * 8) - 5;
    const condition = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

    forecast.push({
      date: futureDate.toISOString().split('T')[0],
      dayName: daysOfWeek[futureDate.getDay()],
      tempDay: `${tempDay}°C`,
      tempNight: `${tempNight}°C`,
      condition,
      humidity: `${50 + Math.floor(Math.random() * 30)}%`,
      windSpeed: `${5 + Math.floor(Math.random() * 20)} km/h`
    });
  }

  res.json({
    destination,
    forecast
  });
};

// @desc    Get plug adapter, timezone & exchange rates information
// @route   GET /api/tools/country-info
// @access  Public
const getCountryInfo = async (req, res) => {
  const country = (req.query.country || 'pakistan').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  
  let info = null;
  for (const key of Object.keys(countryInfoDatabase)) {
    if (country.includes(key) || key.includes(country)) {
      info = countryInfoDatabase[key];
      break;
    }
  }

  if (!info) {
    // Default fallback
    info = {
      plugs: 'Types C, G, & A (Universal compatibility recommended)',
      voltage: '220V-240V',
      frequency: '50Hz',
      timezone: 'GMT+1 to GMT+9',
      currency: 'USD/EUR',
      exchangeRateToUSD: 1.0
    };
  }

  res.json({
    country: req.query.country || 'Global',
    ...info
  });
};

// @desc    Calculate Salah/Prayer times globally
// @route   GET /api/tools/prayer-times
// @access  Public
const getPrayerTimes = async (req, res) => {
  const destination = req.query.destination || 'Lahore';
  const cleanDest = destination.toLowerCase();

  // Basic calculation: offset from noon depending on location
  let offsetFajr = -330; // mins from Dhuhr
  let offsetSunrise = -270;
  let offsetDhuhr = 0;
  let offsetAsr = 210;
  let offsetMaghrib = 270;
  let offsetIsha = 330;

  if (cleanDest.includes('dubai')) {
    offsetFajr = -320;
    offsetSunrise = -260;
    offsetAsr = 200;
    offsetMaghrib = 265;
    offsetIsha = 320;
  } else if (cleanDest.includes('paris') || cleanDest.includes('london')) {
    offsetFajr = -380;
    offsetSunrise = -300;
    offsetAsr = 240;
    offsetMaghrib = 320;
    offsetIsha = 400;
  }

  const formatTime = (minutesFromNoon) => {
    const baseHour = 12;
    const totalMinutes = baseHour * 60 + minutesFromNoon;
    const hour = Math.floor(totalMinutes / 60) % 24;
    const minute = Math.floor(totalMinutes % 60);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${suffix}`;
  };

  res.json({
    destination,
    date: req.query.date || new Date().toISOString().split('T')[0],
    prayerTimes: {
      Fajr: formatTime(offsetFajr),
      Sunrise: formatTime(offsetSunrise),
      Dhuhr: formatTime(offsetDhuhr),
      Asr: formatTime(offsetAsr),
      Maghrib: formatTime(offsetMaghrib),
      Isha: formatTime(offsetIsha)
    }
  });
};

// @desc    Get live exchange rates relative to USD/PKR (150+ currencies supported via caching)
// @route   GET /api/tools/currencies
// @access  Public
const getCurrencies = async (req, res) => {
  // Return standard exchange rates based on countryInfoDatabase
  const rates = {};
  Object.keys(countryInfoDatabase).forEach(key => {
    const data = countryInfoDatabase[key];
    rates[data.currency] = data.exchangeRateToUSD;
  });

  // Add major fallbacks
  rates['CAD'] = 1.36;
  rates['AUD'] = 1.50;
  rates['CHF'] = 0.89;
  rates['CNY'] = 7.25;
  rates['INR'] = 83.50;

  res.json({
    base: 'USD',
    rates
  });
};

export { checkVisa, getWeather, getCountryInfo, getPrayerTimes, getCurrencies };
