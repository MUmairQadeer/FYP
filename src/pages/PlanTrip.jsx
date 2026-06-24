import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Calendar, Users, Wallet, Compass, Sparkles,
  ArrowRight, ArrowLeft, Globe, Plane, Check, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TRAVEL_STYLES, CURRENCIES, FEATURED_DESTINATIONS } from '../utils/constants';
import { useTrips } from '../contexts/TripContext';

const STEPS = ['Destination', 'Dates & Travelers', 'Budget', 'Style', 'Generate'];

export default function PlanTrip() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { generateItinerary, isGenerating } = useTrips();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    destination: searchParams.get('destination') || '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: '',
    currency: 'USD',
    style: '',
    preferences: [],
  });

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const canNext = () => {
    if (step === 0) return formData.destination.length > 1;
    if (step === 1) return formData.startDate && formData.endDate;
    if (step === 2) return formData.budget;
    if (step === 3) return formData.style;
    return true;
  };

  const handleGenerate = async () => {
    try {
      const result = await generateItinerary(formData);
      toast.success('Trip generated successfully!');
      navigate(`/itinerary/${result.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to generate trip. Please try again.');
    }
  };

  const preferences = [
    { id: 'halal', label: '🕌 Halal Food', desc: 'Halal restaurants only' },
    { id: 'family', label: '👨‍👩‍👧‍👦 Family Friendly', desc: 'Kid-safe activities' },
    { id: 'accessible', label: '♿ Accessibility', desc: 'Wheelchair accessible' },
    { id: 'vegetarian', label: '🥗 Vegetarian', desc: 'Vegetarian dining' },
    { id: 'nightlife', label: '🌙 Nightlife', desc: 'Bars & clubs' },
    { id: 'photography', label: '📸 Photography', desc: 'Photo-worthy spots' },
  ];

  const stepVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="page-transition" style={{ minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'white',
              marginBottom: '10px',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Plan Your <span className="gradient-text">Dream Trip</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}
          >
            Tell us about your trip and AI will create the perfect itinerary
          </motion.p>
        </div>

        {/* Main Layout: Two-column on large, stacked on small */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '32px',
          alignItems: 'start',
        }}
          className="plan-trip-grid"
        >

          {/* LEFT COLUMN: Progress + Form + Buttons */}
          <div style={{ minWidth: 0 }}>

            {/* Step Progress Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '32px',
              width: '100%',
            }}>
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                  }}>
                    <div
                      className={`transition-all duration-300 ${
                        i < step
                          ? 'bg-primary-500 text-white'
                          : i === step
                          ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
                          : 'bg-dark-800 text-dark-500 border border-dark-700'
                      }`}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        boxShadow: i === step ? '0 0 16px rgba(59,130,246,0.35)' : 'none',
                        transform: i === step ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s',
                      }}
                    >
                      {i < step ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: i === step ? 600 : 400,
                        color: i === step ? 'white' : 'var(--color-text-muted)',
                        whiteSpace: 'nowrap',
                        display: 'block',
                      }}
                    >
                      {s}
                    </span>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div
                      className={`transition-all duration-500 ${i < step ? 'bg-primary-500' : 'bg-dark-800'}`}
                      style={{ flex: 1, height: 2, borderRadius: 2, margin: '0 4px', marginBottom: '18px' }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step Content Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="glass-card"
                style={{ padding: '32px' }}
              >

                {/* Step 0: Destination */}
                {step === 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '14px',
                        background: 'rgba(59,130,246,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <MapPin className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                          Where are you going?
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                          Search any city or country worldwide
                        </p>
                      </div>
                    </div>

                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                      <Search style={{
                        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                        width: 18, height: 18, color: 'var(--color-text-muted)',
                      }} />
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => updateField('destination', e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: 46, paddingTop: 16, paddingBottom: 16, fontSize: '1.05rem' }}
                        placeholder="e.g. Paris, Tokyo, Dubai, Lahore..."
                        autoFocus
                      />
                    </div>

                    <h3 style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '14px',
                    }}>
                      Popular Destinations
                    </h3>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                      gap: '12px',
                    }}>
                      {FEATURED_DESTINATIONS.slice(0, 6).map(d => (
                        <button
                          key={d.id}
                          onClick={() => updateField('destination', `${d.city}, ${d.country}`)}
                          style={{
                            padding: '14px',
                            borderRadius: '12px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            border: formData.destination.includes(d.city)
                              ? '1px solid rgba(59,130,246,0.5)'
                              : '1px solid rgba(255,255,255,0.06)',
                            background: formData.destination.includes(d.city)
                              ? 'rgba(59,130,246,0.12)'
                              : 'rgba(255,255,255,0.03)',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            if (!formData.destination.includes(d.city)) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                            }
                          }}
                          onMouseLeave={e => {
                            if (!formData.destination.includes(d.city)) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            }
                          }}
                        >
                          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '6px' }}>
                            {d.emoji || '🌍'}
                          </span>
                          <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2px' }}>
                            {d.city}
                          </p>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                            {d.country}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1: Dates & Travelers */}
                {step === 1 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '14px',
                        background: 'rgba(245,158,11,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Calendar className="w-6 h-6 text-accent-400" />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                          When & Who?
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                          Set your travel dates and group size
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '32px',
                    }}>
                      <div>
                        <label style={{
                          display: 'block', fontSize: '0.8rem', fontWeight: 600,
                          color: 'var(--color-text-secondary)', marginBottom: '8px',
                        }}>
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => updateField('startDate', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block', fontSize: '0.8rem', fontWeight: 600,
                          color: 'var(--color-text-secondary)', marginBottom: '8px',
                        }}>
                          End Date
                        </label>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => updateField('endDate', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block', fontSize: '0.8rem', fontWeight: 600,
                        color: 'var(--color-text-secondary)', marginBottom: '16px',
                      }}>
                        Number of Travelers
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button
                          onClick={() => updateField('travelers', Math.max(1, formData.travelers - 1))}
                          style={{
                            width: 48, height: 48, borderRadius: '12px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'white', fontSize: '1.4rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
                          }}
                        >
                          −
                        </button>
                        <div style={{ textAlign: 'center', minWidth: 80 }}>
                          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
                            {formData.travelers}
                          </span>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {formData.travelers === 1 ? 'Solo Traveler' : 'Travelers'}
                          </p>
                        </div>
                        <button
                          onClick={() => updateField('travelers', Math.min(20, formData.travelers + 1))}
                          style={{
                            width: 48, height: 48, borderRadius: '12px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'white', fontSize: '1.4rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Budget */}
                {step === 2 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '14px',
                        background: 'rgba(245,158,11,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Wallet className="w-6 h-6 text-warning-500" />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                          What's your budget?
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                          Set a total budget for the trip
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
                      gap: '16px',
                      marginBottom: '24px',
                    }}
                      className="budget-input-grid"
                    >
                      <div>
                        <label style={{
                          display: 'block', fontSize: '0.8rem', fontWeight: 600,
                          color: 'var(--color-text-secondary)', marginBottom: '8px',
                        }}>
                          Total Budget
                        </label>
                        <input
                          type="number"
                          value={formData.budget}
                          onChange={(e) => updateField('budget', e.target.value)}
                          className="input-field"
                          style={{ fontSize: '1.5rem', padding: '18px 16px', fontFamily: 'var(--font-mono)' }}
                          placeholder="3,000"
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block', fontSize: '0.8rem', fontWeight: 600,
                          color: 'var(--color-text-secondary)', marginBottom: '8px',
                        }}>
                          Currency
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => updateField('currency', e.target.value)}
                          className="input-field"
                          style={{ height: '62px' }}
                        >
                          {CURRENCIES.map(c => (
                            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '12px',
                    }}>
                      {[
                        { label: 'Budget', range: '💰 Under $1K', value: 1000 },
                        { label: 'Mid-Range', range: '💳 $1K – $5K', value: 3000 },
                        { label: 'Luxury', range: '💎 $5K+', value: 8000 },
                      ].map(b => (
                        <button
                          key={b.label}
                          onClick={() => updateField('budget', b.value)}
                          style={{
                            padding: '16px',
                            borderRadius: '12px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            border: Number(formData.budget) === b.value
                              ? '1px solid rgba(59,130,246,0.5)'
                              : '1px solid rgba(255,255,255,0.06)',
                            background: Number(formData.budget) === b.value
                              ? 'rgba(59,130,246,0.12)'
                              : 'rgba(255,255,255,0.03)',
                            transition: 'all 0.2s',
                          }}
                        >
                          <p style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
                            {b.range.split(' ')[0]}
                          </p>
                          <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2px' }}>
                            {b.label}
                          </p>
                          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                            {b.range.split(' ').slice(1).join(' ')}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Travel Style */}
                {step === 3 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '14px',
                        background: 'rgba(16,185,129,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Compass className="w-6 h-6 text-success-500" />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                          Travel Style
                        </h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                          How do you like to travel?
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '12px',
                      marginBottom: '28px',
                    }}>
                      {TRAVEL_STYLES.map(s => (
                        <button
                          key={s.id}
                          onClick={() => updateField('style', s.id)}
                          style={{
                            padding: '16px',
                            borderRadius: '12px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            border: formData.style === s.id
                              ? '1px solid rgba(59,130,246,0.6)'
                              : '1px solid rgba(255,255,255,0.06)',
                            background: formData.style === s.id
                              ? 'rgba(59,130,246,0.12)'
                              : 'rgba(255,255,255,0.03)',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{s.icon}</span>
                            <div>
                              <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>
                                {s.label}
                              </p>
                              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                                {s.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <h3 style={{
                      fontSize: '0.7rem', fontWeight: 600,
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      marginBottom: '14px',
                    }}>
                      Preferences (optional)
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                      gap: '10px',
                    }}>
                      {preferences.map(p => {
                        const selected = formData.preferences.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() => updateField('preferences',
                              selected ? formData.preferences.filter(x => x !== p.id)
                                : [...formData.preferences, p.id]
                            )}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '10px',
                              textAlign: 'left',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              border: selected
                                ? '1px solid rgba(59,130,246,0.4)'
                                : '1px solid rgba(255,255,255,0.05)',
                              background: selected
                                ? 'rgba(59,130,246,0.1)'
                                : 'rgba(255,255,255,0.02)',
                              color: selected ? 'white' : 'var(--color-text-secondary)',
                              transition: 'all 0.2s',
                            }}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Generate */}
                {step === 4 && (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    {isGenerating ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      >
                        <div style={{ position: 'relative', marginBottom: '32px' }}>
                          <div style={{
                            width: 96, height: 96, borderRadius: '50%',
                            border: '4px solid var(--color-dark-700)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Loader2 style={{ width: 40, height: 40, color: 'var(--color-brand-blue)' }} className="animate-spin" />
                          </div>
                          <motion.div
                            style={{
                              position: 'absolute', inset: 0, borderRadius: '50%',
                              border: '4px solid transparent',
                              borderTopColor: 'var(--color-brand-blue)',
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '10px' }}>
                          AI is Planning Your Trip...
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', maxWidth: 380, margin: '0 auto 16px' }}>
                          Gemini AI is crafting a personalized itinerary for{' '}
                          <strong style={{ color: 'white' }}>{formData.destination}</strong>{' '}
                          with {formData.travelers} traveler{formData.travelers > 1 ? 's' : ''}
                        </p>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }} className="animate-pulse">
                          ✨ Analyzing local attractions...
                        </div>
                      </motion.div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }} className="animate-bounce-soft">🎯</div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '10px' }}>
                          Ready to Generate!
                        </h2>
                        <p style={{
                          color: 'var(--color-text-secondary)', marginBottom: '32px',
                          maxWidth: 380, margin: '0 auto 32px',
                        }}>
                          All details are set. Let AI create your perfect itinerary.
                        </p>

                        <button
                          onClick={handleGenerate}
                          className="btn-primary glass-card-glow"
                          style={{ padding: '16px 40px', fontSize: '1.05rem', borderRadius: '12px', width: '100%', maxWidth: 320 }}
                        >
                          <Sparkles className="w-5 h-5" />
                          Generate My Itinerary
                        </button>
                        <p style={{
                          color: 'var(--color-text-muted)', fontSize: '0.75rem',
                          marginTop: '16px', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: '6px',
                        }}>
                          <Sparkles style={{ width: 12, height: 12, color: 'var(--color-brand-blue)' }} />
                          Powered by Google Gemini AI
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {step < 4 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '20px',
                gap: '12px',
              }}>
                <button
                  onClick={() => setStep(s => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="btn-secondary"
                  style={{
                    padding: '12px 24px',
                    opacity: step === 0 ? 0.3 : 1,
                    cursor: step === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(s => Math.min(4, s + 1))}
                  disabled={!canNext()}
                  className="btn-primary"
                  style={{
                    padding: '12px 28px',
                    opacity: !canNext() ? 0.3 : 1,
                    cursor: !canNext() ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Live Trip Summary */}
          <div className="plan-trip-summary">
            <div
              className="glass-card"
              style={{
                position: 'sticky',
                top: '88px',
                padding: '28px',
                borderColor: 'rgba(59,130,246,0.15)',
                background: 'rgba(15,17,23,0.8)',
              }}
            >
              <h3 style={{
                fontSize: '1.05rem', fontWeight: 700,
                color: 'white', marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <MapPin style={{ width: 18, height: 18, color: 'var(--color-brand-blue)' }} />
                Trip Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

                {/* Destination */}
                <div style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                }}>
                  <p style={{
                    fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '6px',
                  }}>
                    Destination
                  </p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>
                    {formData.destination
                      ? formData.destination
                      : <span style={{ color: 'var(--color-dark-600)' }}>Not selected yet</span>
                    }
                  </p>
                </div>

                {/* Dates */}
                <div style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                }}>
                  <p style={{
                    fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '6px',
                  }}>
                    Dates & Duration
                  </p>
                  <p style={{ fontWeight: 500, color: 'white', fontSize: '0.9rem' }}>
                    {formData.startDate
                      ? formData.startDate
                      : <span style={{ color: 'var(--color-dark-600)' }}>MM/DD/YYYY</span>
                    }
                    <span style={{ color: 'var(--color-text-muted)', margin: '0 8px' }}>→</span>
                    {formData.endDate
                      ? formData.endDate
                      : <span style={{ color: 'var(--color-dark-600)' }}>MM/DD/YYYY</span>
                    }
                  </p>
                </div>

                {/* Travelers & Budget */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                }}>
                  <div>
                    <p style={{
                      fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '6px',
                    }}>
                      Travelers
                    </p>
                    <p style={{
                      fontWeight: 600, color: 'white', fontSize: '0.9rem',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <Users style={{ width: 15, height: 15, color: 'var(--color-text-muted)' }} />
                      {formData.travelers} {formData.travelers === 1 ? 'Person' : 'People'}
                    </p>
                  </div>
                  <div>
                    <p style={{
                      fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '6px',
                    }}>
                      Budget
                    </p>
                    <p style={{
                      fontWeight: 600, color: 'white', fontSize: '0.9rem',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <Wallet style={{ width: 15, height: 15, color: 'var(--color-text-muted)' }} />
                      {formData.budget
                        ? `${formData.currency} ${Number(formData.budget).toLocaleString()}`
                        : <span style={{ color: 'var(--color-dark-600)' }}>Not set</span>
                      }
                    </p>
                  </div>
                </div>

                {/* Style & Preferences */}
                <div>
                  <p style={{
                    fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.1em', color: 'var(--color-text-muted)', marginBottom: '10px',
                  }}>
                    Style & Preferences
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formData.style ? (
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(16,185,129,0.1)',
                        color: 'var(--color-success)',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}>
                        {formData.style.replace('-', ' ')}
                      </span>
                    ) : (
                      <span style={{
                        padding: '4px 12px',
                        border: '1px dashed var(--color-dark-600)',
                        color: 'var(--color-text-muted)',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                      }}>
                        Not selected
                      </span>
                    )}
                    {formData.preferences.map(p => (
                      <span key={p} style={{
                        padding: '4px 12px',
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--color-text-secondary)',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                      }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Responsive Grid CSS */}
      <style>{`
        .plan-trip-grid {
          grid-template-columns: minmax(0, 1fr);
        }
        .plan-trip-summary {
          display: none;
        }

        @media (min-width: 1024px) {
          .plan-trip-grid {
            grid-template-columns: minmax(0, 3fr) minmax(320px, 1.2fr);
          }
          .plan-trip-summary {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .budget-input-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .glass-card:hover {
          transform: none !important;
        }
      `}</style>
    </div>
  );
}
