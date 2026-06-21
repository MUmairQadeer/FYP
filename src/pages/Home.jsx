import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Plane, Search, Sparkles, ArrowRight, Star, Globe, Map, Wallet,
  Brain, Users, Route, ChevronRight, MapPin, Calendar, TrendingUp
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
      className={`section-padding ${className}`}
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
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="glow-dot w-[600px] h-[600px] bg-primary-500 top-[-200px] right-[-100px]" />
          <div className="glow-dot w-[500px] h-[500px] bg-accent-500 bottom-[-150px] left-[-100px]" />
          <div className="glow-dot w-[400px] h-[400px] bg-primary-700 top-[40%] left-[50%] translate-x-[-50%]" />
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(rgba(148,163,184,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] left-[10%] text-4xl opacity-20 hidden md:block"
        >✈️</motion.div>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[30%] right-[15%] text-3xl opacity-20 hidden md:block"
        >🌍</motion.div>
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[25%] left-[20%] text-3xl opacity-15 hidden md:block"
        >🗺️</motion.div>
        <motion.div
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-[60%] right-[10%] text-3xl opacity-15 hidden md:block"
        >🧳</motion.div>

        <div className="container-custom mx-auto px-6 relative z-10 pt-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-dark-300 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span>Powered by <strong className="text-primary-400">GPT-4o</strong> AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading leading-tight mb-6"
            >
              Plan Anywhere.{' '}
              <span className="gradient-text">Travel Everywhere.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Generate personalized day-by-day travel itineraries for{' '}
              <strong className="text-dark-200">195 countries</strong> in seconds. 
              AI-powered plans with budget tracking, interactive maps, and local insights.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              onSubmit={handleSearch}
              className="relative max-w-xl mx-auto mb-6"
            >
              <div className="relative glass rounded-2xl p-1.5 flex items-center group hover:border-primary-500/30 transition-all duration-300">
                <div className="flex items-center gap-3 px-4 flex-1">
                  <Search className="w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to go? Try 'Paris', 'Tokyo', 'Lahore'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-3 bg-transparent text-white placeholder-dark-500 outline-none text-base"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary !rounded-xl !py-3 !px-6 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Plan with AI</span>
                </button>
              </div>
            </motion.form>

            {/* Quick destinations */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2 text-sm"
            >
              <span className="text-dark-500">Popular:</span>
              {['Paris', 'Tokyo', 'Dubai', 'New York', 'Lahore'].map((city) => (
                <button
                  key={city}
                  onClick={() => { setSearchQuery(city); navigate(`/plan?destination=${city}`); }}
                  className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-dark-300 hover:text-white hover:border-primary-500/30 transition-all cursor-pointer"
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-500 text-xs"
        >
          <span>Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-dark-600 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary-400"
            />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative py-12 border-y border-white/[0.06]">
        <div className="container-custom mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {APP_STATS.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold font-heading text-white mb-1">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <Section>
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Travel Smart</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              From AI-generated itineraries to real-time budget tracking — we've built the ultimate travel companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Globe;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 group"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${feature.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 font-heading">{feature.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ===== HOW IT WORKS ===== */}
      <Section className="relative">
        <div className="absolute inset-0">
          <div className="glow-dot w-[500px] h-[500px] bg-primary-600 top-0 left-[30%]" />
        </div>
        <div className="container-custom mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-4">How It Works</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white mb-4">
              Plan Your Dream Trip in{' '}
              <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-px bg-gradient-to-r from-primary-500/30 via-accent-500/30 to-primary-500/30" />
            
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center relative"
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-[100px] h-[100px] rounded-3xl bg-dark-800/80 border border-white/[0.08] flex items-center justify-center text-4xl relative z-10">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold z-20">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-heading">{step.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link to="/plan" className="btn-primary !py-4 !px-8 !text-base no-underline">
              <Sparkles className="w-5 h-5" />
              Start Planning Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ===== DESTINATIONS ===== */}
      <Section>
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-success-500/10 text-success-500 text-xs font-semibold uppercase tracking-wider mb-4">Destinations</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white mb-4">
              Explore the <span className="gradient-text">World</span>
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              From iconic cities to hidden gems — plan your perfect trip to any of 195 countries.
            </p>
          </div>

          {/* Destination cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                  className="glass-card block p-5 no-underline group relative overflow-hidden"
                  style={{ '--dest-color': dest.color }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.07] transform translate-x-8 -translate-y-8" style={{ background: dest.color }} />
                  <span className="text-3xl mb-3 block">{dest.emoji}</span>
                  <h3 className="text-white font-semibold text-base mb-0.5">{dest.city}</h3>
                  <p className="text-dark-400 text-xs">{dest.country}</p>
                  <p className="text-dark-500 text-[11px] mt-1 italic">{dest.tagline}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Plan trip</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Region tags */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {REGIONS.map(region => (
              <Link
                key={region.id}
                to={`/community?region=${region.id}`}
                className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-dark-300 hover:text-white hover:border-primary-500/30 transition-all no-underline flex items-center gap-2"
              >
                <span>{region.icon}</span>
                {region.name}
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== TESTIMONIALS ===== */}
      <Section className="relative">
        <div className="absolute inset-0">
          <div className="glow-dot w-[400px] h-[400px] bg-accent-600 bottom-0 right-[20%]" />
        </div>
        <div className="container-custom mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-warning-500/10 text-warning-500 text-xs font-semibold uppercase tracking-wider mb-4">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white mb-4">
              Loved by <span className="gradient-text">Travelers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-warning-500 fill-warning-500" />
                  ))}
                </div>
                <p className="text-dark-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-dark-500 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
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
        <div className="container-custom mx-auto">
          <div className="relative rounded-3xl overflow-hidden glass-card !bg-gradient-to-br !from-dark-900/90 !to-dark-800/90 p-12 sm:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-6 text-5xl"
              >🌍</motion.div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white mb-4">
                Ready to Explore the World?
              </h2>
              <p className="text-dark-400 max-w-lg mx-auto mb-8 text-lg">
                Join thousands of travelers using AI to plan unforgettable trips. Your next adventure starts here.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary !py-4 !px-8 !text-base no-underline">
                  <Sparkles className="w-5 h-5" />
                  Get Started — It's Free
                </Link>
                <Link to="/plan" className="btn-secondary !py-4 !px-8 !text-base no-underline">
                  <Plane className="w-5 h-5" />
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
