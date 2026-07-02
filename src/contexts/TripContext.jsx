import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TripContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to normalize backend database schemas to frontend-compatible structures
const normalizeTrip = (dbTrip) => {
  if (!dbTrip) return null;
  
  // If it's already normalized and has the normalized flag, return it
  if (dbTrip._normalized) return dbTrip;
  
  const id = dbTrip._id || dbTrip.id;
  const destination = dbTrip.destination || '';
  const country = dbTrip.country || (destination.includes(',') ? destination.split(',').pop().trim() : '');
  
  // Determine suitable emoji based on destination keywords
  const lowerDest = destination.toLowerCase();
  const emoji = dbTrip.emoji || (
    lowerDest.includes('pakistan') ? '🇵🇰' : 
    lowerDest.includes('japan') ? '🇯🇵' : 
    lowerDest.includes('france') ? '🇫🇷' : 
    lowerDest.includes('dubai') || lowerDest.includes('uae') ? '🇦🇪' : 
    lowerDest.includes('uk') || lowerDest.includes('london') ? '🇬🇧' :
    lowerDest.includes('usa') || lowerDest.includes('york') ? '🇺🇸' :
    lowerDest.includes('turkey') || lowerDest.includes('istanbul') ? '🇹🇷' :
    lowerDest.includes('saudi') ? '🇸🇦' :
    '✈️'
  );
  
  const start = new Date(dbTrip.startDate);
  const end = new Date(dbTrip.endDate);
  const now = new Date();
  
  // Compute trip status from dates
  let status = 'upcoming';
  if (now > end) {
    status = 'completed';
  } else if (now >= start && now <= end) {
    status = 'ongoing';
  }
  
  // Normalize days list from itinerary
  const days = (dbTrip.itinerary || []).map(day => {
    const activities = (day.activities || []).map(act => {
      const timeSlot = act.timeSlot || 'Morning';
      let period = 'morning';
      let time = '09:00';
      let icon = '☕';
      let type = 'activity';
      
      if (timeSlot === 'Afternoon') {
        period = 'afternoon';
        time = '14:00';
        icon = '📸';
        type = 'attraction';
      } else if (timeSlot === 'Evening') {
        period = 'evening';
        time = '19:00';
        icon = '🍴';
        type = 'food';
      }
      
      return {
        id: act._id || act.id || Math.random().toString(),
        time,
        period,
        title: act.title || '',
        description: act.description || '',
        type: act.type || type,
        cost: act.costEstimate || 0,
        currency: act.costCurrency || dbTrip.currency || 'USD',
        duration: act.duration || '2 hrs',
        icon: act.icon || icon,
        location: act.coordinates || { lat: 0, lng: 0 }
      };
    });
    
    return {
      dayNumber: day.dayNumber,
      date: day.date ? new Date(day.date).toISOString().split('T')[0] : '',
      title: day.title || `Day ${day.dayNumber} Exploration`,
      activities
    };
  });
  
  // Compute total activities count
  const activitiesCount = days.reduce((sum, d) => sum + d.activities.length, 0);
  
  return {
    _normalized: true,
    id,
    destination,
    country,
    emoji,
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    travelers: dbTrip.travelers || 1,
    budget: dbTrip.budget || 0,
    currency: dbTrip.currency || 'USD',
    style: dbTrip.travelStyle || 'adventure',
    status,
    daysCount: days.length,
    activities: activitiesCount,
    days,
    isPublic: dbTrip.isPublic || false,
    likes: dbTrip.likes || 0,
    creatorName: dbTrip.userId?.name || null,
    raw: dbTrip
  };
};

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);

  // Load user trips — can be called after login to refresh
  const fetchUserTrips = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTrips([]);
      return;
    }

    setIsLoadingTrips(true);
    try {
      const res = await fetch(`${API_URL}/trips`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Normalize each trip from the database
        const normalized = data.map(t => normalizeTrip(t));
        setTrips(normalized);
      }
    } catch (err) {
      console.error('Error fetching user trips:', err);
    } finally {
      setIsLoadingTrips(false);
    }
  }, []);

  useEffect(() => {
    fetchUserTrips();
  }, [fetchUserTrips]);

  // Fetch a single trip by ID from backend
  const fetchTripById = useCallback(async (tripId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to view this trip');
    }

    try {
      const res = await fetch(`${API_URL}/trips/${tripId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to load trip');
      }

      const normalized = normalizeTrip(data);
      setCurrentItinerary(normalized);
      return normalized;
    } catch (err) {
      throw err;
    }
  }, []);

  const generateItinerary = async (tripData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to generate a trip');
    }

    setIsGenerating(true);
    try {
      // Map frontend 'style' field to backend 'travelStyle'
      const payload = {
        destination: tripData.destination,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        budget: Number(tripData.budget),
        currency: tripData.currency || 'USD',
        travelStyle: tripData.style || tripData.travelStyle || 'adventure',
        travelers: tripData.travelers || 1,
      };

      const res = await fetch(`${API_URL}/trips/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Generation failed');
      }

      // Auto-save the generated trip to the database
      const savePayload = {
        destination: data.destination || payload.destination,
        startDate: data.startDate || payload.startDate,
        endDate: data.endDate || payload.endDate,
        travelers: data.travelers || payload.travelers,
        budget: data.budget || payload.budget,
        currency: data.currency || payload.currency,
        travelStyle: data.travelStyle || payload.travelStyle,
        isPublic: false,
        itinerary: data.itinerary || [],
      };

      const saveRes = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(savePayload),
      });

      const savedData = await saveRes.json();

      if (!saveRes.ok) {
        // If save fails, still show the generated data but warn
        console.warn('Failed to save trip:', savedData.message);
        const normalized = normalizeTrip(data);
        setCurrentItinerary(normalized);
        setIsGenerating(false);
        return normalized;
      }

      const normalized = normalizeTrip(savedData);
      setCurrentItinerary(normalized);
      setTrips((prev) => [normalized, ...prev]);
      setIsGenerating(false);
      return normalized;
    } catch (err) {
      setIsGenerating(false);
      throw err;
    }
  };

  const saveTrip = async (tripPayload) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to save a trip');
    }

    // Convert frontend structure back to backend DB schema structure if saving
    const dbPayload = {
      destination: tripPayload.destination,
      startDate: tripPayload.startDate,
      endDate: tripPayload.endDate,
      travelers: tripPayload.travelers,
      budget: tripPayload.budget,
      currency: tripPayload.currency,
      travelStyle: tripPayload.style || tripPayload.travelStyle,
      isPublic: tripPayload.isPublic || false,
      itinerary: (tripPayload.days || []).map(day => ({
        dayNumber: day.dayNumber,
        date: day.date,
        activities: (day.activities || []).map(act => ({
          timeSlot: act.period === 'afternoon' ? 'Afternoon' : (act.period === 'evening' ? 'Evening' : 'Morning'),
          title: act.title,
          description: act.description,
          costEstimate: act.cost,
          costCurrency: act.currency,
          locationName: act.title,
          coordinates: act.location
        }))
      }))
    };

    try {
      const res = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dbPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save trip');
      }

      const normalized = normalizeTrip(data);
      setTrips((prev) => [normalized, ...prev]);
      return normalized;
    } catch (err) {
      throw err;
    }
  };

  const deleteTrip = async (tripId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const res = await fetch(`${API_URL}/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete trip');
      }

      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      return true;
    } catch (err) {
      throw err;
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        currentItinerary,
        isGenerating,
        isLoadingTrips,
        generateItinerary,
        saveTrip,
        deleteTrip,
        setCurrentItinerary,
        fetchUserTrips,
        fetchTripById
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
}
