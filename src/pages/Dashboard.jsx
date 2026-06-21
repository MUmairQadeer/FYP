import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, MapPin, Calendar, Users, Wallet, Plane, ChevronRight,
  Clock, TrendingUp, Globe, Sparkles, MoreVertical, Trash2, Eye,
  Filter
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
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{trip.emoji}</span>
            <div>
              <h3 className="text-white font-semibold text-base">{trip.destination}</h3>
              <p className="text-dark-500 text-xs">{trip.country}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${sc.bg} ${sc.text}`}>
            {sc.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-dark-400 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{trip.startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-dark-400 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{trip.days} days</span>
          </div>
          <div className="flex items-center gap-2 text-dark-400 text-xs">
            <Users className="w-3.5 h-3.5" />
            <span>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-dark-400 text-xs">
            <Wallet className="w-3.5 h-3.5" />
            <span>{trip.currency} {trip.budget.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <span className="text-dark-500 text-xs">{trip.activities} activities planned</span>
          <Link
            to={`/itinerary/${trip.id}`}
            className="flex items-center gap-1 text-primary-400 text-xs font-medium no-underline hover:text-primary-300 transition-colors"
          >
            View Itinerary <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { trips } = useTrips();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter);
  const stats = [
    { icon: Globe, label: 'Countries', value: '3', color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { icon: Plane, label: 'Total Trips', value: trips.length.toString(), color: 'text-accent-400', bg: 'bg-accent-500/10' },
    { icon: MapPin, label: 'Activities', value: '86', color: 'text-success-500', bg: 'bg-success-500/10' },
    { icon: TrendingUp, label: 'Budget Saved', value: '15%', color: 'text-warning-500', bg: 'bg-warning-500/10' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
      <div className="container-custom mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold font-heading text-white">
              Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-dark-400 mt-1">Here's an overview of your travel plans</p>
          </div>
          <Link to="/plan" className="btn-primary no-underline">
            <Plus className="w-4 h-4" />
            New Trip
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card !p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-dark-400 text-xs">{stat.label}</p>
                <p className="text-white text-2xl font-bold font-heading">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {['all', 'upcoming', 'ongoing', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer capitalize ${
                filter === f
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-dark-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Trips Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
            {/* Add New Card */}
            <Link
              to="/plan"
              className="glass-card !p-0 flex items-center justify-center min-h-[260px] border-2 border-dashed !border-white/[0.08] hover:!border-primary-500/30 !bg-transparent no-underline group"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-500/10 transition-colors">
                  <Plus className="w-6 h-6 text-dark-400 group-hover:text-primary-400 transition-colors" />
                </div>
                <p className="text-dark-400 text-sm font-medium group-hover:text-white transition-colors">Plan New Trip</p>
              </div>
            </Link>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No trips yet</h3>
            <p className="text-dark-400 mb-6">Start planning your first AI-powered trip!</p>
            <Link to="/plan" className="btn-primary no-underline">
              <Sparkles className="w-4 h-4" /> Plan Your First Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
