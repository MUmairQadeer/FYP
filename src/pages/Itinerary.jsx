import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, DollarSign, Star, ChevronDown, ChevronUp,
  Share2, Download, RefreshCw, Edit3, Sparkles, Navigation,
  Coffee, Utensils, Camera, Bus, Calendar, Users, Wallet, CheckCircle, Compass, Loader2
} from 'lucide-react';
import { useTrips } from '../contexts/TripContext';

const typeIcons = {
  attraction: Camera,
  food: Utensils,
  transport: Bus,
  activity: Navigation,
};

const periodColors = {
  morning: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: Coffee },
  afternoon: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: Camera },
  evening: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: Star },
};

function ActivityCard({ activity, index, currency }) {
  const [expanded, setExpanded] = useState(false);
  const TypeIcon = typeIcons[activity.type] || Camera;
  const pColor = periodColors[activity.period] || periodColors.morning;
  const displayCurrency = activity.currency || currency || 'USD';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex gap-4 relative"
    >
      {/* Timeline Line (connector) */}
      <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-white/[0.06]" />

      {/* Timeline Node */}
      <div className="flex flex-col items-center relative z-10 shrink-0">
        <div className={`w-10 h-10 rounded-xl ${pColor.bg} flex items-center justify-center shadow-lg`}>
          <span className="text-lg">{activity.icon}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div
          className={`glass-card !p-5 cursor-pointer group !rounded-2xl transition-all border border-transparent hover:border-white/[0.1] ${expanded ? 'glass-card-glow' : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${pColor.bg} ${pColor.text}`}>
                  {activity.time}
                </span>
                {activity.rating && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-warning-500 bg-warning-500/10 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-warning-500" />
                    {activity.rating}
                  </span>
                )}
              </div>
              <h4 className="text-white font-semibold text-lg mb-2">{activity.title}</h4>
              <div className="flex flex-wrap items-center gap-3 text-xs text-dark-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {activity.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {displayCurrency} {activity.cost}
                </span>
                <span className="flex items-center gap-1.5 capitalize">
                  <TypeIcon className="w-3.5 h-3.5" />
                  {activity.type}
                </span>
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.04] text-dark-400 transition-transform ${expanded ? 'rotate-180 bg-primary-500/20 text-primary-400' : 'group-hover:bg-white/[0.08]'}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <div className="bg-primary-500/5 border border-primary-500/10 rounded-xl p-3 mb-4 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                    <p className="text-dark-300 text-sm leading-relaxed">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`https://maps.google.com/?q=${activity.location?.lat},${activity.location?.lng}`} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !px-4 !text-xs no-underline">
                      <Navigation className="w-3.5 h-3.5" /> Get Directions
                    </a>
                    <button className="btn-secondary !py-2 !px-4 !text-xs">
                      <Edit3 className="w-3.5 h-3.5" /> Modify
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function Itinerary() {
  const { id } = useParams();
  const { currentItinerary, setCurrentItinerary, fetchTripById } = useTrips();
  const [activeDay, setActiveDay] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // If currentItinerary is null or doesn't match the URL ID, fetch from backend
  useEffect(() => {
    const loadTrip = async () => {
      // Skip if we already have the matching itinerary loaded
      if (currentItinerary && currentItinerary.id === id) {
        return;
      }

      // Don't try to fetch mock IDs like "trip-1"
      if (!id || id.startsWith('trip-')) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        await fetchTripById(id);
      } catch (err) {
        console.error('Failed to load trip:', err);
        setError(err.message || 'Failed to load trip');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrip();
  }, [id, currentItinerary, fetchTripById]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card text-center max-w-sm p-10">
          <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-heading">Loading Itinerary...</h2>
          <p className="text-dark-400 text-sm">Fetching your trip details</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card text-center max-w-sm p-10">
          <div className="w-16 h-16 bg-error-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="w-8 h-8 text-error-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-heading">Error Loading Trip</h2>
          <p className="text-dark-400 text-sm mb-6">{error}</p>
          <Link to="/dashboard" className="btn-primary no-underline w-full justify-center">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!currentItinerary) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card text-center max-w-sm p-10">
          <div className="w-16 h-16 bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="w-8 h-8 text-dark-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 font-heading">No itinerary found</h2>
          <p className="text-dark-400 text-sm mb-6">We couldn't find the trip you're looking for.</p>
          <Link to="/plan" className="btn-primary no-underline w-full justify-center">
            <Sparkles className="w-4 h-4" /> Plan a New Trip
          </Link>
        </div>
      </div>
    );
  }

  const dayData = currentItinerary.days[activeDay];
  if (!dayData) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card text-center max-w-sm p-10">
          <h2 className="text-xl font-bold text-white mb-2 font-heading">No days in this itinerary</h2>
          <Link to="/plan" className="btn-primary no-underline w-full justify-center mt-4">
            <Sparkles className="w-4 h-4" /> Plan a New Trip
          </Link>
        </div>
      </div>
    );
  }

  const tripCurrency = currentItinerary.currency || 'USD';
  const totalCost = dayData.activities.reduce((sum, a) => sum + a.cost, 0);
  const totalTripCost = currentItinerary.days.reduce(
    (sum, d) => sum + d.activities.reduce((s, a) => s + a.cost, 0), 0
  );

  // Compute per-category breakdown for the active day
  const categoryBreakdown = dayData.activities.reduce((acc, a) => {
    const cat = a.type || 'activity';
    acc[cat] = (acc[cat] || 0) + a.cost;
    return acc;
  }, {});

  const categoryLabels = {
    attraction: { label: 'Attractions', icon: Camera },
    food: { label: 'Food & Dining', icon: Utensils },
    transport: { label: 'Transport', icon: Bus },
    activity: { label: 'Activities', icon: Navigation },
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
      <div className="container-custom mx-auto max-w-6xl">
        
        {/* Beautiful Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8"
        >
          {/* Background pattern/gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-dark-900 to-accent-900/40 border border-white/[0.06] rounded-3xl" />
          <div className="absolute top-0 right-0 p-10 opacity-30 text-9xl">🌍</div>
          
          <div className="relative p-8 sm:p-12 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" /> AI Generated
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white tracking-tight mb-2">
                {currentItinerary.destination}
              </h1>
              <p className="text-dark-300 text-lg">Your perfect adventure, curated for you.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="btn-secondary !py-2 !px-4 !bg-white/5 !border-white/10 hover:!bg-white/10 glass-blur">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="btn-primary !py-2 !px-4">
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>
        </motion.div>

        {/* Global Trip Stats — Dynamic */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Calendar, label: 'Duration', value: `${currentItinerary.days.length} Days`, color: 'text-primary-400', bg: 'bg-primary-500/10' },
            { icon: MapPin, label: 'Activities', value: `${currentItinerary.activities || currentItinerary.days.reduce((s, d) => s + d.activities.length, 0)} planned`, color: 'text-success-500', bg: 'bg-success-500/10' },
            { icon: Users, label: 'Travelers', value: `${currentItinerary.travelers} ${currentItinerary.travelers === 1 ? 'person' : 'people'}`, color: 'text-warning-500', bg: 'bg-warning-500/10' },
            { icon: Wallet, label: 'Est. Budget', value: `${tripCurrency} ${Number(currentItinerary.budget).toLocaleString()}`, color: 'text-accent-400', bg: 'bg-accent-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card !p-4 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-dark-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-white text-lg font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sticky Horizontal Day Selector */}
        <div className="sticky top-[72px] z-40 bg-dark-950/80 backdrop-blur-md py-4 mb-8 border-b border-white/[0.06] -mx-6 px-6 sm:mx-0 sm:px-0">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x pb-2">
            {currentItinerary.days.map((day, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`snap-start whitespace-nowrap px-6 py-3 rounded-full font-medium text-sm transition-all cursor-pointer border ${
                  activeDay === i
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 border-primary-500/50'
                    : 'glass-light text-dark-400 hover:text-white border-white/[0.06] hover:bg-white/[0.04]'
                }`}
              >
                Day {day.dayNumber}: <span className={activeDay === i ? 'text-white' : 'text-dark-500'}>{day.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 60/40 Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left: 60% Activities Timeline */}
          <div className="flex-1 w-full lg:w-[60%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white font-heading tracking-tight">
                      Day {dayData.dayNumber}: {dayData.title}
                    </h2>
                    <p className="text-dark-400 text-sm mt-1">
                      {dayData.date} • {dayData.activities.length} activities • Est. {tripCurrency} {totalCost.toLocaleString()}
                    </p>
                  </div>
                  <button className="btn-secondary !py-2 !px-3 !text-xs hidden sm:flex">
                    <RefreshCw className="w-3.5 h-3.5" /> Auto-Optimize
                  </button>
                </div>

                {/* Period Sections */}
                {['morning', 'afternoon', 'evening'].map(period => {
                  const activities = dayData.activities.filter(a => a.period === period);
                  if (activities.length === 0) return null;
                  const pColor = periodColors[period];
                  const PeriodIcon = pColor.icon;
                  
                  return (
                    <div key={period} className="mb-10 relative">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 ${pColor.bg} ${pColor.text} text-xs font-bold uppercase tracking-wider shadow-sm`}>
                        <PeriodIcon className="w-3.5 h-3.5" />
                        {period}
                      </div>
                      
                      <div className="space-y-2">
                        {activities.map((activity, i) => (
                          <ActivityCard key={activity.id} activity={activity} index={i} currency={tripCurrency} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: 40% Interactive Map & Budget */}
          <div className="w-full lg:w-[40%] hidden lg:block">
            <div className="sticky top-40 space-y-6">
              
              {/* Interactive Map Placeholder */}
              <div className="glass-card !p-1 overflow-hidden h-[300px] relative group">
                {/* Map Mock */}
                <div className="absolute inset-1 bg-dark-800 rounded-[18px] overflow-hidden flex items-center justify-center border border-white/[0.04]">
                  <div className="text-center opacity-50">
                    <MapPin className="w-10 h-10 text-primary-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-white">Interactive Map</p>
                    <p className="text-xs text-dark-400">Showing {dayData.activities.length} locations</p>
                  </div>
                  
                  {/* Map Node Mocks */}
                  <div className="absolute top-[30%] left-[40%] w-3 h-3 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(var(--color-primary-500),0.8)]" />
                  <div className="absolute top-[60%] left-[30%] w-3 h-3 bg-accent-500 rounded-full shadow-[0_0_10px_rgba(var(--color-accent-500),0.8)]" />
                  <div className="absolute top-[45%] left-[70%] w-3 h-3 bg-warning-500 rounded-full shadow-[0_0_10px_rgba(var(--color-warning-500),0.8)]" />
                  
                  <svg className="absolute inset-0 w-full h-full opacity-20" pointerEvents="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M 40 30 Q 50 50 30 60 T 70 45" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                  </svg>
                </div>
                
                {/* Overlay Action */}
                <div className="absolute inset-0 bg-dark-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <button className="btn-primary">
                    Open Full Map
                  </button>
                </div>
              </div>

              {/* Budget Breakdown — Dynamic */}
              <div className="glass-card">
                <h3 className="text-lg font-bold font-heading text-white mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-success-500" />
                  Day {dayData.dayNumber} Budget
                </h3>
                <div className="space-y-4">
                  {Object.entries(categoryBreakdown).map(([cat, amount]) => {
                    const catInfo = categoryLabels[cat] || { label: cat, icon: Navigation };
                    const CatIcon = catInfo.icon;
                    return (
                      <div key={cat} className="flex justify-between items-center text-sm">
                        <span className="text-dark-400 flex items-center gap-2">
                          <CatIcon className="w-4 h-4 text-dark-500" /> {catInfo.label}
                        </span>
                        <span className="text-white font-medium">{tripCurrency} {amount.toLocaleString()}</span>
                      </div>
                    );
                  })}
                  
                  <div className="border-t border-white/[0.06] pt-4 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Total for today</span>
                      <span className="text-xl font-bold text-success-500">{tripCurrency} {totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="glass-card bg-primary-500/5 border-primary-500/20">
                <h3 className="text-sm font-bold font-heading text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  AI Local Tip
                </h3>
                <p className="text-sm text-dark-300 leading-relaxed">
                  Plan to arrive early at popular attractions to avoid crowds. Use local public transit for a more authentic experience and to save on your {tripCurrency} {Number(currentItinerary.budget).toLocaleString()} budget!
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
