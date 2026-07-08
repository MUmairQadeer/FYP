import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, DollarSign, Star, ChevronDown,
  Share2, Download, RefreshCw, Edit3, Sparkles, Navigation,
  Coffee, Utensils, Camera, Bus, Calendar, Users, Wallet,
  CheckCircle, Compass, Loader2, Copy, Check,
} from 'lucide-react';
import { useTrips } from '../contexts/TripContext';
import toast from 'react-hot-toast';

// Leaflet map (lazy-loaded to avoid SSR issues)
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon broken in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom coloured marker factory
const makeIcon = (color = '#3B82F6') => L.divIcon({
  className: '',
  html: `<div style="
    width:28px;height:28px;border-radius:50% 50% 50% 0;
    background:${color};border:3px solid white;
    transform:rotate(-45deg);
    box-shadow:0 2px 8px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

const markerColors = {
  attraction: '#3B82F6',
  food:       '#F59E0B',
  transport:  '#10B981',
  activity:   '#8B5CF6',
};

/* ── Recenter map when activities change ── */
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 13); }, [center, map]);
  return null;
}

/* ── Activity icon types ── */
const typeIcons = {
  attraction: Camera,
  food:       Utensils,
  transport:  Bus,
  activity:   Navigation,
};

const periodColors = {
  morning:   { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20',  icon: Coffee },
  afternoon: { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20',   icon: Camera },
  evening:   { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: Star },
};

/* ─────────────────── ActivityCard ─────────────────── */
function ActivityCard({ activity, index, currency }) {
  const [expanded, setExpanded] = useState(false);
  const TypeIcon = typeIcons[activity.type] || Camera;
  const pColor   = periodColors[activity.period] || periodColors.morning;
  const displayCurrency = activity.currency || currency || 'USD';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex gap-3 sm:gap-4 relative"
    >
      {/* Timeline connector line */}
      <div className="absolute left-[18px] sm:left-5 top-10 bottom-[-16px] sm:bottom-[-24px] w-px bg-gradient-to-b from-white/[0.08] to-transparent" />
      <div className="flex flex-col items-center relative z-10 shrink-0">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${pColor.bg} flex items-center justify-center shadow-lg ring-2 ring-dark-950`}>
          <span className="text-base sm:text-lg">{activity.icon}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0 pb-4 sm:pb-6">
        <div
          className={`bg-dark-800/80 backdrop-blur-sm border border-white/[0.06] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 cursor-pointer group transition-all duration-200 hover:border-white/[0.12] hover:bg-dark-800 ${expanded ? 'border-primary-500/30 shadow-lg shadow-primary-500/5' : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                <span className={`text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider ${pColor.bg} ${pColor.text}`}>
                  {activity.time}
                </span>
                {activity.rating && (
                  <span className="flex items-center gap-0.5 text-[10px] sm:text-xs font-medium text-warning-500 bg-warning-500/10 px-1.5 sm:px-2 py-0.5 rounded-full">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-warning-500" />{activity.rating}
                  </span>
                )}
              </div>
              <h4 className="text-white font-semibold text-sm sm:text-lg mb-1.5 sm:mb-2 leading-snug">{activity.title}</h4>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-dark-400 font-medium">
                <span className="flex items-center gap-1 sm:gap-1.5"><Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{activity.duration}</span>
                <span className="flex items-center gap-1 sm:gap-1.5"><DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{displayCurrency} {activity.cost}</span>
                <span className="flex items-center gap-1 sm:gap-1.5 capitalize"><TypeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{activity.type}</span>
              </div>
            </div>
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${expanded ? 'rotate-180 bg-primary-500/20 text-primary-400' : 'bg-white/[0.04] text-dark-400 group-hover:bg-white/[0.08]'}`}>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/[0.06]">
                  <div className="bg-primary-500/5 border border-primary-500/10 rounded-lg sm:rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400 shrink-0 mt-0.5" />
                    <p className="text-dark-300 text-xs sm:text-sm leading-relaxed">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`https://maps.google.com/?q=${activity.location?.lat},${activity.location?.lng}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn-secondary !py-1.5 sm:!py-2 !px-3 sm:!px-4 !text-[11px] sm:!text-xs no-underline"
                    >
                      <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Directions
                    </a>
                    <button className="btn-secondary !py-1.5 sm:!py-2 !px-3 sm:!px-4 !text-[11px] sm:!text-xs">
                      <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Modify
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

/* ─────────────────── PDF Export ─────────────────── */
async function exportPDF(itinerary) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210; // A4 width mm
  let y = 20;
  const margin = 20;
  const contentW = W - margin * 2;

  // Helper: add new page if near bottom
  const checkPage = (needed = 15) => {
    if (y + needed > 280) { doc.addPage(); y = 20; }
  };

  // ── Cover / Header ──────────────────────────────
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, W, 50, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(itinerary.destination, margin, 30);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('AI-Generated Travel Itinerary — TripPlanner AI', margin, 40);
  y = 62;

  // ── Trip Summary ────────────────────────────────
  doc.setFillColor(26, 29, 39);
  doc.roundedRect(margin, y, contentW, 30, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  const summaryItems = [
    ['Duration',   `${itinerary.days.length} Days`],
    ['Travelers',  `${itinerary.travelers}`],
    ['Budget',     `${itinerary.currency || 'USD'} ${Number(itinerary.budget).toLocaleString()}`],
    ['Style',      itinerary.travelStyle || 'Adventure'],
  ];
  summaryItems.forEach(([label, val], i) => {
    const x = margin + 8 + i * (contentW / 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(label.toUpperCase(), x, y + 11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(val, x, y + 22);
  });
  y += 42;

  // ── Days ────────────────────────────────────────
  itinerary.days.forEach((day, di) => {
    checkPage(25);
    // Day header bar
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(margin, y, contentW, 12, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`Day ${day.dayNumber}: ${day.title}`, margin + 5, y + 8.5);
    y += 18;

    day.activities.forEach((act) => {
      checkPage(22);
      // Activity row
      doc.setFillColor(30, 33, 45);
      doc.roundedRect(margin, y, contentW, 18, 2, 2, 'F');
      // Left accent bar color by period
      const barColor = act.period === 'morning' ? [245,158,11] : act.period === 'evening' ? [139,92,246] : [59,130,246];
      doc.setFillColor(...barColor);
      doc.rect(margin, y, 3, 18, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(act.title, margin + 8, y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`${act.time}  •  ${act.duration}  •  ${itinerary.currency || 'USD'} ${act.cost}`, margin + 8, y + 14);

      // Cost on right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129);
      doc.text(`${itinerary.currency || 'USD'} ${act.cost}`, W - margin - 5, y + 10, { align: 'right' });
      y += 22;
      checkPage(5);
    });

    // Day total
    const dayTotal = day.activities.reduce((s, a) => s + a.cost, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Day Total: ${itinerary.currency || 'USD'} ${dayTotal.toLocaleString()}`, W - margin, y - 5, { align: 'right' });
    y += 10;
  });

  // ── Footer ──────────────────────────────────────
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Generated by TripPlanner AI  •  tripplanner.ai', W / 2, 290, { align: 'center' });

  doc.save(`TripPlanner-${itinerary.destination.replace(/[^a-z0-9]/gi, '_')}.pdf`);
}

