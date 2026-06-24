import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, MapPin, Calendar, Users, Wallet, Plane, ChevronRight,
  Clock, Globe, Sparkles, LayoutDashboard
} from 'lucide-react';
import { useTrips } from '../contexts/TripContext';
import { useAuth } from '../contexts/AuthContext';

const statusColors = {
  upcoming: { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa', label: 'Upcoming' },
  ongoing:  { bg: 'rgba(16,185,129,0.12)', text: '#10B981', label: 'Ongoing' },
  completed:{ bg: 'rgba(71,85,105,0.25)',  text: '#94A3B8', label: 'Completed' },
};

function TripCard({ trip, index }) {
  const sc = statusColors[trip.status] || statusColors.upcoming;
  const daysCount = trip.daysCount || trip.days?.length || 0;
  const activitiesCount = trip.activities || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        background: 'var(--color-secondary-dark)',
        border: '1px solid var(--color-border-dark)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        transition: 'box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Gradient accent bar */}
      <div style={{
        height: 4,
        background: 'linear-gradient(90deg, #3B82F6, #F59E0B, #3B82F6)',
        flexShrink: 0,
      }} />

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <span style={{ fontSize: '2rem', flexShrink: 0, lineHeight: 1 }}>{trip.emoji}</span>
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                color: 'white', fontWeight: 700, fontSize: '1rem',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                marginBottom: 2,
              }}>
                {trip.destination}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{trip.country}</p>
            </div>
          </div>
          <span style={{
            padding: '4px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 600,
            background: sc.bg, color: sc.text, flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            {sc.label}
          </span>
        </div>

        {/* Trip Metadata Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Calendar style={{ width: 13, height: 13, color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {trip.startDate}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Clock style={{ width: 13, height: 13, color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              {daysCount} day{daysCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Users style={{ width: 13, height: 13, color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Wallet style={{ width: 13, height: 13, color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {trip.currency} {Number(trip.budget).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto',
        }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            {activitiesCount} activities
          </span>
          <Link
            to={`/itinerary/${trip.id}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--color-brand-blue)', fontSize: '0.8rem', fontWeight: 600,
              textDecoration: 'none', transition: 'color 0.2s',
            }}
          >
            View <ChevronRight style={{ width: 14, height: 14 }} />
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
  const totalDaysPlanned = trips.reduce((sum, t) => sum + (t.daysCount || 0), 0);
  const sharedTrips = trips.filter(t => t.isPublic).length;

  const stats = [
    {
      icon: Globe,
      label: 'Countries',
      value: uniqueCountries.size,
      color: '#60a5fa',
      bg: 'rgba(59,130,246,0.12)',
    },
    {
      icon: Plane,
      label: 'Total Trips',
      value: trips.length,
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.12)',
    },
    {
      icon: Calendar,
      label: 'Days Planned',
      value: totalDaysPlanned,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.12)',
    },
    {
      icon: Users,
      label: 'Trips Shared',
      value: sharedTrips,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
    },
  ];

  return (
    <div
      className="page-transition"
      style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 16, marginBottom: 36,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(59,130,246,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LayoutDashboard style={{ width: 18, height: 18, color: '#60a5fa' }} />
              </div>
              <h1 style={{
                fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                color: 'white',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}>
                Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''} 👋
              </h1>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', paddingLeft: 46 }}>
              Here's an overview of your travel plans
            </p>
          </div>

          <Link
            to="/plan"
            className="btn-primary"
            style={{ textDecoration: 'none', flexShrink: 0, padding: '12px 24px' }}
          >
            <Plus style={{ width: 16, height: 16 }} />
            Plan New Trip
          </Link>
        </motion.div>

        {/* ── Stats Row ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 36,
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: 'var(--color-secondary-dark)',
                border: '1px solid var(--color-border-dark)',
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'border-color 0.3s',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: stat.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <stat.icon style={{ width: 22, height: 22, color: stat.color }} />
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  {stat.label}
                </p>
                <p style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Filter Tabs ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 28,
          overflowX: 'auto',
          paddingBottom: 4,
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '8px 18px',
                borderRadius: 999,
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                border: filter === f.key
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.08)',
                background: filter === f.key
                  ? 'var(--color-brand-blue)'
                  : 'transparent',
                color: filter === f.key
                  ? 'white'
                  : 'var(--color-text-muted)',
                boxShadow: filter === f.key
                  ? '0 4px 12px rgba(59,130,246,0.25)'
                  : 'none',
              }}
            >
              {f.label}
            </button>
          ))}

          {/* Trip count badge */}
          <span style={{
            marginLeft: 'auto',
            flexShrink: 0,
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            whiteSpace: 'nowrap',
          }}>
            {filtered.length} trip{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Loading State ── */}
        {isLoadingTrips && trips.length === 0 && (
          <div style={{
            background: 'var(--color-secondary-dark)',
            border: '1px solid var(--color-border-dark)',
            borderRadius: 16,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 24px', textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56,
              border: '4px solid var(--color-dark-700)',
              borderTopColor: 'var(--color-brand-blue)',
              borderRadius: '50%', marginBottom: 20,
            }} className="animate-spin" />
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading your trips...</p>
          </div>
        )}

        {/* ── Trips Grid ── */}
        {!isLoadingTrips && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {filtered.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}

            {/* Add New Trip card */}
            <Link
              to="/plan"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 220,
                background: 'rgba(255,255,255,0.02)',
                border: '2px dashed rgba(255,255,255,0.08)',
                borderRadius: 16,
                textDecoration: 'none',
                transition: 'all 0.25s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.45)';
                e.currentTarget.style.background = 'rgba(59,130,246,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                  transition: 'all 0.2s',
                }}>
                  <Plus style={{ width: 24, height: 24, color: 'var(--color-text-muted)' }} />
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
                  Plan New Trip
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* ── Empty State ── */}
        {!isLoadingTrips && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--color-secondary-dark)',
              border: '1px solid var(--color-border-dark)',
              borderRadius: 20,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '80px 32px',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(59,130,246,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24,
            }}>
              <Plane style={{ width: 36, height: 36, color: '#60a5fa' }} />
            </div>

            <h3 style={{
              fontSize: '1.35rem', fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'white', marginBottom: 12,
              letterSpacing: '-0.01em',
            }}>
              {filter === 'all' ? 'No trips planned yet' : `No ${filter} trips`}
            </h3>

            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              maxWidth: 380,
              marginBottom: 32,
            }}>
              {filter === 'all'
                ? 'Ready for your next adventure? Let AI generate the perfect itinerary for you in seconds.'
                : `You don't have any ${filter} trips. Start planning your next journey!`}
            </p>

            <Link
              to="/plan"
              className="btn-primary"
              style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '0.95rem' }}
            >
              <Sparkles style={{ width: 16, height: 16 }} />
              Start Planning
            </Link>
          </motion.div>
        )}

      </div>
    </div>
  );
}
