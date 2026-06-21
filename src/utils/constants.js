// ===== AI TRIP PLANNER — CONSTANTS =====

export const APP_NAME = 'AI Trip Planner';
export const APP_TAGLINE = 'Plan Anywhere. Travel Everywhere.';

// ===== TRAVEL STYLES =====
export const TRAVEL_STYLES = [
  { id: 'adventure', label: 'Adventure', icon: '🏔️', description: 'Hiking, extreme sports, nature exploration' },
  { id: 'cultural', label: 'Cultural', icon: '🏛️', description: 'Museums, historical sites, local traditions' },
  { id: 'relaxation', label: 'Relaxation', icon: '🏖️', description: 'Beaches, spas, resort getaways' },
  { id: 'foodie', label: 'Foodie', icon: '🍜', description: 'Local cuisine, food tours, cooking classes' },
  { id: 'budget', label: 'Budget', icon: '💰', description: 'Affordable travel, hostels, free attractions' },
  { id: 'luxury', label: 'Luxury', icon: '💎', description: 'Five-star hotels, fine dining, VIP experiences' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Kid-friendly activities, family resorts' },
  { id: 'romantic', label: 'Romantic', icon: '💕', description: 'Couples getaways, romantic dinners, scenic spots' },
];

// ===== FEATURED DESTINATIONS =====
export const FEATURED_DESTINATIONS = [
  { id: 1, city: 'Paris', country: 'France', region: 'Europe', emoji: '🇫🇷', image: 'paris', tagline: 'City of Lights', color: '#6366f1' },
  { id: 2, city: 'Tokyo', country: 'Japan', region: 'Asia', emoji: '🇯🇵', image: 'tokyo', tagline: 'Where tradition meets future', color: '#ec4899' },
  { id: 3, city: 'Dubai', country: 'UAE', region: 'Middle East', emoji: '🇦🇪', image: 'dubai', tagline: 'City of superlatives', color: '#f59e0b' },
  { id: 4, city: 'New York', country: 'USA', region: 'North America', emoji: '🇺🇸', image: 'new-york', tagline: 'The city that never sleeps', color: '#22c55e' },
  { id: 5, city: 'Istanbul', country: 'Turkey', region: 'Europe', emoji: '🇹🇷', image: 'istanbul', tagline: 'Where East meets West', color: '#ef4444' },
  { id: 6, city: 'Bali', country: 'Indonesia', region: 'Asia', emoji: '🇮🇩', image: 'bali', tagline: 'Island of the Gods', color: '#14b8a6' },
  { id: 7, city: 'London', country: 'UK', region: 'Europe', emoji: '🇬🇧', image: 'london', tagline: 'Royal heritage & modern culture', color: '#8b5cf6' },
  { id: 8, city: 'Lahore', country: 'Pakistan', region: 'South Asia', emoji: '🇵🇰', image: 'lahore', tagline: 'Heart of Pakistan', color: '#059669' },
];

// ===== POPULAR REGIONS =====
export const REGIONS = [
  { id: 'europe', name: 'Europe', icon: '🏰', cities: ['Paris', 'London', 'Rome', 'Barcelona', 'Amsterdam', 'Prague'] },
  { id: 'asia', name: 'Asia', icon: '🏯', cities: ['Tokyo', 'Bangkok', 'Singapore', 'Seoul', 'Bali', 'Beijing'] },
  { id: 'north-america', name: 'North America', icon: '🗽', cities: ['New York', 'Los Angeles', 'Toronto', 'Miami', 'Chicago'] },
  { id: 'south-america', name: 'South America', icon: '🌎', cities: ['Rio de Janeiro', 'Buenos Aires', 'Bogota', 'Lima'] },
  { id: 'middle-east', name: 'Middle East', icon: '🕌', cities: ['Dubai', 'Abu Dhabi', 'Doha', 'Riyadh', 'Amman'] },
  { id: 'africa', name: 'Africa', icon: '🌍', cities: ['Cape Town', 'Cairo', 'Nairobi', 'Marrakech', 'Zanzibar'] },
  { id: 'south-asia', name: 'South Asia', icon: '🏔️', cities: ['Lahore', 'Karachi', 'Islamabad', 'Dhaka', 'Colombo'] },
  { id: 'oceania', name: 'Oceania', icon: '🦘', cities: ['Sydney', 'Melbourne', 'Auckland', 'Queenstown', 'Fiji'] },
];

// ===== CURRENCIES =====
export const CURRENCIES = [
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
];

// ===== STATS =====
export const APP_STATS = [
  { label: 'Countries', value: 195, suffix: '' },
  { label: 'Currencies', value: 150, suffix: '+' },
  { label: 'AI Trips Generated', value: 50, suffix: 'K+' },
  { label: 'Happy Travelers', value: 25, suffix: 'K+' },
];

// ===== HOW IT WORKS =====
export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Choose Your Destination',
    description: 'Search any city or country from 195 destinations worldwide. Set your dates, budget, and travel style.',
    icon: '🌍',
  },
  {
    step: 2,
    title: 'AI Generates Your Plan',
    description: 'Our GPT-4o AI creates a personalized day-by-day itinerary with activities, restaurants, and local tips.',
    icon: '🤖',
  },
  {
    step: 3,
    title: 'Explore & Enjoy',
    description: 'View your trip on interactive maps, track your budget in real-time, and share with travel companions.',
    icon: '✈️',
  },
];

