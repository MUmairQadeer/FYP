import React, { createContext, useContext, useState } from 'react';
import { MOCK_TRIPS, MOCK_ITINERARY } from '../utils/constants';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(MOCK_TRIPS);
  const [currentItinerary, setCurrentItinerary] = useState(MOCK_ITINERARY);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateItinerary = async (tripData) => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 3000));
    setCurrentItinerary(MOCK_ITINERARY);
    setIsGenerating(false);
    return MOCK_ITINERARY;
  };

  const saveTrip = (trip) => {
    setTrips(prev => [trip, ...prev]);
  };

  const deleteTrip = (tripId) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };

  return (
    <TripContext.Provider value={{ trips, currentItinerary, isGenerating, generateItinerary, saveTrip, deleteTrip, setCurrentItinerary }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
}
