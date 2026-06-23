import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Plane, Search, Sparkles, ArrowRight, Star, Globe, Map, Wallet,
  Brain, Users, Route, MapPin
} from 'lucide-react';
import {
  FEATURED_DESTINATIONS, FEATURES, HOW_IT_WORKS,
  APP_STATS, TESTIMONIALS, REGIONS
} from '../utils/constants';

/* ===== Animated Counter ===== */
function Counter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const stepTime = Math.max(Math.floor(duration / end), 20);
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime));
      if (start >= end) { start = end; clearInterval(timer); }
      setCount(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ===== Icon Map ===== */
const iconMap = { Brain, Map, Wallet, Globe, Users, Route };

/* ===== Section Wrapper ===== */
function Section({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
      style={{ padding: '80px 0' }}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/plan?destination=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="page-transition">
      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <div className="glow-dot" style={{ width: 600, height: 600, background: 'var(--color-primary-500)', top: -200, right: -100 }} />
          <div className="glow-dot" style={{ width: 500, height: 500, background: 'var(--color-accent-500)', bottom: -150, left: -100 }} />
          <div className="glow-dot" style={{ width: 400, height: 400, background: 'var(--color-primary-700)', top: '40%', left: '50%', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(148,163,184,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '20%', left: '10%', fontSize: '2rem', opacity: 0.2, display: 'none' }}
          className="md:!block"
        >✈️</motion.div>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ position: 'absolute', top: '30%', right: '15%', fontSize: '1.75rem', opacity: 0.2, display: 'none' }}
          className="md:!block"
        >🌍</motion.div>
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', bottom: '25%', left: '20%', fontSize: '1.75rem', opacity: 0.15, display: 'none' }}
          className="md:!block"
        >🗺️</motion.div>
        <motion.div
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ position: 'absolute', top: '60%', right: '10%', fontSize: '1.75rem', opacity: 0.15, display: 'none' }}
          className="md:!block"
        >🧳</motion.div>

        <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto', padding: '96px 24px 0', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: 896, margin: '0 auto', textAlign: 'center' }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 9999, fontSize: '0.875rem', color: 'var(--color-dark-300)', marginBottom: 32 }}
              className="glass-light"
            >
              <Sparkles style={{ width: 16, height: 16, color: 'var(--color-primary-400)' }} />
              <span>Powered by <strong style={{ color: 'var(--color-primary-400)' }}>GPT-4o</strong> AI</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success-500)' }} className="animate-pulse" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)', color: 'white' }}
            >
              Plan Anywhere.{' '}
              <span style={{ color: 'var(--color-brand-blue)' }}>Travel Everywhere.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--color-dark-400)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.7 }}
            >
              Generate personalized day-by-day travel itineraries for{' '}
              <strong style={{ color: 'var(--color-dark-200)' }}>195 countries</strong> in seconds.
              AI-powered plans with budget tracking, interactive maps, and local insights.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              onSubmit={handleSearch}
              style={{ maxWidth: 580, margin: '0 auto 24px' }}
            >
              <div className="glass" style={{ borderRadius: 16, padding: 6, display: 'flex', alignItems: 'center', border: '1px solid var(--color-border-dark)', transition: 'border-color 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flex: 1, minWidth: 0 }}>
                  <Search style={{ width: 20, height: 20, color: 'var(--color-dark-400)', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Where do you want to go? Try 'Paris', 'Tokyo'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '12px 0', background: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: '1rem', fontFamily: 'var(--font-body)' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ borderRadius: 12, padding: '12px 20px', flexShrink: 0 }}>
                  <Sparkles style={{ width: 16, height: 16 }} />
                  <span className="sm:inline" style={{ display: 'none' }}>Plan with AI</span>
                </button>
              </div>
            </motion.form>

            {/* Quick destinations */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.875rem' }}
            >
              <span style={{ color: 'var(--color-dark-500)' }}>Popular:</span>
              {['Paris', 'Tokyo', 'Dubai', 'New York', 'Lahore'].map((city) => (
                <button
                  key={city}
                  onClick={() => { setSearchQuery(city); navigate(`/plan?destination=${city}`); }}
                  style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--color-dark-300)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}
                  onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.borderColor = 'rgba(59,130,246,0.3)'; }}
                  onMouseLeave={(e) => { e.target.style.color = 'var(--color-dark-300)'; e.target.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  {city}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--color-dark-500)', fontSize: '0.75rem' }}
        >
          <span>Scroll to explore</span>
          <div style={{ width: 20, height: 32, borderRadius: 9999, border: '1px solid var(--color-dark-600)', display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary-400)' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section style={{ position: 'relative', padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {APP_STATS.map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white', marginBottom: 4, whiteSpace: 'nowrap' }}>
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ color: 'var(--color-dark-400)', fontSize: '0.875rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <Section>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 9999, background: 'rgba(59,130,246,0.1)', color: 'var(--color-primary-400)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Features</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>
              Everything You Need to{' '}
              <span style={{ color: 'var(--color-brand-blue)' }}>Travel Smart</span>
            </h2>
            <p style={{ color: 'var(--color-dark-400)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              From AI-generated itineraries to real-time budget tracking — we've built the ultimate travel companion.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {FEATURES.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Globe;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card"
                  style={{ padding: 32 }}
                >
                  <div
                    style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, background: `${feature.color}15`, transition: 'transform 0.3s' }}
                  >
                    <Icon style={{ width: 28, height: 28, color: feature.color }} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--color-dark-400)', fontSize: '0.875rem', lineHeight: 1.7 }}>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ===== HOW IT WORKS ===== */}
      <Section style={{ position: 'relative' }}>
        <div className="glow-dot" style={{ width: 500, height: 500, background: 'var(--color-primary-600)', position: 'absolute', top: 0, left: '30%' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 9999, background: 'rgba(245,158,11,0.1)', color: 'var(--color-accent-400)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>How It Works</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>
              Plan Your Dream Trip in{' '}
              <span style={{ color: 'var(--color-brand-blue)' }}>3 Simple Steps</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, position: 'relative' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                style={{ textAlign: 'center', position: 'relative' }}
              >
                <div style={{ position: 'relative', display: 'inline-flex', marginBottom: 24 }}>
                  <div style={{ width: 100, height: 100, borderRadius: 24, background: 'var(--color-dark-800)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', position: 'relative', zIndex: 10 }}>
                    {step.icon}
                  </div>
                  <div style={{ position: 'absolute', top: -8, right: -8, width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', fontWeight: 700, zIndex: 20 }}>
                    {step.step}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: 12, fontFamily: 'var(--font-heading)' }}>{step.title}</h3>
                <p style={{ color: 'var(--color-dark-400)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 300, margin: '0 auto' }}>{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link to="/plan" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1rem', textDecoration: 'none' }}>
              <Sparkles style={{ width: 20, height: 20 }} />
              Start Planning Now
              <ArrowRight style={{ width: 20, height: 20 }} />
            </Link>
          </div>
        </div>
      </Section>

      {/* ===== DESTINATIONS ===== */}
      <Section>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 9999, background: 'rgba(16,185,129,0.1)', color: 'var(--color-success-500)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Destinations</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>
              Explore the <span style={{ color: 'var(--color-brand-blue)' }}>World</span>
            </h2>
            <p style={{ color: 'var(--color-dark-400)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              From iconic cities to hidden gems — plan your perfect trip to any of 195 countries.
            </p>
          </div>

          {/* Destination cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {FEATURED_DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/plan?destination=${dest.city}`}
                  className="glass-card"
                  style={{ display: 'block', padding: 20, textDecoration: 'none', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 96, height: 96, borderRadius: '50%', opacity: 0.07, transform: 'translate(32px, -32px)', background: dest.color }} />
                  <span style={{ fontSize: '1.75rem', marginBottom: 12, display: 'block' }}>{dest.emoji}</span>
                  <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', marginBottom: 2 }}>{dest.city}</h3>
                  <p style={{ color: 'var(--color-dark-400)', fontSize: '0.75rem' }}>{dest.country}</p>
                  <p style={{ color: 'var(--color-dark-500)', fontSize: '0.6875rem', marginTop: 4, fontStyle: 'italic' }}>{dest.tagline}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Region tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 40 }}>
            {REGIONS.map(region => (
              <Link
                key={region.id}
                to={`/community?region=${region.id}`}
                style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.875rem', color: 'var(--color-dark-300)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-dark-300)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                <span>{region.icon}</span>
                {region.name}
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== TESTIMONIALS ===== */}
      <Section style={{ position: 'relative' }}>
        <div className="glow-dot" style={{ width: 400, height: 400, background: 'var(--color-accent-600)', position: 'absolute', bottom: 0, right: '20%' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 9999, background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning-500)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Testimonials</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>
              Loved by <span style={{ color: 'var(--color-brand-blue)' }}>Travelers</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, maxWidth: 1024, margin: '0 auto' }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card"
                style={{ padding: 24 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} style={{ width: 16, height: 16, color: 'var(--color-warning-500)', fill: 'var(--color-warning-500)' }} />
                  ))}
                </div>
                <p style={{ color: 'var(--color-dark-300)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{t.avatar}</span>
                  <div>
                    <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500 }}>{t.name}</p>
                    <p style={{ color: 'var(--color-dark-500)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin style={{ width: 12, height: 12 }} />
                      {t.destination}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== CTA ===== */}
      <Section>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="glass-card" style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg, rgba(15,17,23,0.9), rgba(26,29,39,0.9))', padding: 'clamp(48px, 6vw, 64px)', textAlign: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(245,158,11,0.1), rgba(59,130,246,0.1))' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)' }} />
            <div style={{ position: 'relative', zIndex: 10 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', marginBottom: 24, fontSize: '3rem' }}
              >🌍</motion.div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white', marginBottom: 16, letterSpacing: '-0.02em' }}>
                Ready to Explore the World?
              </h2>
              <p style={{ color: 'var(--color-dark-400)', maxWidth: 480, margin: '0 auto 32px', fontSize: '1.125rem', lineHeight: 1.7 }}>
                Join thousands of travelers using AI to plan unforgettable trips. Your next adventure starts here.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <Link to="/register" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1rem', textDecoration: 'none' }}>
                  <Sparkles style={{ width: 20, height: 20 }} />
                  Get Started — It's Free
                </Link>
                <Link to="/plan" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1rem', textDecoration: 'none' }}>
                  <Plane style={{ width: 20, height: 20 }} />
                  Plan a Trip Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