// ===== FEATURES =====
export const FEATURES = [
  {
    id: 'ai',
    title: 'AI-Powered Itineraries',
    description: 'GPT-4o generates personalized day-by-day plans with local context, culture, and cuisine recommendations.',
    icon: 'Brain',
    color: '#6366f1',
  },
  {
    id: 'maps',
    title: 'Interactive Maps',
    description: 'Visualize your entire trip on beautiful maps with numbered pins, routes, and nearby points of interest.',
    icon: 'Map',
    color: '#22c55e',
  },
  {
    id: 'budget',
    title: 'Smart Budget Tracker',
    description: 'Track expenses in 150+ currencies with live exchange rates. Visual breakdowns keep you on budget.',
    icon: 'Wallet',
    color: '#f59e0b',
  },
  {
    id: 'global',
    title: 'Global Coverage',
    description: '195 countries supported with visa info, weather forecasts, safety ratings, and local language tips.',
    icon: 'Globe',
    color: '#ec4899',
  },
  {
    id: 'collab',
    title: 'Real-Time Collaboration',
    description: 'Invite travel companions to co-edit itineraries in real-time. Plan together, travel together.',
    icon: 'Users',
    color: '#14b8a6',
  },
  {
    id: 'multi-city',
    title: 'Multi-City Trips',
    description: 'Plan trips spanning multiple cities or countries in one seamless itinerary with smart transitions.',
    icon: 'Route',
    color: '#8b5cf6',
  },
];

// ===== TESTIMONIALS =====
export const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    location: 'San Francisco, USA',
    avatar: '👩‍💻',
    text: 'AI Trip Planner created a perfect 10-day Japan itinerary. Every restaurant, every temple — spot on! The budget tracker saved me from overspending.',
    rating: 5,
    destination: 'Tokyo, Japan',
  },
  {
    name: 'Ahmed Raza',
    location: 'Lahore, Pakistan',
    avatar: '👨‍🎓',
    text: 'The Pakistan features are amazing! Prayer times, halal food filter, and PKR pricing made my Hunza trip planning effortless.',
    rating: 5,
    destination: 'Hunza Valley, Pakistan',
  },
  {
    name: 'Elena Rossi',
    location: 'Milan, Italy',
    avatar: '👩‍🎨',
    text: 'Planned a multi-city European tour — Paris, Barcelona, Prague. The AI knew exactly which neighborhoods to explore and when.',
    rating: 5,
    destination: 'Europe Multi-City',
  },
];

