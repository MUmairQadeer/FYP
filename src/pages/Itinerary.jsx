import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, DollarSign, Star, ChevronDown, ChevronUp,
  Share2, Download, RefreshCw, Edit3, Sparkles, Navigation,
  Coffee, Utensils, Camera, Bus, ArrowRight, Calendar, Users, Wallet
} from 'lucide-react';
import { useTrips } from '../contexts/TripContext';

const typeIcons = {
  attraction: Camera,
  food: Utensils,
  transport: Bus,
  activity: Navigation,
};

const periodColors = {
  morning: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  afternoon: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  evening: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
};

function ActivityCard({ activity, index }) {
  const [expanded, setExpanded] = useState(false);
  const TypeIcon = typeIcons[activity.type] || Camera;
  const pColor = periodColors[activity.period] || periodColors.morning;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex gap-4"
    >
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-xl ${pColor.bg} flex items-center justify-center shrink-0`}>
          <span className="text-lg">{activity.icon}</span>
        </div>
        <div className="w-px flex-1 bg-dark-700/50 my-1" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div
          className="glass-card !p-5 cursor-pointer group !rounded-2xl"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pColor.bg} ${pColor.text}`}>
                  {activity.time}
                </span>
                {activity.rating && (
                  <span className="flex items-center gap-0.5 text-xs text-warning-500">
                    <Star className="w-3 h-3 fill-warning-500" />
                    {activity.rating}
                  </span>
                )}
              </div>
              <h4 className="text-white font-semibold text-[15px] mb-1">{activity.title}</h4>
              <div className="flex flex-wrap items-center gap-3 text-xs text-dark-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.duration}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  €{activity.cost}
                </span>
              </div>
            </div>
            <button className="text-dark-500 hover:text-white transition-colors p-1">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t border-white/[0.06]"
            >
              <p className="text-dark-300 text-sm leading-relaxed mb-3">{activity.description}</p>
              <div className="flex items-center gap-2">
                <a href={`https://maps.google.com/?q=${activity.location?.lat},${activity.location?.lng}`} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-1.5 !px-3 !text-xs no-underline">
                  <Navigation className="w-3 h-3" /> Directions
                </a>
                <button className="btn-secondary !py-1.5 !px-3 !text-xs">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Itinerary() {
  const { id } = useParams();
  const { currentItinerary } = useTrips();
  const [activeDay, setActiveDay] = useState(0);

  if (!currentItinerary) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-dark-400 text-lg mb-4">No itinerary found</p>
          <Link to="/plan" className="btn-primary no-underline">
            <Sparkles className="w-4 h-4" /> Plan a Trip
          </Link>
        </div>
      </div>
    );
  }

  const dayData = currentItinerary.days[activeDay];
  const totalCost = dayData.activities.reduce((sum, a) => sum + a.cost, 0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
      <div className="container-custom mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-primary-400 text-sm font-medium mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Generated Itinerary
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">
                {currentItinerary.destination}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary !py-2 !px-4 !text-sm">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="btn-secondary !py-2 !px-4 !text-sm">
                <Download className="w-4 h-4" /> PDF
              </button>
              <button className="btn-primary !py-2 !px-4 !text-sm">
                <RefreshCw className="w-4 h-4" /> Regenerate
              </button>
            </div>
          </div>

          {/* Trip Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Calendar, label: 'Duration', value: `${currentItinerary.days.length} Days` },
              { icon: MapPin, label: 'Activities', value: `${currentItinerary.days.reduce((s, d) => s + d.activities.length, 0)} planned` },
              { icon: Users, label: 'Travelers', value: '2 people' },
              { icon: Wallet, label: 'Est. Budget', value: '€3,000' },
            ].map((stat, i) => (
              <div key={i} className="glass-light rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-dark-500 text-xs">{stat.label}</p>
                  <p className="text-white text-sm font-semibold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Day Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card !p-4 sticky top-24">
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Days</h3>
              <div className="space-y-1">
                {currentItinerary.days.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                      activeDay === i
                        ? 'bg-primary-500/20 border border-primary-500/30'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${activeDay === i ? 'text-white' : 'text-dark-300'}`}>
                      Day {day.dayNumber}
                    </p>
                    <p className="text-dark-500 text-xs mt-0.5">{day.title}</p>
                    <p className="text-dark-600 text-[10px] mt-0.5">{day.activities.length} activities</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activities Timeline */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white font-heading">
                    Day {dayData.dayNumber}: {dayData.title}
                  </h2>
                  <p className="text-dark-400 text-sm mt-1">
                    {dayData.date} • {dayData.activities.length} activities • Est. €{totalCost}
                  </p>
                </div>
                <button className="btn-secondary !py-2 !px-3 !text-xs">
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate Day
                </button>
              </div>

              {/* Period Sections */}
              {['morning', 'afternoon', 'evening'].map(period => {
                const activities = dayData.activities.filter(a => a.period === period);
                if (activities.length === 0) return null;
                const pColor = periodColors[period];
                return (
                  <div key={period} className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${pColor.bg} ${pColor.text} text-xs font-semibold uppercase tracking-wider`}>
                      {period === 'morning' ? <Coffee className="w-3.5 h-3.5" /> :
                       period === 'afternoon' ? <Camera className="w-3.5 h-3.5" /> :
                       <Star className="w-3.5 h-3.5" />}
                      {period}
                    </div>
                    {activities.map((activity, i) => (
                      <ActivityCard key={activity.id} activity={activity} index={i} />
                    ))}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
