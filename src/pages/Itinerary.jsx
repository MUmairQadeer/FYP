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
      className="flex gap-4 relative"
    >
      <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-white/[0.06]" />
      <div className="flex flex-col items-center relative z-10 shrink-0">
        <div className={`w-10 h-10 rounded-xl ${pColor.bg} flex items-center justify-center shadow-lg`}>
          <span className="text-lg">{activity.icon}</span>
        </div>
      </div>
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
                    <Star className="w-3 h-3 fill-warning-500" />{activity.rating}
                  </span>
                )}
              </div>
              <h4 className="text-white font-semibold text-lg mb-2">{activity.title}</h4>
              <div className="flex flex-wrap items-center gap-3 text-xs text-dark-400 font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{activity.duration}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" />{displayCurrency} {activity.cost}</span>
                <span className="flex items-center gap-1.5 capitalize"><TypeIcon className="w-3.5 h-3.5" />{activity.type}</span>
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
                    <a
                      href={`https://maps.google.com/?q=${activity.location?.lat},${activity.location?.lng}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn-secondary !py-2 !px-4 !text-xs no-underline"
                    >
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
    <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
      <div className="container-custom mx-auto max-w-6xl">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8"
        >
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
              <button
                onClick={() => shareTrip(currentItinerary.destination, id)}
                className="btn-secondary !py-2 !px-4 !bg-white/5 !border-white/10 hover:!bg-white/10"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="btn-primary !py-2 !px-4"
                style={{ opacity: exporting ? 0.7 : 1, cursor: exporting ? 'not-allowed' : 'pointer' }}
              >
                {exporting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporting…</>
                  : <><Download className="w-4 h-4" /> Export PDF</>}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Calendar, label: 'Duration',   value: `${currentItinerary.days.length} Days`,            color: 'text-primary-400',  bg: 'bg-primary-500/10' },
            { icon: MapPin,   label: 'Activities', value: `${currentItinerary.days.reduce((s,d) => s + d.activities.length, 0)} planned`, color: 'text-success-500',  bg: 'bg-success-500/10' },
            { icon: Users,    label: 'Travelers',  value: `${currentItinerary.travelers} ${currentItinerary.travelers === 1 ? 'person' : 'people'}`, color: 'text-warning-500', bg: 'bg-warning-500/10' },
            { icon: Wallet,   label: 'Est. Budget', value: `${tripCurrency} ${Number(currentItinerary.budget).toLocaleString()}`,           color: 'text-accent-400',   bg: 'bg-accent-500/10' },
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

        {/* ── Day Selector ── */}
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

        {/* ── 60/40 Layout ── */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left: Activities Timeline */}
          <div className="flex-1 w-full lg:w-[60%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
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

                {['morning', 'afternoon', 'evening'].map(period => {
                  const acts = dayData.activities.filter(a => a.period === period);
                  if (acts.length === 0) return null;
                  const pColor = periodColors[period];
                  const PeriodIcon = pColor.icon;
                  return (
                    <div key={period} className="mb-10 relative">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 ${pColor.bg} ${pColor.text} text-xs font-bold uppercase tracking-wider shadow-sm`}>
                        <PeriodIcon className="w-3.5 h-3.5" />{period}
                      </div>
                      <div className="space-y-2">
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

          {/* Right: Map + Budget */}
          <div className="w-full lg:w-[40%] hidden lg:block">
            <div className="sticky top-40 space-y-6">

              {/* ── Real Leaflet Map ── */}
              <div className="glass-card !p-1 overflow-hidden rounded-3xl" style={{ height: 320 }}>
                {mapCenter ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ width: '100%', height: '100%', borderRadius: 18 }}
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
                          <div style={{ minWidth: 160 }}>
                            <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>{act.title}</p>
                            <p style={{ color: '#64748b', fontSize: 11 }}>{act.time} · {act.duration}</p>
                            <p style={{ color: '#10B981', fontSize: 11, fontWeight: 600 }}>{tripCurrency} {act.cost}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  /* Fallback when no coords */
                  <div className="w-full h-full bg-dark-800 rounded-[18px] flex flex-col items-center justify-center border border-white/[0.04] gap-3">
                    <MapPin className="w-10 h-10 text-primary-400 opacity-40" />
                    <p className="text-sm font-medium text-white opacity-50">Map data loading…</p>
                    <p className="text-xs text-dark-400">Locations appear after AI generates the trip</p>
                  </div>
                )}
              </div>

              {/* Map legend */}
              {mapCenter && (
                <div className="flex flex-wrap gap-2 px-1">
                  {Object.entries(markerColors).map(([type, color]) => (
                    <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#94A3B8' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  ))}
                </div>
              )}

              {/* Budget Breakdown */}
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

              {/* AI Tip */}
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
