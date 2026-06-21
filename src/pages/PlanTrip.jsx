import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Calendar, Users, Wallet, Compass, Sparkles,
  ArrowRight, ArrowLeft, Globe, Plane, Check, Loader2
} from 'lucide-react';
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
    await generateItinerary(formData);
    navigate('/itinerary/trip-1');
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
    <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
      <div className="container-custom mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold font-heading text-white mb-2"
          >
            Plan Your <span className="gradient-text">Dream Trip</span>
          </motion.h1>
          <p className="text-dark-400">Tell us about your trip and AI will create the perfect itinerary</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10 max-w-lg mx-auto">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  i < step ? 'bg-primary-500 text-white' :
                  i === step ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white scale-110' :
                  'bg-dark-800 text-dark-500 border border-dark-700'
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] hidden sm:block ${i === step ? 'text-white' : 'text-dark-500'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${i < step ? 'bg-primary-500' : 'bg-dark-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="glass-card p-8 sm:p-10 !hover:transform-none"
          >
            {/* Step 0: Destination */}
            {step === 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white font-heading">Where are you going?</h2>
                    <p className="text-dark-400 text-sm">Search any city or country worldwide</p>
                  </div>
                </div>
                <div className="relative mb-6">
                  <Search className="w-5 h-5 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => updateField('destination', e.target.value)}
                    className="input-field !pl-12 !py-4 !text-lg"
                    placeholder="e.g. Paris, Tokyo, Dubai, Lahore..."
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FEATURED_DESTINATIONS.slice(0, 8).map(d => (
                    <button
                      key={d.id}
                      onClick={() => updateField('destination', `${d.city}, ${d.country}`)}
                      className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                        formData.destination.includes(d.city)
                          ? 'bg-primary-500/20 border border-primary-500/40'
                          : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className="text-xl">{d.emoji}</span>
                      <p className="text-white text-sm font-medium mt-1">{d.city}</p>
                      <p className="text-dark-500 text-xs">{d.country}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Dates & Travelers */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white font-heading">When & Who?</h2>
                    <p className="text-dark-400 text-sm">Set your travel dates and group size</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm text-dark-300 font-medium mb-1.5 block">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateField('startDate', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-dark-300 font-medium mb-1.5 block">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateField('endDate', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-dark-300 font-medium mb-3 block">Number of Travelers</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateField('travelers', Math.max(1, formData.travelers - 1))}
                      className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xl flex items-center justify-center hover:bg-white/[0.08] transition-all cursor-pointer"
                    >−</button>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white">{formData.travelers}</span>
                      <p className="text-dark-500 text-xs mt-0.5">{formData.travelers === 1 ? 'Solo traveler' : 'travelers'}</p>
                    </div>
                    <button
                      onClick={() => updateField('travelers', Math.min(20, formData.travelers + 1))}
                      className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xl flex items-center justify-center hover:bg-white/[0.08] transition-all cursor-pointer"
                    >+</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Budget */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-warning-500/10 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-warning-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white font-heading">What's your budget?</h2>
                    <p className="text-dark-400 text-sm">Set a total budget for the trip</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="sm:col-span-2">
                    <label className="text-sm text-dark-300 font-medium mb-1.5 block">Total Budget</label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => updateField('budget', e.target.value)}
                      className="input-field !text-2xl !py-4"
                      placeholder="3,000"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-dark-300 font-medium mb-1.5 block">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => updateField('currency', e.target.value)}
                      className="input-field !py-4"
                    >
                      {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Budget', range: '💰 Under $1K', value: 1000 },
                    { label: 'Mid-Range', range: '💳 $1K - $5K', value: 3000 },
                    { label: 'Luxury', range: '💎 $5K+', value: 8000 },
                  ].map(b => (
                    <button
                      key={b.label}
                      onClick={() => updateField('budget', b.value)}
                      className={`p-4 rounded-xl text-center transition-all cursor-pointer ${
                        Number(formData.budget) === b.value
                          ? 'bg-primary-500/20 border border-primary-500/40'
                          : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                      }`}
                    >
                      <p className="text-lg mb-1">{b.range.split(' ')[0]}</p>
                      <p className="text-white text-sm font-medium">{b.label}</p>
                      <p className="text-dark-500 text-xs">{b.range.split(' ').slice(1).join(' ')}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Travel Style */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-success-500/10 flex items-center justify-center">
                    <Compass className="w-6 h-6 text-success-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white font-heading">Travel Style</h2>
                    <p className="text-dark-400 text-sm">How do you like to travel?</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {TRAVEL_STYLES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => updateField('style', s.id)}
                      className={`p-4 rounded-xl text-left transition-all cursor-pointer ${
                        formData.style === s.id
                          ? 'bg-primary-500/20 border-2 border-primary-500/60'
                          : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className="text-2xl">{s.icon}</span>
                      <p className="text-white text-sm font-semibold mt-2">{s.label}</p>
                      <p className="text-dark-500 text-xs mt-0.5">{s.description}</p>
                    </button>
                  ))}
                </div>

                <h3 className="text-white font-medium mb-3">Preferences (optional)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {preferences.map(p => {
                    const selected = formData.preferences.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => updateField('preferences',
                          selected ? formData.preferences.filter(x => x !== p.id)
                            : [...formData.preferences, p.id]
                        )}
                        className={`p-3 rounded-xl text-left text-sm transition-all cursor-pointer ${
                          selected ? 'bg-primary-500/15 border border-primary-500/30' : 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="text-dark-200">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Generate */}
            {step === 4 && (
              <div className="text-center py-8">
                {isGenerating ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-8">
                      <div className="w-24 h-24 rounded-full border-4 border-dark-700 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-white font-heading mb-2">AI is Planning Your Trip...</h2>
                    <p className="text-dark-400 max-w-md mx-auto mb-4">
                      GPT-4o is crafting a personalized itinerary for <strong className="text-white">{formData.destination}</strong> with {formData.travelers} traveler{formData.travelers > 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-dark-500">
                      <span className="animate-pulse">✨ Analyzing local attractions</span>
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    <div className="text-5xl mb-6">🎯</div>
                    <h2 className="text-2xl font-bold text-white font-heading mb-2">Ready to Generate!</h2>
                    <p className="text-dark-400 mb-8 max-w-md mx-auto">Review your trip details and let AI create your perfect itinerary.</p>

                    <div className="glass-light rounded-2xl p-6 max-w-sm mx-auto mb-8 text-left">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-dark-400">Destination</span>
                          <span className="text-white font-medium">{formData.destination}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-dark-400">Dates</span>
                          <span className="text-white font-medium">{formData.startDate} → {formData.endDate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-dark-400">Travelers</span>
                          <span className="text-white font-medium">{formData.travelers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-dark-400">Budget</span>
                          <span className="text-white font-medium">{formData.currency} {Number(formData.budget).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-dark-400">Style</span>
                          <span className="text-white font-medium capitalize">{formData.style}</span>
                        </div>
                      </div>
                    </div>

                    <button onClick={handleGenerate} className="btn-primary !py-4 !px-10 !text-base">
                      <Sparkles className="w-5 h-5" />
                      Generate with AI
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-secondary !py-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setStep(s => Math.min(4, s + 1))}
              disabled={!canNext()}
              className="btn-primary !py-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
