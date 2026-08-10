import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Heart, Share2, Loader2, Globe, Search, Compass, Star, Clock, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

/* ── Destination emoji helper ── */
const getTripEmoji = (destination = '') => {
  const d = destination.toLowerCase();
  if (d.includes('pakistan') || d.includes('lahore') || d.includes('karachi') || d.includes('islamabad')) return '🇵🇰';
  if (d.includes('japan') || d.includes('tokyo') || d.includes('osaka')) return '🇯🇵';
  if (d.includes('france') || d.includes('paris')) return '🇫🇷';
  if (d.includes('dubai') || d.includes('uae') || d.includes('abu dhabi')) return '🇦🇪';
  if (d.includes('uk') || d.includes('london') || d.includes('england')) return '🇬🇧';
  if (d.includes('usa') || d.includes('new york') || d.includes('america')) return '🇺🇸';
  if (d.includes('turkey') || d.includes('istanbul')) return '🇹🇷';
  if (d.includes('italy') || d.includes('rome') || d.includes('milan')) return '🇮🇹';
  if (d.includes('spain') || d.includes('barcelona') || d.includes('madrid')) return '🇪🇸';
  if (d.includes('bali') || d.includes('indonesia')) return '🇮🇩';
  if (d.includes('thailand') || d.includes('bangkok')) return '🇹🇭';
  if (d.includes('maldives')) return '🇲🇻';
  if (d.includes('egypt') || d.includes('cairo')) return '🇪🇬';
  return '✈️';
};

/* ── Destination gradient helper ── */
const getCardGradient = (destination = '') => {
  const d = destination.toLowerCase();
  if (d.includes('paris') || d.includes('france')) return 'linear-gradient(135deg, #121A33 0%, #1B2A5E 50%, #25397F 100%)';
  if (d.includes('dubai') || d.includes('uae'))   return 'linear-gradient(135deg, #0F162E 0%, #1A274F 50%, #243463 100%)';
  if (d.includes('japan') || d.includes('tokyo')) return 'linear-gradient(135deg, #131B36 0%, #202F66 50%, #2C448C 100%)';
  if (d.includes('bali') || d.includes('indo'))   return 'linear-gradient(135deg, #101A38 0%, #1C2F63 50%, #28407F 100%)';
  if (d.includes('istanbul') || d.includes('turkey')) return 'linear-gradient(135deg, #141B33 0%, #1E2A5A 50%, #2A3A70 100%)';
  if (d.includes('london') || d.includes('uk'))   return 'linear-gradient(135deg, #0E1529 0%, #182346 50%, #222F63 100%)';
  return 'linear-gradient(135deg, #0F1117 0%, #1A1D27 50%, #242736 100%)';
};

