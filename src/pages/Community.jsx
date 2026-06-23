import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Heart, Share2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

// Helper to compute trip emoji
const getTripEmoji = (destination) => {
  const d = (destination || '').toLowerCase();
  if (d.includes('pakistan')) return '🇵🇰';
  if (d.includes('japan')) return '🇯🇵';
  if (d.includes('france') || d.includes('paris')) return '🇫🇷';
  if (d.includes('dubai') || d.includes('uae')) return '🇦🇪';
  if (d.includes('uk') || d.includes('london')) return '🇬🇧';
  if (d.includes('usa') || d.includes('york')) return '🇺🇸';
  if (d.includes('turkey') || d.includes('istanbul')) return '🇹🇷';
  return '✈️';
};

export default function Community() {
  const [publicTrips, setPublicTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicTrips = async () => {
      try {
        const res = await fetch(`${API_URL}/trips/public`);
        if (res.ok) {
          const data = await res.json();
          setPublicTrips(data);
        }
      } catch (err) {
        console.error('Failed to fetch public trips:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicTrips();
  }, []);

  // Compute days count from dates
  const getDaysCount = (trip) => {
    if (trip.itinerary && trip.itinerary.length > 0) return trip.itinerary.length;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
  };

  return (
    <div className="page-transition" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '64px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight" style={{ marginBottom: 16 }}>
            Travel <span className="gradient-text">Community</span>
          </h1>
          <p className="text-dark-400" style={{ maxWidth: 672, margin: '0 auto', lineHeight: 1.6 }}>
            Explore public itineraries created by other travelers. Clone them or use them for inspiration.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-400 animate-spin mb-4" />
            <p className="text-dark-400">Loading community trips...</p>
          </div>
        ) : publicTrips.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-6">🌍</div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">No public trips yet</h3>
            <p className="text-dark-400 mb-6 max-w-sm">Be the first to share your AI-generated trip with the community!</p>
            <Link to="/plan" className="btn-primary no-underline">
              Plan & Share a Trip
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {publicTrips.map((trip, i) => {
              const emoji = getTripEmoji(trip.destination);
              const daysCount = getDaysCount(trip);
              const creatorName = trip.userId?.name || 'Anonymous Traveler';

              return (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card !p-0 overflow-hidden group hover:glass-card-glow"
                >
                  <div className="h-40 bg-dark-800 relative overflow-hidden flex items-center justify-center">
                     {/* Placeholder for an actual image */}
                     <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent z-10" />
                     <span className="text-6xl relative z-0">{emoji}</span>
                     <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full text-[11px] font-medium bg-dark-900/80 text-white backdrop-blur-sm border border-white/10">
                        {daysCount} Days
                     </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold text-lg">{trip.destination}</h3>
                      <div className="flex items-center gap-1 text-dark-400 hover:text-accent-400 transition-colors cursor-pointer">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{trip.likes || 0}</span>
                      </div>
                    </div>
                    <p className="text-dark-400 text-sm mb-4 line-clamp-2">
                      A beautiful {trip.travelStyle || 'adventure'} trip covering the best spots in {trip.destination}.
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-[10px] text-primary-400">
                          {creatorName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-dark-400">by {creatorName}</span>
                      </div>
                      <Link to={`/itinerary/${trip._id}`} className="btn-secondary !py-1.5 !px-4 !text-xs no-underline">
                        View
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