// ===== MOCK TRIP DATA =====
export const MOCK_TRIPS = [
  {
    id: 'trip-1',
    destination: 'Paris, France',
    country: 'France',
    emoji: '🇫🇷',
    startDate: '2026-07-15',
    endDate: '2026-07-22',
    travelers: 2,
    budget: 3000,
    currency: 'EUR',
    style: 'romantic',
    status: 'upcoming',
    days: 7,
    activities: 28,
  },
  {
    id: 'trip-2',
    destination: 'Tokyo, Japan',
    country: 'Japan',
    emoji: '🇯🇵',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    travelers: 1,
    budget: 250000,
    currency: 'JPY',
    style: 'cultural',
    status: 'upcoming',
    days: 10,
    activities: 40,
  },
  {
    id: 'trip-3',
    destination: 'Hunza Valley, Pakistan',
    country: 'Pakistan',
    emoji: '🇵🇰',
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    travelers: 4,
    budget: 80000,
    currency: 'PKR',
    style: 'adventure',
    status: 'completed',
    days: 5,
    activities: 18,
  },
];

// ===== MOCK ITINERARY =====
export const MOCK_ITINERARY = {
  tripId: 'trip-1',
  destination: 'Paris, France',
  days: [
    {
      dayNumber: 1,
      date: '2026-07-15',
      title: 'Arrival & Eiffel Tower',
      activities: [
        {
          id: 'a1',
          time: '09:00',
          period: 'morning',
          title: 'Arrive at Charles de Gaulle Airport',
          description: 'Take the RER B train to central Paris. Check into your hotel in Le Marais district.',
          type: 'transport',
          cost: 12,
          currency: 'EUR',
          duration: '1.5 hrs',
          icon: '✈️',
          location: { lat: 49.0097, lng: 2.5479 },
        },
        {
          id: 'a2',
          time: '12:00',
          period: 'afternoon',
          title: 'Lunch at Le Comptoir du Panthéon',
          description: 'Traditional French bistro near the Panthéon. Try the Croque Monsieur and French onion soup.',
          type: 'food',
          cost: 35,
          currency: 'EUR',
          duration: '1 hr',
          icon: '🍽️',
          location: { lat: 48.8462, lng: 2.3464 },
        },
        {
          id: 'a3',
          time: '14:30',
          period: 'afternoon',
          title: 'Eiffel Tower Visit',
          description: 'Iconic iron lattice tower on the Champ de Mars. Book summit tickets in advance for panoramic views of Paris.',
          type: 'attraction',
          cost: 26,
          currency: 'EUR',
          duration: '2.5 hrs',
          icon: '🗼',
          rating: 4.7,
          location: { lat: 48.8584, lng: 2.2945 },
        },
        {
          id: 'a4',
          time: '18:00',
          period: 'evening',
          title: 'Seine River Cruise',
          description: 'One-hour evening cruise along the Seine. See illuminated Notre-Dame, Louvre, and Musée d\'Orsay from the water.',
          type: 'activity',
          cost: 18,
          currency: 'EUR',
          duration: '1 hr',
          icon: '🚢',
          rating: 4.5,
          location: { lat: 48.8600, lng: 2.2977 },
        },
        {
          id: 'a5',
          time: '20:00',
          period: 'evening',
          title: 'Dinner at Le Bouillon Chartier',
          description: 'Historic Parisian restaurant since 1896. Affordable classic French cuisine in a stunning Belle Époque dining hall.',
          type: 'food',
          cost: 28,
          currency: 'EUR',
          duration: '1.5 hrs',
          icon: '🍷',
          location: { lat: 48.8745, lng: 2.3467 },
        },
      ],
    },
    {
      dayNumber: 2,
      date: '2026-07-16',
      title: 'Louvre & Montmartre',
      activities: [
        {
          id: 'a6',
          time: '09:00',
          period: 'morning',
          title: 'The Louvre Museum',
          description: 'World\'s largest art museum. Must-see: Mona Lisa, Venus de Milo, Winged Victory. Book timed entry online.',
          type: 'attraction',
          cost: 22,
          currency: 'EUR',
          duration: '3 hrs',
          icon: '🎨',
          rating: 4.8,
          location: { lat: 48.8606, lng: 2.3376 },
        },
        {
          id: 'a7',
          time: '12:30',
          period: 'afternoon',
          title: 'Lunch at Café de Flore',
          description: 'Legendary Left Bank café frequented by Sartre and de Beauvoir. Classic French pastries and coffee.',
          type: 'food',
          cost: 30,
          currency: 'EUR',
          duration: '1 hr',
          icon: '☕',
          location: { lat: 48.8541, lng: 2.3326 },
        },
        {
          id: 'a8',
          time: '15:00',
          period: 'afternoon',
          title: 'Montmartre & Sacré-Cœur',
          description: 'Walk through charming cobblestone streets of Montmartre. Visit the white-domed basilica with sweeping city views.',
          type: 'attraction',
          cost: 0,
          currency: 'EUR',
          duration: '2 hrs',
          icon: '⛪',
          rating: 4.6,
          location: { lat: 48.8867, lng: 2.3431 },
        },
        {
          id: 'a9',
          time: '19:00',
          period: 'evening',
          title: 'Dinner in Le Marais',
          description: 'Explore the trendy Le Marais neighborhood. Falafel at L\'As du Fallafel or dine at a hidden courtyard bistro.',
          type: 'food',
          cost: 25,
          currency: 'EUR',
          duration: '1.5 hrs',
          icon: '🥙',
          location: { lat: 48.8566, lng: 2.3599 },
        },
      ],
    },
    {
      dayNumber: 3,
      date: '2026-07-17',
      title: 'Versailles Day Trip',
      activities: [
        {
          id: 'a10',
          time: '08:30',
          period: 'morning',
          title: 'Train to Versailles',
          description: 'Take RER C from central Paris to Versailles-Château. Journey takes about 40 minutes.',
          type: 'transport',
          cost: 8,
          currency: 'EUR',
          duration: '40 min',
          icon: '🚆',
          location: { lat: 48.8014, lng: 2.1301 },
        },
        {
          id: 'a11',
          time: '10:00',
          period: 'morning',
          title: 'Palace of Versailles',
          description: 'Explore the opulent Hall of Mirrors, Royal Apartments, and the stunning formal gardens. Audio guide recommended.',
          type: 'attraction',
          cost: 21,
          currency: 'EUR',
          duration: '4 hrs',
          icon: '👑',
          rating: 4.7,
          location: { lat: 48.8049, lng: 2.1204 },
        },
        {
          id: 'a12',
          time: '14:00',
          period: 'afternoon',
          title: 'Gardens of Versailles',
          description: 'Wander through 800 hectares of meticulously landscaped gardens. Rent a golf cart or rowboat on the Grand Canal.',
          type: 'activity',
          cost: 10,
          currency: 'EUR',
          duration: '2 hrs',
          icon: '🌳',
          location: { lat: 48.8049, lng: 2.1063 },
        },
        {
          id: 'a13',
          time: '18:00',
          period: 'evening',
          title: 'Return to Paris & Evening at Champs-Élysées',
          description: 'Stroll down the famous avenue, window-shop at luxury boutiques, and enjoy the Arc de Triomphe illuminated at night.',
          type: 'activity',
          cost: 13,
          currency: 'EUR',
          duration: '2 hrs',
          icon: '🌃',
          location: { lat: 48.8698, lng: 2.3078 },
        },
      ],
    },
  ],
};

// ===== MOCK EXPENSES =====
export const MOCK_EXPENSES = [
  { id: 'e1', category: 'transport', label: 'Transport', amount: 450, color: '#6366f1' },
  { id: 'e2', category: 'food', label: 'Food & Dining', amount: 680, color: '#ec4899' },
  { id: 'e3', category: 'hotels', label: 'Accommodation', amount: 1200, color: '#f59e0b' },
  { id: 'e4', category: 'activities', label: 'Activities', amount: 380, color: '#22c55e' },
  { id: 'e5', category: 'shopping', label: 'Shopping', amount: 290, color: '#14b8a6' },
];

// ===== COUNTRIES FOR VISA CHECKER =====
export const PASSPORT_COUNTRIES = [
  'Pakistan', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'India', 'China', 'Japan', 'Germany', 'France', 'Turkey', 'Saudi Arabia',
  'UAE', 'Malaysia', 'Singapore', 'South Korea', 'Brazil', 'Nigeria',
  'South Africa', 'Egypt', 'Indonesia', 'Mexico', 'Italy', 'Spain',
];

// ===== NAV LINKS =====
export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/plan', label: 'Plan Trip' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/tools', label: 'Travel Tools' },
  { path: '/community', label: 'Community' },
];
