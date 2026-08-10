import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, DollarSign, Star, ChevronDown, ChevronRight, ChevronLeft,
  Share2, Download, RefreshCw, Edit3, Sparkles, Navigation,
  Coffee, Utensils, Camera, Bus, Calendar, Users, Wallet,
  Compass, Loader2, Copy, Check, Info, Sun, Moon, Sunrise,
  ArrowLeft, ExternalLink, ShieldCheck, Heart, Layers, Printer,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { useTrips } from '../contexts/TripContext';
import toast from 'react-hot-toast';

// Leaflet map
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

// Custom coloured marker factory with sleek pin styling
const makeIcon = (color = '#4F7CFF') => L.divIcon({
  className: '',
  html: `<div style="
    width:36px;height:36px;border-radius:50% 50% 50% 0;
    background:${color};border:3px solid #ffffff;
    transform:rotate(-45deg);
    box-shadow:0 6px 20px rgba(0,0,0,0.6);
    display:flex;align-items:center;justify-content:center;
  ">
    <div style="width:10px;height:10px;border-radius:50%;background:#ffffff;box-shadow:inset 0 1px 3px rgba(0,0,0,0.3)"></div>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
});

const markerColors = {
  attraction: '#3B82F6', // Blue
  food:       '#F59E0B', // Gold / Orange
  transport:  '#10B981', // Emerald
  activity:   '#8B5CF6', // Purple
};

/* ── Recenter map when activities change ── */
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);
  return null;
}

/* ── Activity icon types ── */
const typeIcons = {
  attraction: Camera,
  food:       Utensils,
  transport:  Bus,
  activity:   Navigation,
};

const periodConfig = {
  morning: {
    bg: 'rgba(245, 158, 11, 0.12)',
    text: '#F59E0B',
    border: 'rgba(245, 158, 11, 0.25)',
    icon: Sunrise,
    label: 'Morning Exploration',
    accent: '#F59E0B',
    gradient: 'linear-gradient(90deg, #F59E0B, #D97706)'
  },
  afternoon: {
    bg: 'rgba(59, 130, 246, 0.12)',
    text: '#60A5FA',
    border: 'rgba(59, 130, 246, 0.25)',
    icon: Sun,
    label: 'Afternoon Highlights',
    accent: '#3B82F6',
    gradient: 'linear-gradient(90deg, #3B82F6, #2563EB)'
  },
  evening: {
    bg: 'rgba(139, 92, 246, 0.12)',
    text: '#C084FC',
    border: 'rgba(139, 92, 246, 0.25)',
    icon: Moon,
    label: 'Evening Experience',
    accent: '#8B5CF6',
    gradient: 'linear-gradient(90deg, #8B5CF6, #7C3AED)'
  },
};

const categoryBarColors = {
  attraction: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
  food:       'linear-gradient(90deg, #F59E0B, #FBBF24)',
  transport:  'linear-gradient(90deg, #10B981, #34D399)',
  activity:   'linear-gradient(90deg, #8B5CF6, #A78BFA)',
};

/* ─────────────────── DayNavigation Component ─────────────────── */
function DayNavigation({ days, activeDay, setActiveDay }) {
  const scrollRef = useRef(null);
  const activeTabRef = useRef(null);

  // Auto-scroll selected active day tab into center view smoothly
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeDay]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 88,
        zIndex: 40,
        marginBottom: 36,
        borderRadius: 18,
        padding: '10px 16px',
        background: 'rgba(15, 17, 23, 0.94)',
        border: '1px solid var(--color-border-dark)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Left Scroll Chevron Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          style={{
            width: 38,
            height: 38,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          className="hover:!bg-blue-500/10 hover:!border-blue-500/30 hover:!text-blue-400"
          title="Scroll Left"
        >
          <ChevronLeft style={{ width: 18, height: 18 }} />
        </button>

        {/* Scroll Container with Left/Right Fading Overlays */}
        <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
          {/* Subtle Left Edge Fade Overlay */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 28,
            background: 'linear-gradient(90deg, rgba(15, 17, 23, 0.94) 0%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none'
          }} />

          {/* Horizontal Scrollable Tabs */}
          <div
            ref={scrollRef}
            className="hide-scrollbar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              padding: '4px 8px',
              width: '100%',
            }}
          >
            {days?.map((day, i) => {
              const isActive = activeDay === i;
              const actCount = day.activities?.length || 0;
              return (
                <button
                  key={i}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => setActiveDay(i)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '11px 22px',
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    border: isActive
                      ? '1px solid rgba(79, 124, 255, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isActive
                      ? 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexShrink: 0,
                    boxShadow: isActive ? '0 6px 24px rgba(79, 124, 255, 0.45)' : 'none',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  }}
                  className={!isActive ? 'hover:!bg-white/[0.07] hover:!border-white/20 hover:!text-white' : ''}
                >
                  <span style={{ letterSpacing: '-0.01em' }}>Day {i + 1}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    minWidth: 22,
                    height: 22,
                    padding: '0 7px',
                    borderRadius: 9999,
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {actCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subtle Right Edge Fade Overlay */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 28,
            background: 'linear-gradient(270deg, rgba(15, 17, 23, 0.94) 0%, transparent 100%)',
            zIndex: 10,
            pointerEvents: 'none'
          }} />
        </div>

        {/* Right Scroll Chevron Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          style={{
            width: 38,
            height: 38,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          className="hover:!bg-blue-500/10 hover:!border-blue-500/30 hover:!text-blue-400"
          title="Scroll Right"
        >
          <ChevronRight style={{ width: 18, height: 18 }} />
        </button>

        {/* Quick Action Auto-Optimize Button */}
        <div className="hidden sm:!flex" style={{ flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 14 }}>
          <button
            onClick={() => toast.success('Itinerary timeline auto-optimized!')}
            className="btn-secondary"
            style={{
              padding: '10px 18px',
              fontSize: '0.875rem',
              borderRadius: 14,
              gap: 8,
              color: 'var(--color-primary-400)',
              borderColor: 'rgba(79, 124, 255, 0.3)',
              background: 'rgba(79, 124, 255, 0.08)',
            }}
          >
            <RefreshCw style={{ width: 14, height: 14, color: 'var(--color-brand-blue)' }} />
            <span>Auto-Optimize</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── ActivityCard ─────────────────── */
function ActivityCard({ activity, index, currency }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const TypeIcon = typeIcons[activity.type] || Camera;
  const period = periodConfig[activity.period] || periodConfig.morning;
  const displayCurrency = activity.currency || currency || 'USD';

  const handleCopy = (e) => {
    e.stopPropagation();
    const textToCopy = `${activity.title} (${activity.time}) - ${activity.description || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Activity details copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      style={{ display: 'flex', gap: '24px', position: 'relative', marginBottom: '28px' }}
      className="group"
    >
      {/* Timeline connector line */}
      <div
        style={{
          position: 'absolute',
          left: '23px',
          top: '54px',
          bottom: '-28px',
          width: '2px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)',
        }}
        className="group-last:hidden"
      />

      {/* Timeline Node Icon */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10, flexShrink: 0 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 18,
            background: period.bg,
            border: `1px solid ${period.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: `0 6px 20px ${period.accent}25`,
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.3s ease',
          }}
          className="group-hover:scale-110"
        >
          <span style={{ userSelect: 'none' }}>{activity.icon || '📍'}</span>
        </div>
      </div>

      {/* Main Activity Card Container */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 18,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            background: expanded ? 'var(--color-secondary-dark)' : 'rgba(26, 29, 39, 0.75)',
            border: expanded ? '1px solid rgba(79, 124, 255, 0.4)' : '1px solid var(--color-border-dark)',
            boxShadow: expanded ? '0 14px 36px rgba(79, 124, 255, 0.18)' : '0 6px 20px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Accent top border bar when expanded */}
          {expanded && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: period.gradient,
              }}
            />
          )}

          <div style={{ padding: '24px 28px' }}>
            {/* Top row: Time badge, Rating & Category Tag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '5px 14px',
                  borderRadius: 9999,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: period.bg,
                  color: period.text,
                  border: `1px solid ${period.border}`,
                }}>
                  {activity.time}
                </span>

                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '5px 14px',
                  borderRadius: 9999,
                  border: '1px solid rgba(255,255,255,0.08)',
                  textTransform: 'capitalize',
                }}>
                  <TypeIcon style={{ width: 14, height: 14, color: 'var(--color-brand-blue)' }} />
                  {activity.type}
                </span>
              </div>

              {activity.rating && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--color-primary-400)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  padding: '5px 12px',
                  borderRadius: 9999,
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}>
                  <Star style={{ width: 14, height: 14, fill: '#F59E0B', color: '#F59E0B' }} />
                  <span>{activity.rating}</span>
                </div>
              )}
            </div>

            {/* Activity Title & Toggle */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  lineHeight: 1.35,
                  marginBottom: 14,
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.01em',
                }}>
                  {activity.title}
                </h4>

                {/* Quick Info Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    background: 'rgba(255,255,255,0.03)',
                    padding: '7px 14px',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <Clock style={{ width: 14, height: 14, color: 'var(--color-brand-blue)' }} />
                    <span>{activity.duration}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    background: 'rgba(16, 185, 129, 0.08)',
                    padding: '7px 14px',
                    borderRadius: 12,
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}>
                    <DollarSign style={{ width: 14, height: 14, color: '#10B981' }} />
                    <span style={{ color: '#10B981', fontWeight: 700 }}>{displayCurrency} {activity.cost}</span>
                  </div>
                </div>
              </div>

              {/* Expand Toggle Button */}
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                background: expanded ? 'rgba(79, 124, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                color: expanded ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)',
                border: expanded ? '1px solid rgba(79, 124, 255, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
                <ChevronDown style={{ width: 18, height: 18 }} />
              </div>
            </div>

            {/* Expanded Content Drawer */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Description Box */}
                    {activity.description && (
                      <div style={{
                        background: 'rgba(79, 124, 255, 0.05)',
                        border: '1px solid rgba(79, 124, 255, 0.18)',
                        borderRadius: 14,
                        padding: '16px 18px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 14,
                      }}>
                        <Sparkles style={{ width: 16, height: 16, color: 'var(--color-brand-blue)', flexShrink: 0, marginTop: 2 }} />
                        <p style={{ color: 'var(--color-dark-200)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                          {activity.description}
                        </p>
                      </div>
                    )}

                    {/* Action Bar inside Card */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', paddingTop: 4 }}>
                      {activity.location?.lat && activity.location?.lng ? (
                        <a
                          href={`https://maps.google.com/?q=${activity.location.lat},${activity.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="btn-secondary"
                          style={{
                            padding: '10px 18px',
                            fontSize: '0.875rem',
                            borderRadius: 12,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            borderColor: 'rgba(79, 124, 255, 0.3)',
                            color: 'var(--color-primary-400)',
                            background: 'rgba(79, 124, 255, 0.1)',
                          }}
                        >
                          <Navigation style={{ width: 14, height: 14, color: 'var(--color-brand-blue)' }} />
                          <span>Google Maps Directions</span>
                          <ExternalLink style={{ width: 12, height: 12, opacity: 0.7 }} />
                        </a>
                      ) : null}

                      <button
                        onClick={handleCopy}
                        className="btn-secondary"
                        style={{
                          padding: '10px 18px',
                          fontSize: '0.875rem',
                          borderRadius: 12,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        {copied ? <Check style={{ width: 14, height: 14, color: '#10B981' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                        <span>{copied ? 'Copied!' : 'Copy Info'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────── PDF Export ─────────────────── */
async function exportPDF(itinerary) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  let y = 20;
  const margin = 20;
  const contentW = W - margin * 2;

  const checkPage = (needed = 15) => {
    if (y + needed > 280) { doc.addPage(); y = 20; }
  };

  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, W, 50, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(itinerary.destination, margin, 28);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('AI-Generated Travel Itinerary — TripPlanner AI', margin, 38);
  y = 60;

  doc.setFillColor(26, 29, 39);
  doc.roundedRect(margin, y, contentW, 28, 3, 3, 'F');
  doc.setFontSize(9);
  const summaryItems = [
    ['Duration',   `${itinerary.days?.length || 0} Days`],
    ['Travelers',  `${itinerary.travelers || 1}`],
    ['Budget',     `${itinerary.currency || 'USD'} ${Number(itinerary.budget || 0).toLocaleString()}`],
    ['Style',      itinerary.travelStyle || 'Adventure'],
  ];
  summaryItems.forEach(([label, val], i) => {
    const x = margin + 8 + i * (contentW / 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(label.toUpperCase(), x, y + 10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(val, x, y + 20);
  });
  y += 38;

  itinerary.days?.forEach((day) => {
    checkPage(25);
    doc.setFillColor(79, 124, 255);
    doc.roundedRect(margin, y, contentW, 12, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`Day ${day.dayNumber}: ${day.title}`, margin + 5, y + 8.5);
    y += 18;

    day.activities?.forEach((act) => {
      checkPage(22);
      doc.setFillColor(30, 33, 45);
      doc.roundedRect(margin, y, contentW, 18, 2, 2, 'F');
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

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129);
      doc.text(`${itinerary.currency || 'USD'} ${act.cost}`, W - margin - 5, y + 10, { align: 'right' });
      y += 22;
      checkPage(5);
    });

    const dayTotal = day.activities?.reduce((s, a) => s + (a.cost || 0), 0) || 0;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Day Total: ${itinerary.currency || 'USD'} ${dayTotal.toLocaleString()}`, W - margin, y - 5, { align: 'right' });
    y += 10;
  });

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
    try {
      await navigator.share({ title: `Trip to ${destination}`, text, url });
      return;
    } catch {
      return;
    }
  }
  await navigator.clipboard.writeText(url);
  toast.success('Link copied to clipboard!', { icon: '🔗' });
}

/* ─────────────────── Main Itinerary Page Component ─────────────────── */
export default function Itinerary() {
  const { id } = useParams();
  const { currentItinerary, fetchTripById } = useTrips();
  const [activeDay, setActiveDay] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const loadTrip = async () => {
      if (currentItinerary && currentItinerary.id === id) return;
      if (!id || id.startsWith('trip-')) return;
      setIsLoading(true);
      setError(null);
      try {
        await fetchTripById(id);
      } catch (err) {
        setError(err.message || 'Failed to load trip');
      } finally {
        setIsLoading(false);
      }
    };
    loadTrip();
  }, [id, currentItinerary, fetchTripById]);

  const handleExportPDF = async () => {
    if (!currentItinerary) return;
    setExporting(true);
    try {
      await exportPDF(currentItinerary);
      toast.success('PDF exported successfully!', { icon: '📄' });
    } catch (e) {
      toast.error('Export failed. Please try again.');
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) return (
    <div style={{ minHeight: '100vh', paddingTop: '112px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-dark-950)' }}>
      <div className="glass-card" style={{ textAlign: 'center', maxWidth: 380, padding: 40 }}>
        <Loader2 style={{ width: 44, height: 44, color: 'var(--color-brand-blue)', margin: '0 auto 16px' }} className="animate-spin" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>Curating Itinerary...</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Fetching your personalized travel plan</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', paddingTop: '112px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-dark-950)' }}>
      <div className="glass-card" style={{ textAlign: 'center', maxWidth: 380, padding: 40 }}>
        <Compass style={{ width: 44, height: 44, color: 'var(--color-error)', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>Error Loading Trip</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>{error}</p>
        <Link to="/dashboard" className="btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: 12 }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );

  if (!currentItinerary) return (
    <div style={{ minHeight: '100vh', paddingTop: '112px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-dark-950)' }}>
      <div className="glass-card" style={{ textAlign: 'center', maxWidth: 380, padding: 40 }}>
        <Compass style={{ width: 44, height: 44, color: 'var(--color-text-muted)', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>No Itinerary Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>We couldn't locate the requested trip details.</p>
        <Link to="/plan" className="btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: 12 }}>
          <Sparkles style={{ width: 16, height: 16 }} /> Create New Trip
        </Link>
      </div>
    </div>
  );

  const dayData = currentItinerary.days ? currentItinerary.days[activeDay] : null;
  if (!dayData) return null;

  const tripCurrency = currentItinerary.currency || 'USD';
  const totalCost = dayData.activities ? dayData.activities.reduce((s, a) => s + (a.cost || 0), 0) : 0;
  const grandTotalCost = currentItinerary.days
    ? currentItinerary.days.reduce((total, d) => total + (d.activities ? d.activities.reduce((s, a) => s + (a.cost || 0), 0) : 0), 0)
    : 0;

  const totalActivitiesCount = currentItinerary.days
    ? currentItinerary.days.reduce((s, d) => s + (d.activities?.length || 0), 0)
    : 0;

  const categoryBreakdown = dayData.activities ? dayData.activities.reduce((acc, a) => {
    const cat = a.type || 'activity';
    acc[cat] = (acc[cat] || 0) + (a.cost || 0);
    return acc;
  }, {}) : {};

  const categoryLabels = {
    attraction: { label: 'Attractions', icon: Camera },
    food:       { label: 'Food & Dining', icon: Utensils },
    transport:  { label: 'Transport',     icon: Bus },
    activity:   { label: 'Activities',    icon: Navigation },
  };

  // Map activities
  const mappableActivities = dayData.activities
    ? dayData.activities.filter(a => a.location?.lat && a.location?.lng)
    : [];

  const mapCenter = mappableActivities.length > 0
    ? [mappableActivities[0].location.lat, mappableActivities[0].location.lng]
    : null;

  return (
    <div className="page-transition" style={{ minHeight: '100vh', background: 'var(--color-dark-950)', color: 'var(--color-text-primary)', paddingTop: '108px', paddingBottom: '104px' }}>
      <div className="container-custom" style={{ maxWidth: 1360 }}>

        {/* ── Breadcrumb Navigation ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 28 }}>
          <Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-primary-400">
            Home
          </Link>
          <ChevronRight style={{ width: 14, height: 14, color: 'var(--color-dark-500)' }} />
          <Link to="/dashboard" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-blue-400">
            Dashboard
          </Link>
          <ChevronRight style={{ width: 14, height: 14, color: 'var(--color-dark-500)' }} />
          <span style={{ color: 'white', fontWeight: 600 }}>{currentItinerary.destination}</span>
        </div>

        {/* ── Luxury Hero Banner Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 36,
            background: 'var(--color-secondary-dark)',
            border: '1px solid var(--color-border-dark)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          }}
        >
          {/* Ambient Glow Orbs */}
          <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: 'rgba(79, 124, 255, 0.14)', filter: 'blur(110px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -120, left: -120, width: 440, height: 440, borderRadius: '50%', background: 'rgba(79, 124, 255, 0.09)', filter: 'blur(110px)', pointerEvents: 'none' }} />

          {/* Banner Inner Layout */}
          <div style={{ position: 'relative', zIndex: 10, padding: '40px 48px' }} className="sm:!p-10 lg:!p-12">
            {/* Top Badge & Header Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                borderRadius: 9999,
                background: 'rgba(79, 124, 255, 0.12)',
                border: '1px solid rgba(79, 124, 255, 0.25)',
                color: 'var(--color-primary-400)',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                <Sparkles style={{ width: 15, height: 15, color: 'var(--color-brand-blue)' }} />
                <span>AI Curated Travel Plan</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button
                  onClick={() => shareTrip(currentItinerary.destination, id)}
                  className="btn-secondary"
                  style={{ borderRadius: 14, padding: '11px 20px', fontSize: '0.875rem' }}
                >
                  <Share2 style={{ width: 16, height: 16 }} />
                  <span>Share</span>
                </button>

                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="btn-primary"
                  style={{ borderRadius: 14, padding: '11px 24px', fontSize: '0.875rem', opacity: exporting ? 0.7 : 1 }}
                >
                  {exporting ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download style={{ width: 16, height: 16 }} />
                      <span>Export PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Destination Title & Subtitle */}
            <div style={{ maxWidth: 880 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16, flexWrap: 'wrap' }}>
                {currentItinerary.emoji && (
                  <span style={{ fontSize: '2.75rem', lineHeight: 1 }}>{currentItinerary.emoji}</span>
                )}
                <h1 style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: 'white',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.12,
                }}>
                  {currentItinerary.destination}
                </h1>
              </div>

              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '1.125rem',
                lineHeight: 1.7,
                maxWidth: 720,
                marginBottom: 32,
              }}>
                {currentItinerary.summary || `A masterfully designed ${currentItinerary.days?.length || 0}-day itinerary tailored for your travel style and budget.`}
              </p>

              {/* Tag Pill Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, fontSize: '0.875rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-dark-200)' }}>
                  <Calendar style={{ width: 16, height: 16, color: 'var(--color-brand-blue)' }} />
                  <span>{currentItinerary.days?.length || 0} Days Trip</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-dark-200)' }}>
                  <Users style={{ width: 16, height: 16, color: 'var(--color-primary-400)' }} />
                  <span>{currentItinerary.travelers || 1} {currentItinerary.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-dark-200)' }}>
                  <Wallet style={{ width: 16, height: 16, color: 'var(--color-primary-400)' }} />
                  <span>{tripCurrency} {Number(currentItinerary.budget || 0).toLocaleString()} Budget</span>
                </div>

                {currentItinerary.travelStyle && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-dark-200)', textTransform: 'capitalize' }}>
                    <Layers style={{ width: 16, height: 16, color: 'var(--color-primary-400)' }} />
                    <span>{currentItinerary.travelStyle} Style</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Summary Stats Grid Bar ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 36 }}>
          {[
            {
              icon: Calendar,
              label: 'TOTAL DURATION',
              value: `${currentItinerary.days?.length || 0} Days`,
              subtext: 'Complete Itinerary',
              color: '#7DA3FF',
              bg: 'rgba(79, 124, 255, 0.12)',
              border: 'rgba(79, 124, 255, 0.2)',
              accent: '#4F7CFF'
            },
            {
              icon: Compass,
              label: 'ACTIVITIES PLANNED',
              value: `${totalActivitiesCount} Places`,
              subtext: 'Curated Landmarks',
              color: '#FBBF24',
              bg: 'rgba(245, 158, 11, 0.12)',
              border: 'rgba(245, 158, 11, 0.2)',
              accent: '#F59E0B'
            },
            {
              icon: Users,
              label: 'TRAVEL PARTY',
              value: `${currentItinerary.travelers || 1} ${currentItinerary.travelers === 1 ? 'Person' : 'People'}`,
              subtext: 'Group Size',
              color: '#C084FC',
              bg: 'rgba(139, 92, 246, 0.12)',
              border: 'rgba(139, 92, 246, 0.2)',
              accent: '#8B5CF6'
            },
            {
              icon: Wallet,
              label: 'ESTIMATED SPEND',
              value: `${tripCurrency} ${grandTotalCost.toLocaleString()}`,
              subtext: `Target: ${tripCurrency} ${Number(currentItinerary.budget || 0).toLocaleString()}`,
              color: '#34D399',
              bg: 'rgba(16, 185, 129, 0.12)',
              border: 'rgba(16, 185, 129, 0.2)',
              accent: '#10B981'
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                background: 'var(--color-secondary-dark)',
                border: '1px solid var(--color-border-dark)',
                borderRadius: 18,
                padding: '24px 26px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${stat.accent}, transparent)`,
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {stat.label}
                </span>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: stat.bg, border: `1px solid ${stat.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon style={{ width: 18, height: 18, color: stat.color }} />
                </div>
              </div>
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                {stat.subtext}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Sticky Day Navigation Bar ── */}
        <DayNavigation
          days={currentItinerary.days}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
        />

        {/* ── Main 2-Column Responsive Grid (7 Columns Content / 5 Columns Sidebar) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 36, alignItems: 'start' }} className="itinerary-grid-container">

          {/* Left Column: Day Timeline (7 Columns) */}
          <div className="lg:!col-span-7 min-w-0" style={{ gridColumn: 'span 12' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Day Section Title Header */}
                <div style={{
                  background: 'var(--color-secondary-dark)',
                  border: '1px solid var(--color-border-dark)',
                  borderRadius: 18,
                  padding: '28px 32px',
                  marginBottom: 36,
                  boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '5px 14px',
                          borderRadius: 9999,
                          background: 'rgba(79, 124, 255, 0.12)',
                          color: 'var(--color-primary-400)',
                          border: '1px solid rgba(79, 124, 255, 0.25)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}>
                          Day {dayData.dayNumber} Overview
                        </span>
                        {dayData.date && (
                          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.04)', padding: '5px 14px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.08)' }}>
                            {dayData.date}
                          </span>
                        )}
                      </div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                        {dayData.title}
                      </h2>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>Day Total</div>
                      <div style={{ color: '#10B981', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                        {tripCurrency} {totalCost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Groups by Period (Morning, Afternoon, Evening) */}
                {['morning', 'afternoon', 'evening'].map(periodKey => {
                  const activitiesInPeriod = dayData.activities
                    ? dayData.activities.filter(a => a.period === periodKey)
                    : [];

                  if (!activitiesInPeriod.length) return null;
                  const period = periodConfig[periodKey];
                  const PeriodIcon = period.icon;

                  return (
                    <div key={periodKey} style={{ marginBottom: 40 }}>
                      {/* Period Header Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '7px 18px',
                          borderRadius: 9999,
                          background: period.bg,
                          color: period.text,
                          border: `1px solid ${period.border}`,
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}>
                          <PeriodIcon style={{ width: 15, height: 15 }} />
                          <span>{period.label}</span>
                        </div>
                        <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
                      </div>

                      {/* Stack of Activity Cards */}
                      <div>
                        {activitiesInPeriod.map((act, idx) => (
                          <ActivityCard
                            key={act.id || idx}
                            activity={act}
                            index={idx}
                            currency={tripCurrency}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Interactive Sidebar (5 Columns) */}
          <div className="lg:!col-span-5 space-y-7" style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* 1. Interactive Leaflet Map Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                background: 'var(--color-secondary-dark)',
                border: '1px solid var(--color-border-dark)',
                borderRadius: 24,
                padding: '14px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '14px 18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MapPin style={{ width: 18, height: 18, color: 'var(--color-brand-blue)' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>Interactive Map</h3>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  {mappableActivities.length} Pinned Spots
                </span>
              </div>

              {/* Map Canvas with Dark Voyager Tiles */}
              <div style={{ height: 320, width: '100%', borderRadius: 18, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.06)' }}>
                {mapCenter ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ width: '100%', height: '100%' }}
                    zoomControl={true}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <MapRecenter center={mapCenter} />
                    {mappableActivities.map((act, i) => (
                      <Marker
                        key={act.id || i}
                        position={[act.location.lat, act.location.lng]}
                        icon={makeIcon(markerColors[act.type] || '#4F7CFF')}
                      >
                        <Popup>
                          <div style={{ padding: 6, minWidth: 160 }}>
                            <p style={{ fontWeight: 700, color: '#0F1117', fontSize: '0.875rem', marginBottom: 4, margin: 0 }}>{act.title}</p>
                            <p style={{ color: '#475569', fontSize: '0.875rem', margin: '3px 0' }}>{act.time} • {act.duration}</p>
                            <p style={{ color: '#10B981', fontWeight: 700, fontSize: '0.875rem', margin: '6px 0 0' }}>
                              {tripCurrency} {act.cost}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--color-dark-900)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 28, textAlign: 'center' }}>
                    <Compass style={{ width: 40, height: 40, color: 'rgba(79, 124, 255, 0.4)' }} />
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Map coordinates loading...</p>
                  </div>
                )}
              </div>

              {/* Marker Legend */}
              <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 14, marginTop: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {Object.entries(markerColors).map(([type, color]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'capitalize', fontWeight: 600 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 2. Day Budget Category Breakdown Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                background: 'var(--color-secondary-dark)',
                border: '1px solid var(--color-border-dark)',
                borderRadius: 24,
                padding: '28px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                    <Wallet style={{ width: 20, height: 20 }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>Day {dayData.dayNumber} Budget</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Category breakdown</p>
                  </div>
                </div>

                <span style={{ color: '#10B981', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  {tripCurrency} {totalCost.toLocaleString()}
                </span>
              </div>

              {/* Category Progress Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {Object.entries(categoryBreakdown).map(([cat, amount], catIndex) => {
                  const catInfo = categoryLabels[cat] || { label: cat, icon: Navigation };
                  const CatIcon = catInfo.icon;
                  const pct = totalCost > 0 ? Math.round((amount / totalCost) * 100) : 0;
                  const barGradient = categoryBarColors[cat] || 'linear-gradient(90deg, #3B82F6, #60A5FA)';

                  return (
                    <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-dark-200)', fontWeight: 600, textTransform: 'capitalize' }}>
                          <CatIcon style={{ width: 15, height: 15, color: 'var(--color-text-secondary)' }} />
                          <span>{catInfo.label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{pct}%</span>
                          <span style={{ color: 'white' }}>{tripCurrency} {amount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Bar track */}
                      <div style={{ width: '100%', height: 9, background: 'rgba(255,255,255,0.06)', borderRadius: 9999, overflow: 'hidden', padding: 1 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + catIndex * 0.1 }}
                          style={{ height: '100%', borderRadius: 9999, background: barGradient }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Summary Footer */}
              <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--color-border-dark)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Day Spending Status</span>
                <span>
                  {totalCost <= Number(currentItinerary.budget || 0) ? (
                    <span style={{ color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldCheck style={{ width: 16, height: 16 }} /> Within Planned Budget
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-primary-400)', fontWeight: 700 }}>
                      Above Average
                    </span>
                  )}
                </span>
              </div>
            </motion.div>

            {/* 3. AI Travel Concierge & Local Tip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 24,
                padding: '28px',
                border: '1px solid rgba(79, 124, 255, 0.3)',
                background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.4) 0%, var(--color-secondary-dark) 60%, rgba(45, 63, 135, 0.25) 100%)',
                boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
              }}
            >
              <div style={{ position: 'absolute', top: -50, right: -50, width: 140, height: 140, background: 'rgba(79, 124, 255, 0.15)', borderRadius: '50%', filter: 'blur(35px)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative', zIndex: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(79, 124, 255, 0.2)', border: '1px solid rgba(79, 124, 255, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--color-primary-400)', boxShadow: '0 0 20px rgba(79, 124, 255, 0.25)' }}>
                  <Sparkles style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: 8, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    AI Travel Recommendation
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-dark-200)', lineHeight: 1.65 }}>
                    Optimize your travel flow by arriving at top attractions during early morning hours. Utilizing public transit saves up to 40% on transportation costs in {currentItinerary.destination}!
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
