import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, MapPin, Calendar, Users, Wallet, Plane, ChevronRight,
  Clock, Globe, Sparkles
} from 'lucide-react';
import { useTrips } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';

const statusColors = {
  upcoming: { bg: 'bg-primary-500/10', text: 'text-primary-400', label: 'Upcoming' },
  ongoing: { bg: 'bg-success-500/10', text: 'text-success-500', label: 'Ongoing' },
  completed: { bg: 'bg-dark-600/30', text: 'text-dark-400', label: 'Completed' },
};

function TripCard({ trip }) {
  const sc = statusColors[trip.status] || statusColors.upcoming;
  const daysCount = trip.daysCount || trip.days?.length || 0;
  const activitiesCount = trip.activities || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card !p-0 overflow-hidden group"
    >
      {/* Color bar */}
      <div className="h-1.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />
      
      <div className="p-6">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <span className="text-3xl shrink-0">{trip.emoji}</span>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-base truncate">{trip.destination}</h3>
              <p className="text-dark-500 text-xs">{trip.country}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${sc.bg} ${sc.text}`}>
            {sc.label}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="flex items-center gap-2 text-dark-400 text-xs">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{trip.startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-dark-400 text-xs">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{daysCount} days</span>
          </div>
          <div className="flex items-center gap-2 text-dark-400 text-xs">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-dark-400 text-xs">
            <Wallet className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{trip.currency} {Number(trip.budget).toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-dark-500 text-xs">{activitiesCount} activities</span>
          <Link
            to={`/itinerary/${trip.id}`}
            className="flex items-center gap-1 text-primary-400 text-xs font-medium no-underline hover:text-primary-300 transition-colors"
          >
            View <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { trips, fetchUserTrips, isLoadingTrips } = useTrips();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  // Re-fetch trips when user changes (after login)
  useEffect(() => {
    if (user) {
      fetchUserTrips();
    }
  }, [user, fetchUserTrips]);

  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter);

  // Compute real stats from trips
  const uniqueCountries = new Set(trips.map(t => t.country).filter(Boolean));
  const totalDaysPlanned = trips.reduce((sum, t) => sum + (t.daysCount || 0), 0);
  const sharedTrips = trips.filter(t => t.isPublic).length;

  const stats = [
    { icon: Globe, label: 'Countries', value: uniqueCountries.size.toString(), color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { icon: Plane, label: 'Total Trips', value: trips.length.toString(), color: 'text-accent-400', bg: 'bg-accent-500/10' },
    { icon: Calendar, label: 'Days Planned', value: totalDaysPlanned.toString(), color: 'text-success-500', bg: 'bg-success-500/10' },
    { icon: Users, label: 'Trips Shared', value: sharedTrips.toString(), color: 'text-warning-500', bg: 'bg-warning-500/10' },
  ];

  return (
    <div className="page-transition" style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
              Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-dark-400 mt-1 text-sm">Here's an overview of your travel plans</p>
          </div>
          <Link to="/plan" className="btn-primary no-underline shrink-0">
            <Plus className="w-4 h-4" />
            Plan New Trip
          </Link>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card !p-4 sm:!p-5 flex items-center gap-3 sm:gap-4"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-dark-400 text-[11px] sm:text-xs">{stat.label}</p>
                <p className="text-white text-xl sm:text-2xl font-bold font-heading">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="hide-scrollbar" style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
          {['all', 'upcoming', 'ongoing', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer capitalize whitespace-nowrap ${
                filter === f
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-dark-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.08]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoadingTrips && trips.length === 0 && (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 border-4 border-dark-700 border-t-primary-500 rounded-full animate-spin mb-6" />
            <p className="text-dark-400">Loading your trips...</p>
          </div>
        )}

        {/* Trips Grid */}
        {!isLoadingTrips && filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {filtered.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
            {/* Add New Card */}
            <Link
              to="/plan"
              className="glass-card !p-0 flex items-center justify-center min-h-[240px] border-2 border-dashed !border-white/[0.08] hover:!border-primary-500/50 hover:bg-primary-500/5 transition-all no-underline group"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-primary-500/20 transition-all">
                  <Plus className="w-6 h-6 text-dark-400 group-hover:text-primary-400 transition-colors" />
                </div>
                <p className="text-dark-400 text-sm font-medium group-hover:text-white transition-colors">Plan New Trip</p>
              </div>
            </Link>
          </div>
        ) : !isLoadingTrips && (
          <div className="glass-card flex flex-col items-center justify-center py-20 sm:py-24 text-center">
            <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mb-6">
              <Plane className="w-10 h-10 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">No trips planned yet</h3>
            <p className="text-dark-400 mb-8 max-w-sm px-4">
              Ready for your next adventure? Let AI generate the perfect itinerary for you in seconds.
            </p>
            <Link to="/plan" className="btn-primary no-underline">
              <Sparkles className="w-4 h-4" /> Start Planning
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
