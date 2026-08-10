import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Plus, MapPin, Calendar, Users, Wallet, Plane, ChevronRight,
  Clock, Globe, Sparkles, LayoutDashboard, Share2, Compass, Layers, ArrowRight, CheckCircle2
} from 'lucide-react';
import { useTrips } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';

/* ===== Animated Counter Component ===== */
function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || typeof value !== 'number') return;
    let start = 0;
    const end = value;
    if (end === 0) { setCount(0); return; }
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / end), 25);
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime));
      if (start >= end) { start = end; clearInterval(timer); }
      setCount(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const statusColors = {
  upcoming: { bg: 'rgba(79, 124, 255, 0.12)', text: '#6F9AFF', border: 'rgba(79, 124, 255, 0.25)', label: 'Upcoming' },
  ongoing:  { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', border: 'rgba(16, 185, 129, 0.25)', label: 'Ongoing' },
  completed:{ bg: 'rgba(148, 163, 184, 0.12)', text: '#94A3B8', border: 'rgba(148, 163, 184, 0.25)', label: 'Completed' },
};

/* ===== Luxury Trip Card Component ===== */
function TripCard({ trip, index }) {
  const sc = statusColors[trip.status] || statusColors.upcoming;
  const daysCount = trip.daysCount || trip.days?.length || 0;
  const activitiesCount = trip.activities || (trip.days ? trip.days.reduce((s, d) => s + (d.activities?.length || 0), 0) : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      style={{
        background: 'var(--color-secondary-dark)',
        border: '1px solid var(--color-border-dark)',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      className="group hover:!border-primary-500/40 hover:!shadow-[0_16px_36px_rgba(79,124,255,0.18)] transition-all duration-300"
    >
      {/* Top Gradient Accent Bar */}
      <div style={{
        height: 4,
        background: 'linear-gradient(90deg, var(--color-primary-400) 0%, var(--color-primary-600) 100%)',
        flexShrink: 0,
      }} />

      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header Row: Emoji Flag, Title, Status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              {trip.emoji || '✈️'}
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                color: 'white',
                fontWeight: 700,
                fontSize: '1.125rem',
                fontFamily: 'var(--font-heading)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: 3,
                letterSpacing: '-0.01em',
              }}>
                {trip.destination}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500 }} className="truncate">
                {trip.country || 'International Destination'}
              </p>
            </div>
          </div>

          <span style={{
            padding: '5px 12px',
            borderRadius: 9999,
            fontSize: '0.75rem',
            fontWeight: 700,
            background: sc.bg,
            color: sc.text,
            border: `1px solid ${sc.border}`,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {sc.label}
          </span>
        </div>

        {/* Metadata Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px 18px',
          marginBottom: 24,
          padding: '14px 16px',
          background: 'rgba(255,255,255,0.025)',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar style={{ width: 14, height: 14, color: 'var(--color-brand-blue)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
              {trip.startDate || 'Flex Dates'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock style={{ width: 14, height: 14, color: 'var(--color-primary-400)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
              {daysCount} day{daysCount !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users style={{ width: 14, height: 14, color: 'var(--color-primary-400)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
              {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wallet style={{ width: 14, height: 14, color: 'var(--color-primary-400)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {trip.currency || 'USD'} {Number(trip.budget || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card Footer Link */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: 'auto',
        }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
            {activitiesCount} planned activities
          </span>

          <Link
            to={`/itinerary/${trip.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--color-brand-blue)',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            className="group-hover:translate-x-1"
          >
            <span>Explore</span>
            <ChevronRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

const FILTERS = [
  { key: 'all', label: 'All Trips' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
];

export default function Dashboard() {
  const { trips, fetchUserTrips, isLoadingTrips } = useTrips();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) fetchUserTrips();
  }, [user, fetchUserTrips]);

  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter);

  const uniqueCountries = new Set(trips.map(t => t.country).filter(Boolean));
  const totalDaysPlanned = trips.reduce((sum, t) => sum + (t.daysCount || t.days?.length || 0), 0);
  const sharedTrips = trips.filter(t => t.isPublic).length;

  const stats = [
    {
      icon: Globe,
      label: 'COUNTRIES VISITED',
      value: uniqueCountries.size,
      color: '#93B3FF',
      bg: 'rgba(79, 124, 255, 0.12)',
      border: 'rgba(79, 124, 255, 0.25)',
      accent: '#4F7CFF',
    },
    {
      icon: Plane,
      label: 'TOTAL TRIPS',
      value: trips.length,
      color: '#6F9AFF',
      bg: 'rgba(79, 124, 255, 0.12)',
      border: 'rgba(79, 124, 255, 0.25)',
      accent: '#4F7CFF',
    },
    {
      icon: Calendar,
      label: 'DAYS PLANNED',
      value: totalDaysPlanned,
      color: '#4F7CFF',
      bg: 'rgba(79, 124, 255, 0.12)',
      border: 'rgba(79, 124, 255, 0.25)',
      accent: '#4F7CFF',
    },
    {
      icon: Users,
      label: 'TRIPS SHARED',
      value: sharedTrips,
      color: '#2E5CFF',
      bg: 'rgba(79, 124, 255, 0.12)',
      border: 'rgba(79, 124, 255, 0.25)',
      accent: '#4F7CFF',
    },
  ];

  return (
    <div
      className="page-transition"
      style={{ minHeight: '100vh', background: 'var(--color-dark-950)', color: 'var(--color-text-primary)', paddingTop: '108px', paddingBottom: '104px' }}
    >
      <div className="container-custom" style={{ maxWidth: 1360 }}>

        {/* ── Hero Welcome Banner Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 36,
            background: 'var(--color-secondary-dark)',
            border: '1px solid var(--color-border-dark)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            padding: '36px 44px',
          }}
        >
          {/* Ambient Glow Backdrop Orbs */}
          <div style={{ position: 'absolute', top: -100, right: -100, width: 450, height: 450, borderRadius: '50%', background: 'rgba(79, 124, 255, 0.12)', filter: 'blur(100px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(79, 124, 255, 0.08)', filter: 'blur(100px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  background: 'rgba(79, 124, 255, 0.15)',
                  border: '1px solid rgba(79, 124, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-brand-blue)',
                  boxShadow: '0 0 20px rgba(79, 124, 255, 0.2)',
                }}>
                  <LayoutDashboard style={{ width: 20, height: 20 }} />
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--color-dark-200)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Personal Dashboard
                </div>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: 'white',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <span>Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}</span>
              </h1>

              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', maxWidth: 620, lineHeight: 1.6 }}>
                Here is an overview of your curated AI travel itineraries, upcoming adventures, and saved destinations.
              </p>
            </div>

            <Link
              to="/plan"
              className="btn-primary"
              style={{
                textDecoration: 'none',
                flexShrink: 0,
                padding: '14px 28px',
                borderRadius: 14,
                fontSize: '0.9375rem',
                boxShadow: '0 6px 20px rgba(79, 124, 255, 0.35)',
              }}
            >
              <Plus style={{ width: 18, height: 18 }} />
              <span>Plan New Trip</span>
            </Link>
          </div>
        </motion.div>

        {/* ── Metric Stats Cards Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          marginBottom: 36,
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              style={{
                background: 'var(--color-secondary-dark)',
                border: '1px solid var(--color-border-dark)',
                borderRadius: 18,
                padding: '24px 26px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                transition: 'border-color 0.3s ease',
              }}
              className="hover:!border-white/20"
            >
              {/* Top Accent Gradient Line */}
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
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: stat.bg,
                  border: `1px solid ${stat.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 0 16px ${stat.accent}20`,
                }}>
                  <stat.icon style={{ width: 20, height: 20, color: stat.color }} />
                </div>
              </div>

              <div style={{ color: 'white', fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                <AnimatedCounter value={stat.value} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Filter Tabs & Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 28,
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            overflowX: 'auto',
            padding: '4px',
            background: 'rgba(15, 17, 23, 0.8)',
            border: '1px solid var(--color-border-dark)',
            borderRadius: 18,
            backdropFilter: 'blur(16px)',
          }} className="hide-scrollbar">
            {FILTERS.map(f => {
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    position: 'relative',
                    padding: '9px 20px',
                    borderRadius: 12,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s ease',
                    border: 'none',
                    background: 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    zIndex: 1,
                  }}
                  className={!isActive ? 'hover:!text-white' : ''}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dashboard-filter"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
                        borderRadius: 12,
                        boxShadow: '0 4px 16px rgba(79, 124, 255, 0.4)',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Trip Count Pill */}
          <div style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '8px 16px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            Showing <strong style={{ color: 'white' }}>{filtered.length}</strong> trip{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ── Loading Spinner State ── */}
        {isLoadingTrips && trips.length === 0 && (
          <div style={{
            background: 'var(--color-secondary-dark)',
            border: '1px solid var(--color-border-dark)',
            borderRadius: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '90px 24px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              width: 54,
              height: 54,
              border: '4px solid rgba(79,124,255,0.15)',
              borderTopColor: 'var(--color-brand-blue)',
              borderRadius: '50%',
              marginBottom: 20,
            }} className="animate-spin" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: 6, fontFamily: 'var(--font-heading)' }}>Loading your itineraries...</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Gathering destination coordinates and activity schedules</p>
          </div>
        )}

        {/* ── Trips Cards Grid ── */}
        {!isLoadingTrips && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 28,
          }}>
            {filtered.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}

            {/* "+ Plan New Trip" Interactive Glass Card */}
            <Link
              to="/plan"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 250,
                background: 'rgba(255,255,255,0.015)',
                border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: 18,
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                padding: '32px',
              }}
              className="group hover:!border-primary-500/50 hover:!bg-primary-500/[0.04] hover:!shadow-[0_12px_32px_rgba(79,124,255,0.15)]"
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  background: 'rgba(79, 124, 255, 0.1)',
                  border: '1px solid rgba(79, 124, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--color-brand-blue)',
                  transition: 'transform 0.3s ease',
                }} className="group-hover:scale-110">
                  <Plus style={{ width: 26, height: 26 }} />
                </div>
                <p style={{ color: 'white', fontSize: '1.125rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: 6 }}>
                  Plan New Trip
                </p>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', maxWidth: 220 }}>
                  Generate an AI travel plan for any destination in seconds
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* ── Empty State ── */}
        {!isLoadingTrips && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'var(--color-secondary-dark)',
              border: '1px solid var(--color-border-dark)',
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '90px 32px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              background: 'rgba(79, 124, 255, 0.12)',
              border: '1px solid rgba(79, 124, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              color: 'var(--color-brand-blue)',
              boxShadow: '0 0 30px rgba(79, 124, 255, 0.2)',
            }}>
              <Compass style={{ width: 40, height: 40 }} />
            </div>

            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: 'white',
              marginBottom: 12,
              letterSpacing: '-0.01em',
            }}>
              {filter === 'all' ? 'No trips planned yet' : `No ${filter} trips`}
            </h3>

            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              maxWidth: 420,
              marginBottom: 32,
            }}>
              {filter === 'all'
                ? 'Ready for your next adventure? Let AI generate the perfect itinerary for you in seconds.'
                : `You don't have any ${filter} trips. Start planning your next journey!`}
            </p>

            <Link
              to="/plan"
              className="btn-primary"
              style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '0.9375rem', borderRadius: 14 }}
            >
              <Sparkles style={{ width: 18, height: 18 }} />
              <span>Start Planning</span>
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
}