/* ─────────────────── Share ─────────────────── */
async function shareTrip(destination, id) {
  const url = `${window.location.origin}/itinerary/${id}`;
  const text = `Check out my AI-generated trip to ${destination}!`;
  if (navigator.share) {
    try { await navigator.share({ title: `Trip to ${destination}`, text, url }); return; }
    catch { /* user cancelled */ return; }
  }
  // Fallback: copy to clipboard
  await navigator.clipboard.writeText(url);
  toast.success('Link copied to clipboard!', { icon: '🔗' });
}

/* ─────────────────── Main Page ─────────────────── */
export default function Itinerary() {
  const { id } = useParams();
  const { currentItinerary, fetchTripById } = useTrips();
  const [activeDay, setActiveDay]   = useState(0);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [exporting, setExporting]   = useState(false);

  useEffect(() => {
    const loadTrip = async () => {
      if (currentItinerary && currentItinerary.id === id) return;
      if (!id || id.startsWith('trip-')) return;
      setIsLoading(true);
      setError(null);
      try { await fetchTripById(id); }
      catch (err) { setError(err.message || 'Failed to load trip'); }
      finally { setIsLoading(false); }
    };
    loadTrip();
  }, [id, currentItinerary, fetchTripById]);

  const handleExportPDF = async () => {
    if (!currentItinerary) return;
    setExporting(true);
    try {
      await exportPDF(currentItinerary);
      toast.success('PDF exported!', { icon: '📄' });
    } catch (e) {
      toast.error('Export failed. Please try again.');
      console.error(e);
    } finally { setExporting(false); }
  };

  if (isLoading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="glass-card text-center max-w-sm p-10">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Loading Itinerary...</h2>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="glass-card text-center max-w-sm p-10">
        <Compass className="w-8 h-8 text-error-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Error Loading Trip</h2>
        <p className="text-dark-400 text-sm mb-6">{error}</p>
        <Link to="/dashboard" className="btn-primary no-underline w-full justify-center">Back to Dashboard</Link>
      </div>
    </div>
  );

  if (!currentItinerary) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="glass-card text-center max-w-sm p-10">
        <Compass className="w-8 h-8 text-dark-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No itinerary found</h2>
        <p className="text-dark-400 text-sm mb-6">We couldn't find the trip you're looking for.</p>
        <Link to="/plan" className="btn-primary no-underline w-full justify-center">
          <Sparkles className="w-4 h-4" /> Plan a New Trip
        </Link>
      </div>
    </div>
  );

  const dayData = currentItinerary.days[activeDay];
  if (!dayData) return null;

  const tripCurrency = currentItinerary.currency || 'USD';
  const totalCost    = dayData.activities.reduce((s, a) => s + a.cost, 0);

  const categoryBreakdown = dayData.activities.reduce((acc, a) => {
    const cat = a.type || 'activity';
    acc[cat] = (acc[cat] || 0) + a.cost;
    return acc;
  }, {});

  const categoryLabels = {
    attraction: { label: 'Attractions', icon: Camera },
    food:       { label: 'Food & Dining', icon: Utensils },
    transport:  { label: 'Transport',     icon: Bus },
    activity:   { label: 'Activities',    icon: Navigation },
  };

  // Map: collect activities with valid coords
  const mappableActivities = dayData.activities.filter(
    a => a.location?.lat && a.location?.lng
  );
  const mapCenter = mappableActivities.length > 0
    ? [mappableActivities[0].location.lat, mappableActivities[0].location.lng]
    : null;

  return (
    <div className="min-h-screen page-transition" style={{ paddingTop: '112px', paddingBottom: '64px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[2rem] overflow-hidden mb-6 sm:mb-8 shadow-2xl"
        >
          {/* Backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-dark-900 to-accent-900/40" />
          <div className="absolute inset-0 border border-white/[0.08] rounded-[2rem] pointer-events-none" />
          {/* Decorative Orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-accent-500/15 rounded-full blur-[80px] pointer-events-none" />

          {/* Content Wrapper with generous padding */}
          <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
            {/* Top row: Badge + Buttons */}
            <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 lg:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/20 border border-primary-500/20 text-primary-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> AI GENERATED
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => shareTrip(currentItinerary.destination, id)}
                  className="btn-secondary !py-2 !px-3 sm:!px-4 !text-[11px] sm:!text-sm !bg-white/5 !border-white/10 hover:!bg-white/15 !rounded-xl"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="btn-primary !py-2 !px-3 sm:!px-4 !text-[11px] sm:!text-sm !rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  style={{ opacity: exporting ? 0.7 : 1 }}
                >
                  {exporting
                    ? <><Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /><span className="hidden sm:inline">Exporting…</span></>
                    : <><Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />Export PDF</>}
                </button>
              </div>
            </div>

            {/* Title block */}
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-heading text-white tracking-tight leading-[1.1] mb-2 sm:mb-3">
                {currentItinerary.destination}
              </h1>
              <p className="text-dark-300 text-sm sm:text-base lg:text-lg font-medium">
                Your perfect adventure, curated for you.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row — always 4 columns ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
          {[
            { icon: Calendar, label: 'DURATION',    value: `${currentItinerary.days.length} Days`,                                                  color: 'text-primary-400', bg: 'bg-primary-500/10', accent: '#3B82F6' },
            { icon: MapPin,   label: 'ACTIVITIES',  value: `${currentItinerary.days.reduce((s,d) => s + d.activities.length, 0)} planned`,           color: 'text-success-500', bg: 'bg-success-500/10', accent: '#10B981' },
            { icon: Users,    label: 'TRAVELERS',   value: `${currentItinerary.travelers} ${currentItinerary.travelers === 1 ? 'person' : 'people'}`,color: 'text-warning-500', bg: 'bg-warning-500/10', accent: '#F59E0B' },
            { icon: Wallet,   label: 'EST. BUDGET', value: `${tripCurrency} ${Number(currentItinerary.budget).toLocaleString()}`,                    color: 'text-accent-400',  bg: 'bg-accent-500/10',  accent: '#F59E0B' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative overflow-hidden bg-dark-800/80 border border-white/[0.08] rounded-2xl p-4 sm:p-5 lg:p-6 flex items-center gap-3.5 sm:gap-4 shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] opacity-70" style={{ background: stat.accent }} />
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-dark-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-0.5">{stat.label}</p>
                <p className="text-white text-base sm:text-lg lg:text-xl font-bold truncate">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Day Selector ── */}
        <div className="sticky z-40 py-2 mb-6 sm:mb-8" style={{ top: 72, background: 'rgba(9,11,16,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '0 -20px', padding: '12px 20px' }}>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar">
            {currentItinerary.days.map((day, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer border shrink-0 ${
                  activeDay === i
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 border-primary-500'
                    : 'bg-dark-800/60 text-dark-400 hover:text-white border-white/[0.06] hover:bg-dark-800'
                }`}
              >
                Day {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main 60/40 Layout ── */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">

          {/* Left: Timeline */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {/* Day header */}
                <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight leading-snug">
                      Day {dayData.dayNumber}: {dayData.title}
                    </h2>
                    <p className="text-dark-500 text-[11px] sm:text-xs mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span>{dayData.date}</span>
                      <span className="text-dark-700">•</span>
                      <span>{dayData.activities.length} activities</span>
                      <span className="text-dark-700">•</span>
                      <span className="text-success-500 font-semibold">Est. {tripCurrency} {totalCost.toLocaleString()}</span>
                    </p>
                  </div>
                  <button className="btn-secondary !py-2 !px-4 !text-xs shrink-0 !rounded-xl gap-1.5 shadow-sm hover:shadow-md">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Auto-Optimize</span>
                    <span className="sm:hidden">Optimize</span>
                  </button>
                </div>

                {['morning', 'afternoon', 'evening'].map(period => {
                  const acts = dayData.activities.filter(a => a.period === period);
                  if (!acts.length) return null;
                  const pColor = periodColors[period];
                  const PeriodIcon = pColor.icon;
                  return (
                    <div key={period} className="mb-8 sm:mb-10">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4 ${pColor.bg} ${pColor.text} text-[10px] sm:text-xs font-bold uppercase tracking-widest`}>
                        <PeriodIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{period}
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        {acts.map((act, i) => (
                          <ActivityCard key={act.id} activity={act} index={i} currency={tripCurrency} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Sidebar */}
          <div style={{ width: '100%', flexShrink: 0 }} className="lg:max-w-[340px]">
            <div className="lg:sticky space-y-3" style={{ top: '130px' }}>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-dark-800/70 border border-white/[0.07] rounded-xl p-1 overflow-hidden"
                style={{ height: 240 }}
              >
                {mapCenter ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ width: '100%', height: '100%', borderRadius: 10 }}
                    zoomControl={true}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapRecenter center={mapCenter} />
                    {mappableActivities.map((act, i) => (
                      <Marker
                        key={act.id || i}
                        position={[act.location.lat, act.location.lng]}
                        icon={makeIcon(markerColors[act.type] || '#3B82F6')}
                      >
                        <Popup>
                          <div style={{ minWidth: 120 }}>
                            <p style={{ fontWeight: 700, marginBottom: 3, fontSize: 12 }}>{act.title}</p>
                            <p style={{ color: '#64748b', fontSize: 10 }}>{act.time} · {act.duration}</p>
                            <p style={{ color: '#10B981', fontSize: 11, fontWeight: 600 }}>{tripCurrency} {act.cost}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="w-full h-full bg-dark-900 rounded-[10px] flex flex-col items-center justify-center gap-2">
                    <MapPin className="w-8 h-8 text-primary-400 opacity-20" />
                    <p className="text-xs text-white opacity-30">Map loading…</p>
                  </div>
                )}
              </motion.div>

              {/* Legend */}
              {mapCenter && (
                <div className="flex flex-wrap items-center gap-3 px-0.5">
                  {Object.entries(markerColors).map(([type, color]) => (
                    <span key={type} className="flex items-center gap-1 text-[10px] text-dark-400">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  ))}
                </div>
              )}

              {/* Budget */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-dark-800/70 border border-white/[0.07] rounded-xl p-4"
              >
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-success-500/15 flex items-center justify-center shrink-0">
                    <Wallet className="w-3.5 h-3.5 text-success-500" />
                  </div>
                  Day {dayData.dayNumber} Budget
                </h3>
                <div className="space-y-2">
                  {Object.entries(categoryBreakdown).map(([cat, amount]) => {
                    const catInfo = categoryLabels[cat] || { label: cat, icon: Navigation };
                    const CatIcon = catInfo.icon;
                    const pct = totalCost > 0 ? (amount / totalCost) * 100 : 0;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between items-center text-[11px] sm:text-xs mb-1">
                          <span className="text-dark-400 flex items-center gap-1.5">
                            <CatIcon className="w-3 h-3 text-dark-600" /> {catInfo.label}
                          </span>
                          <span className="text-white font-semibold">{tripCurrency} {amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.55, delay: 0.35 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
                          />
                        </div>
                      </div>
                    );
                  })}
                  {/* Total row */}
                  <div className="border-t border-white/[0.06] pt-2.5 mt-1 flex justify-between items-center">
                    <span className="text-dark-300 text-xs font-medium">Total for today</span>
                    <span className="text-success-500 text-base font-bold">{tripCurrency} {totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>

              {/* AI Tip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="relative overflow-hidden border border-primary-500/15 rounded-xl p-4"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(59,130,246,0.02) 100%)' }}
              >
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-start gap-2.5 relative z-10">
                  <div className="w-6 h-6 rounded-md bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white mb-1">AI Local Tip</p>
                    <p className="text-[11px] text-dark-300 leading-relaxed">
                      Plan to arrive early at popular attractions to avoid crowds. Use local public transit for a more authentic experience and to save on your {tripCurrency} {Number(currentItinerary.budget).toLocaleString()} budget!
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

