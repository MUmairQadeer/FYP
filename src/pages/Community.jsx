import React from 'react';
import { motion } from 'framer-motion';
import { MOCK_TRIPS } from '../utils/constants';
import { MapPin, Users, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Community() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
      <div className="container-custom mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-4">
            Travel <span className="gradient-text">Community</span>
          </h1>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Explore public itineraries created by other travelers. Clone them or use them for inspiration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TRIPS.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card !p-0 overflow-hidden group"
            >
              <div className="h-40 bg-dark-800 relative overflow-hidden flex items-center justify-center">
                 {/* Placeholder for an actual image */}
                 <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent z-10" />
                 <span className="text-6xl relative z-0">{trip.emoji}</span>
                 <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full text-[11px] font-medium bg-dark-900/80 text-white backdrop-blur-sm border border-white/10">
                    {trip.days} Days
                 </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-lg">{trip.destination}</h3>
                  <div className="flex items-center gap-1 text-dark-400 hover:text-accent-400 transition-colors cursor-pointer">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">124</span>
                  </div>
                </div>
                <p className="text-dark-400 text-sm mb-4 line-clamp-2">A beautiful {trip.style} trip covering the best spots in {trip.destination}.</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-[10px] text-primary-400">
                      AI
                    </div>
                    <span className="text-xs text-dark-400">by AI Explorer</span>
                  </div>
                  <Link to={`/itinerary/${trip.id}`} className="text-primary-400 hover:text-primary-300 text-sm font-medium no-underline">
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
