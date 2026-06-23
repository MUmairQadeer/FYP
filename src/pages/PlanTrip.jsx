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
    <div className="page-transition" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '64px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          
          {/* Left Side - 60% Form Area */}
          <div style={{ flex: '1 1 600px', minWidth: 320 }}>
            
            {/* Header */}
            <div className="mb-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-bold font-heading text-white mb-2 tracking-tight"
              >
                Plan Your <span className="gradient-text">Dream Trip</span>
              </motion.h1>
              <p className="text-dark-400">Tell us about your trip and AI will create the perfect itinerary</p>
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', width: '100%' }}>
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, maxWidth: 80 }}>
                    <div className={`transition-all duration-300 ${
                      i < step ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' :
                      i === step ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white scale-110 shadow-lg shadow-accent-500/20' :
                      'bg-dark-800 text-dark-500 border border-dark-700'
                    }`} style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
                      {i < step ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`hidden sm:block whitespace-nowrap ${i === step ? 'text-white font-medium' : 'text-dark-500'}`} style={{ fontSize: '0.625rem' }}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`transition-all duration-500 ${i < step ? 'bg-primary-500' : 'bg-dark-800'}`} style={{ flex: 1, height: 2, borderRadius: 2 }} />
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
                className="glass-card p-6 sm:p-10"
              >
                {/* Step 0: Destination */}
                {step === 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white font-heading tracking-tight">Where are you going?</h2>
                        <p className="text-dark-400 text-sm">Search any city or country worldwide</p>
                      </div>
                    </div>
                    <div className="relative mb-6">
                      <Search className="w-5 h-5 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => updateField('destination', e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: 48, paddingTop: 16, paddingBottom: 16, fontSize: '1.125rem' }}
                        placeholder="e.g. Paris, Tokyo, Dubai, Lahore..."
                        autoFocus
                      />
                    </div>
                    <h3 className="text-sm font-medium text-dark-400 mb-3 uppercase tracking-wider">Popular Destinations</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                      {FEATURED_DESTINATIONS.slice(0, 6).map(d => (
                        <button
                          key={d.id}
                          onClick={() => updateField('destination', `${d.city}, ${d.country}`)}
                          className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                            formData.destination.includes(d.city)
                              ? 'bg-primary-500/20 border border-primary-500/40 glass-card-glow'
                              : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                          }`}
                        >
                          <span className="text-xl mb-1 block">{d.emoji}</span>
                          <p className="text-white text-sm font-medium truncate">{d.city}</p>
                          <p className="text-dark-500 text-xs truncate">{d.country}</p>
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
                        <h2 className="text-xl font-semibold text-white font-heading tracking-tight">When & Who?</h2>
                        <p className="text-dark-400 text-sm">Set your travel dates and group size</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
                        <div className="text-center w-24">
                          <span className="text-3xl font-bold text-white font-heading">{formData.travelers}</span>
                          <p className="text-dark-500 text-xs mt-0.5">{formData.travelers === 1 ? 'Solo' : 'Travelers'}</p>
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
                        <h2 className="text-xl font-semibold text-white font-heading tracking-tight">What's your budget?</h2>
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
                          className="input-field !text-2xl !py-4 font-mono"
                          placeholder="3,000"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-dark-300 font-medium mb-1.5 block">Currency</label>
                        <select
                          value={formData.currency}
                          onChange={(e) => updateField('currency', e.target.value)}
                          className="input-field !py-4 h-[68px]"
                        >
                          {CURRENCIES.map(c => (
                            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                              ? 'bg-primary-500/20 border border-primary-500/40 glass-card-glow'
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
                        <h2 className="text-xl font-semibold text-white font-heading tracking-tight">Travel Style</h2>
                        <p className="text-dark-400 text-sm">How do you like to travel?</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {TRAVEL_STYLES.map(s => (
                        <button
                          key={s.id}
                          onClick={() => updateField('style', s.id)}
                          className={`p-4 rounded-xl text-left transition-all cursor-pointer ${
                            formData.style === s.id
                              ? 'bg-primary-500/20 border border-primary-500/60 glass-card-glow'
                              : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl mt-1">{s.icon}</span>
                            <div>
                              <p className="text-white text-sm font-semibold">{s.label}</p>
                              <p className="text-dark-500 text-xs mt-0.5">{s.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <h3 className="text-sm font-medium text-dark-400 mb-3 uppercase tracking-wider">Preferences (optional)</h3>
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
                              selected ? 'bg-primary-500/15 border border-primary-500/30 text-white' : 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] text-dark-300'
                            }`}
                          >
                            <span>{p.label}</span>
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
                        <p className="text-dark-400 max-w-[400px] mx-auto mb-4">
                          Gemini AI is crafting a personalized itinerary for <strong className="text-white">{formData.destination}</strong> with {formData.travelers} traveler{formData.travelers > 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-dark-500">
                          <span className="animate-pulse">✨ Analyzing local attractions</span>
                        </div>
                      </motion.div>
                    ) : (
                      <div>
                        <div className="text-5xl mb-6 animate-bounce-soft">🎯</div>
                        <h2 className="text-2xl font-bold text-white font-heading mb-2 tracking-tight">Ready to Generate!</h2>
                        <p className="text-dark-400 mb-8 max-w-[400px] mx-auto">All details are set. Let AI create your perfect itinerary.</p>

                        <button onClick={handleGenerate} className="btn-primary !py-4 !px-10 !text-lg !rounded-xl w-full sm:w-auto glass-card-glow">
                          <Sparkles className="w-5 h-5" />
                          Generate My Itinerary
                        </button>
                        <p className="text-dark-500 text-xs mt-4 flex items-center justify-center gap-1">
                          <Sparkles className="w-3 h-3 text-primary-400" /> Powered by Google Gemini AI
                        </p>
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
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Side - 40% Live Summary Panel */}
          <div className="hidden lg:block" style={{ flex: '1 1 350px', maxWidth: 450 }}>
            <div className="sticky top-28 glass-card border-primary-500/20 bg-dark-900/50" style={{ padding: 24 }}>
              <h3 className="text-lg font-bold font-heading text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-400" />
                Trip Summary
              </h3>
              
              <div className="space-y-6">
                <div className="border-b border-white/[0.06] pb-4">
                  <p className="text-dark-500 text-xs uppercase tracking-wider mb-1">Destination</p>
                  <p className="text-white font-medium text-lg">
                    {formData.destination ? formData.destination : <span className="text-dark-600">Not selected yet</span>}
                  </p>
                </div>
                
                <div className="border-b border-white/[0.06] pb-4">
                  <p className="text-dark-500 text-xs uppercase tracking-wider mb-1">Dates & Duration</p>
                  <p className="text-white font-medium">
                    {formData.startDate ? formData.startDate : <span className="text-dark-600">MM/DD/YYYY</span>}
                    <span className="text-dark-500 mx-2">→</span>
                    {formData.endDate ? formData.endDate : <span className="text-dark-600">MM/DD/YYYY</span>}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-white/[0.06] pb-4">
                  <div>
                    <p className="text-dark-500 text-xs uppercase tracking-wider mb-1">Travelers</p>
                    <p className="text-white font-medium flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-dark-400" />
                      {formData.travelers} {formData.travelers === 1 ? 'Person' : 'People'}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-500 text-xs uppercase tracking-wider mb-1">Budget</p>
                    <p className="text-white font-medium flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-dark-400" />
                      {formData.budget ? `${formData.currency} ${Number(formData.budget).toLocaleString()}` : <span className="text-dark-600">Not set</span>}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-dark-500 text-xs uppercase tracking-wider mb-2">Style & Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.style ? (
                      <span className="px-3 py-1 bg-success-500/10 text-success-500 rounded-full text-xs font-medium capitalize">
                        {formData.style.replace('-', ' ')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 border border-dashed border-dark-600 text-dark-500 rounded-full text-xs">Not selected</span>
                    )}
                    {formData.preferences.map(p => (
                      <span key={p} className="px-3 py-1 bg-white/[0.04] text-dark-300 rounded-full text-xs capitalize">
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
    </div>
  );
}