/* ── Style tags helper ── */
const STYLE_COLORS = {
  adventure:   { bg: 'rgba(239,68,68,0.15)',  text: '#f87171' },
  cultural:    { bg: 'rgba(168,85,247,0.15)', text: '#c084fc' },
  relaxation:  { bg: 'rgba(20,184,166,0.15)', text: '#2dd4bf' },
  foodie:      { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24' },
  luxury:      { bg: 'rgba(234,179,8,0.15)',  text: '#fde047' },
  budget:      { bg: 'rgba(34,197,94,0.15)',  text: '#4ade80' },
  family:      { bg: 'rgba(79,124,255,0.15)', text: '#6F9AFF' },
  romantic:    { bg: 'rgba(236,72,153,0.15)', text: '#f472b6' },
};

/* ────────────────────── TripCard ────────────────────── */
function TripCard({ trip, index }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(trip.likes || 0);

  const emoji      = getTripEmoji(trip.destination);
  const gradient   = getCardGradient(trip.destination);
  const style      = (trip.travelStyle || 'adventure').toLowerCase();
  const styleColor = STYLE_COLORS[style] || STYLE_COLORS.adventure;
  const creator    = trip.userId?.name || 'Anonymous';
  const initial    = creator.charAt(0).toUpperCase();

  const daysCount = (() => {
    if (trip.itinerary?.length > 0) return trip.itinerary.length;
    const s = new Date(trip.startDate), e = new Date(trip.endDate);
    return Math.max(1, Math.ceil((e - s) / 86400000) + 1);
  })();

  const handleLike = (e) => {
    e.preventDefault();
    setLiked(v => !v);
    setLikeCount(n => liked ? n - 1 : n + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      style={{
        background: 'var(--color-secondary-dark)',
        border: '1px solid var(--color-border-dark)',
        borderRadius: 18,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s, border-color 0.3s',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(79,124,255,0.3)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(79,124,255,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-border-dark)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
      }}
    >
      {/* ── Card Image Area ── */}
      <div style={{
        height: 160, background: gradient,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {/* Subtle dot pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
          background: 'linear-gradient(to top, var(--color-secondary-dark), transparent)',
          zIndex: 2,
        }} />

        {/* Emoji */}
        <span style={{ fontSize: '4rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
          {emoji}
        </span>

        {/* Days badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14, zIndex: 3,
          padding: '4px 10px', borderRadius: 9999,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'white', fontSize: '0.75rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <Clock style={{ width: 11, height: 11 }} />
          {daysCount} day{daysCount !== 1 ? 's' : ''}
        </div>

        {/* Style tag */}
        <div style={{
          position: 'absolute', top: 14, right: 14, zIndex: 3,
          padding: '4px 10px', borderRadius: 9999,
          background: styleColor.bg, color: styleColor.text,
          fontSize: '0.75rem', fontWeight: 600,
          border: `1px solid ${styleColor.text}30`,
          backdropFilter: 'blur(8px)',
          textTransform: 'capitalize',
        }}>
          {style}
        </div>
      </div>

      {/* ── Card Body ── */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Title & Like */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
          <h3 style={{
            color: 'white', fontWeight: 700, fontSize: '1rem',
            lineHeight: 1.3, flex: 1,
          }}>
            {trip.destination}
          </h3>
          <button
            onClick={handleLike}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
              background: liked ? 'rgba(239,68,68,0.12)' : 'transparent',
              border: liked ? '1px solid rgba(239,68,68,0.25)' : '1px solid transparent',
              borderRadius: 9999, padding: '4px 8px',
              color: liked ? '#f87171' : 'var(--color-text-muted)',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            <Heart style={{ width: 13, height: 13, fill: liked ? '#f87171' : 'none' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{likeCount}</span>
          </button>
        </div>

        {/* Description */}
        <p style={{
          color: 'var(--color-text-secondary)', fontSize: '0.875rem',
          lineHeight: 1.55, marginBottom: 16,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          A {style} trip through {trip.destination} — crafted by AI with personalized local experiences.
        </p>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            <Users style={{ width: 12, height: 12 }} />
            {trip.travelers || 1} traveler{(trip.travelers || 1) > 1 ? 's' : ''}
          </div>
          {trip.budget && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              <span style={{ opacity: 0.5 }}>·</span>
              {trip.currency || 'USD'} {Number(trip.budget).toLocaleString()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(79,124,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: '#6F9AFF', flexShrink: 0,
            }}>
              {initial}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              by <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{creator}</span>
            </span>
          </div>
          <Link
            to={`/itinerary/${trip._id}`}
            style={{
              padding: '7px 16px', borderRadius: 8,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--color-brand-blue)';
              e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            View Trip
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────── Main Page ────────────────────── */
const FILTERS = ['All', 'Adventure', 'Cultural', 'Relaxation', 'Foodie', 'Luxury', 'Family', 'Romantic'];

export default function Community() {
  const [publicTrips, setPublicTrips] = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [search, setSearch]           = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/trips/public`);
        if (res.ok) setPublicTrips(await res.json());
      } catch (err) {
        console.error('Failed to fetch public trips:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filtered = publicTrips.filter(t => {
    const matchSearch = !search || t.destination?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || (t.travelStyle || '').toLowerCase() === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="page-transition" style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          {/* Icon badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 9999,
            background: 'rgba(79,124,255,0.1)',
            border: '1px solid rgba(79,124,255,0.2)',
            color: '#6F9AFF', fontSize: '0.875rem', fontWeight: 600,
            marginBottom: 20,
          }}>
            <Globe style={{ width: 14, height: 14 }} />
            Community Itineraries
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            color: 'white',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Travel <span style={{ color: 'var(--color-brand-blue)' }}>Community</span>
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1rem', lineHeight: 1.65,
            maxWidth: 560, margin: '0 auto 36px',
          }}>
            Explore AI-generated itineraries shared by travelers worldwide.
            Get inspired and plan your next perfect journey.
          </p>

          {/* Search bar */}
          <div style={{
            position: 'relative', maxWidth: 480, margin: '0 auto',
          }}>
            <Search style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              width: 18, height: 18, color: 'var(--color-text-muted)',
            }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="input-field"
              style={{ paddingLeft: 48, paddingTop: 14, paddingBottom: 14, fontSize: '0.9375rem' }}
            />
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            marginBottom: 36,
          }}
        >
          {[
            { icon: Globe,   label: 'Destinations', value: new Set(publicTrips.map(t => t.destination?.split(',')[0])).size || 0 },
            { icon: Plane,   label: 'Shared Trips',  value: publicTrips.length },
            { icon: Users,   label: 'Travelers',     value: publicTrips.reduce((s, t) => s + (t.travelers || 1), 0) },
            { icon: Heart,   label: 'Total Likes',   value: publicTrips.reduce((s, t) => s + (t.likes || 0), 0) },
          ].map((s, i) => (
            <div key={s.label} style={{
              background: 'var(--color-secondary-dark)',
              border: '1px solid var(--color-border-dark)',
              borderRadius: 14, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
              background: 'rgba(79,124,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <s.icon style={{ width: 18, height: 18, color: '#6F9AFF' }} />
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                  {s.label}
                </p>
                <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Style Filters ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          overflowX: 'auto', paddingBottom: 4, marginBottom: 32,
          msOverflowStyle: 'none', scrollbarWidth: 'none',
        }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '8px 18px', borderRadius: 9999,
                fontSize: '0.875rem', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                border: activeFilter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                background: activeFilter === f ? 'var(--color-brand-blue)' : 'transparent',
                color: activeFilter === f ? 'white' : 'var(--color-text-muted)',
                boxShadow: activeFilter === f ? '0 4px 12px rgba(79,124,255,0.3)' : 'none',
              }}
            >
              {f}
            </button>
          ))}
          <span style={{
            marginLeft: 'auto', flexShrink: 0,
            fontSize: '0.875rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap',
          }}>
            {filtered.length} trip{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
            <Loader2 style={{ width: 40, height: 40, color: '#6F9AFF', marginBottom: 16 }} className="animate-spin" />
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading community trips...</p>
          </div>
        )}

        {/* ── Trips Grid ── */}
        {!isLoading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}>
              {filtered.map((trip, i) => (
                <TripCard key={trip._id} trip={trip} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* ── Empty State ── */}
        {!isLoading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--color-secondary-dark)',
              border: '1px solid var(--color-border-dark)',
              borderRadius: 18,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '80px 32px', textAlign: 'center',
            }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(79,124,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24, fontSize: '2.5rem',
            }}>
              🌍
            </div>
            <h3 style={{
              fontSize: '1.5rem', fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: 'white', marginBottom: 12,
            }}>
              {search || activeFilter !== 'All' ? 'No matching trips found' : 'No public trips yet'}
            </h3>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.9375rem', lineHeight: 1.6,
              maxWidth: 380, marginBottom: 28,
            }}>
              {search || activeFilter !== 'All'
                ? 'Try adjusting your search or filter to find more trips.'
                : 'Be the first to share your AI-generated trip with the community!'}
            </p>
            <Link
              to="/plan"
              className="btn-primary"
              style={{ textDecoration: 'none', padding: '14px 32px' }}
            >
              <Compass style={{ width: 16, height: 16 }} />
              Plan & Share a Trip
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
}
