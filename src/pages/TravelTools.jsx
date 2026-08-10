import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Search, Plane, Clock, ShieldAlert, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { PASSPORT_COUNTRIES } from '../utils/constants';

const API_URL = import.meta.env.VITE_API_URL || '/api';


export default function TravelTools() {
  const [activeTool, setActiveTool] = useState(null);
  
  // Tool states
  const [visaPassport, setVisaPassport] = useState('Pakistan');
  const [visaDestination, setVisaDestination] = useState('Turkey');
  const [visaResult, setVisaResult] = useState(null);
  const [visaLoading, setVisaLoading] = useState(false);

  const [weatherCity, setWeatherCity] = useState('');
  const [weatherResult, setWeatherResult] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [infoCountry, setInfoCountry] = useState('Japan');
  const [infoResult, setInfoResult] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);

  const [flightOrigin, setFlightOrigin] = useState('Lahore');
  const [flightDest, setFlightDest] = useState('London');
  const [flightDate, setFlightDate] = useState('');

  const tools = [
    {
      id: "visa",
      title: "Visa Checker",
      description: "Check visa requirements based on your passport and destination.",
      icon: ShieldAlert,
      color: "text-primary-400",
      bg: "bg-primary-500/10",
    },
    {
      id: "weather",
      title: "Weather Forecast",
      description: "Get accurate weather forecasts for your travel dates.",
      icon: Cloud,
      color: "text-accent-400",
      bg: "bg-accent-500/10",
    },
    {
      id: "flight",
      title: "Flight Search",
      description: "Find the best flight deals to your destination.",
      icon: Plane,
      color: "text-success-500",
      bg: "bg-success-500/10",
    },
    {
      id: "info",
      title: "Country Guide & Plugs",
      description: "Check electrical plug types, voltages, and time zones.",
      icon: Clock,
      color: "text-warning-500",
      bg: "bg-warning-500/10",
    }
  ];

  // Handler functions
  const checkVisaRequirements = async (e) => {
    e.preventDefault();
    setVisaLoading(true);
    setVisaResult(null);
    try {
      const res = await fetch(`${API_URL}/tools/visa?passport=${encodeURIComponent(visaPassport)}&destination=${encodeURIComponent(visaDestination)}`);
      if (res.ok) {
        const data = await res.json();
        setVisaResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVisaLoading(false);
    }
  };

  const checkWeatherForecast = async (e) => {
    e.preventDefault();
    if (!weatherCity.trim()) return;
    setWeatherLoading(true);
    setWeatherResult(null);
    try {
      const res = await fetch(`${API_URL}/tools/weather?destination=${encodeURIComponent(weatherCity)}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const checkCountryInfo = async (e) => {
    e.preventDefault();
    setInfoLoading(true);
    setInfoResult(null);
    try {
      const res = await fetch(`${API_URL}/tools/country-info?country=${encodeURIComponent(infoCountry)}`);
      if (res.ok) {
        const data = await res.json();
        setInfoResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInfoLoading(false);
    }
  };

  const searchFlights = (e) => {
    e.preventDefault();
    const formattedOrigin = flightOrigin.trim().toLowerCase();
    const formattedDest = flightDest.trim().toLowerCase();
    const dateQuery = flightDate ? `&depdate=${flightDate}` : '';
    const url = `https://www.skyscanner.net/transport/flights/${formattedOrigin}/${formattedDest}?adults=1${dateQuery}`;
    window.open(url, '_blank');
  };

  return (
    <div className="page-transition" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', backgroundColor: 'var(--color-dark-950)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Centered Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight" style={{ marginBottom: '16px' }}>
            Travel <span className="gradient-text">Tools</span>
          </h1>
          <p className="text-dark-400" style={{ fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
            Essential tools to help you plan and manage your trip seamlessly. Select a tool to start using it.
          </p>
        </div>

        {/* Grid of Tools */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', width: '100%' }}>
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={{ y: -4 }}
              onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
              className={`glass-card cursor-pointer group transition-all ${activeTool === tool.id ? 'glass-card-glow border-primary-500' : ''}`}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '24px', borderRadius: 12 }}
            >
              <div 
                className={`${tool.bg}`} 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: 12, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0
                }}
              >
                <tool.icon className={`${tool.color}`} style={{ width: '24px', height: '24px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="text-white font-semibold text-lg" style={{ marginBottom: '8px', marginTop: '0px' }}>{tool.title}</h3>
                <p className="text-dark-400 text-sm" style={{ lineHeight: '1.5', margin: '0px' }}>{tool.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-primary-400 font-medium" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{activeTool === tool.id ? 'Hide Tool' : 'Open Tool'}</span>
                  <ArrowRight style={{ width: '12px', height: '12px' }} className={`transition-transform ${activeTool === tool.id ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Tool Forms Render Area */}
        <AnimatePresence mode="wait">
          {activeTool && (
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
              className="glass-card"
              style={{ padding: '32px', borderRadius: 18, border: '1px solid var(--color-border-dark)', width: '100%' }}
            >
              {/* 1. VISA CHECKER */}
              {activeTool === 'visa' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 font-heading flex items-center gap-2">
                    <ShieldAlert className="text-primary-400 w-5 h-5" /> Visa Requirement Checker
                  </h2>
                  <form onSubmit={checkVisaRequirements} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'end' }}>
                    <div>
                      <label className="text-sm text-dark-300 font-medium mb-1.5 block">Passport Country</label>
                      <select 
                        value={visaPassport} 
                        onChange={(e) => setVisaPassport(e.target.value)} 
                        className="input-field"
                      >
                        {PASSPORT_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-dark-300 font-medium mb-1.5 block">Destination Country</label>
                      <select 
                        value={visaDestination} 
                        onChange={(e) => setVisaDestination(e.target.value)} 
                        className="input-field"
                      >
                        {PASSPORT_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <button type="submit" disabled={visaLoading} className="btn-primary w-full justify-center" style={{ height: '54px' }}>
                      {visaLoading ? 'Checking...' : 'Check Visa'}
                    </button>
                  </form>

                  {/* Visa Results */}
                  {visaResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-xs text-dark-500 uppercase tracking-wider font-semibold">Requirement Status</p>
                          <h3 className="text-2xl font-bold text-primary-400 mt-1 flex items-center gap-2">
                            <Check className="w-6 h-6" /> {visaResult.requirement}
                          </h3>
                        </div>
                        <div>
                          <p className="text-xs text-dark-500 uppercase tracking-wider font-semibold">Allowable Stay</p>
                          <h4 className="text-lg font-bold text-white mt-1">{visaResult.duration}</h4>
                        </div>
                      </div>
                      <div className="h-px bg-white/[0.06] my-4" />
                      <p className="text-dark-300 text-sm leading-relaxed">{visaResult.details}</p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* 2. WEATHER FORECAST */}
              {activeTool === 'weather' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 font-heading flex items-center gap-2">
                    <Cloud className="text-accent-400 w-5 h-5" /> Weather Forecaster
                  </h2>
                  <form onSubmit={checkWeatherForecast} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'end' }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <label className="text-sm text-dark-300 font-medium mb-1.5 block">Destination City</label>
                      <input 
                        type="text" 
                        value={weatherCity} 
                        onChange={(e) => setWeatherCity(e.target.value)} 
                        className="input-field" 
                        placeholder="e.g. Hunza, Paris, Tokyo" 
                      />
                    </div>
                    <button type="submit" disabled={weatherLoading} className="btn-primary" style={{ height: '54px', minWidth: '150px' }}>
                      {weatherLoading ? 'Fetching...' : 'Get Forecast'}
                    </button>
                  </form>

                  {/* Weather Results */}
                  {weatherResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-4">7-Day Forecast for {weatherResult.destination}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                        {weatherResult.forecast.map((f, index) => (
                          <div key={index} className="glass-light p-4 rounded-xl text-center border border-white/[0.04]">
                            <p className="text-dark-400 text-xs font-semibold">{f.dayName.substring(0, 3)}</p>
                            <p className="text-dark-500 text-[10px]">{f.date.substring(5)}</p>
                            <div className="text-3xl my-2.5">
                              {f.condition.includes('Sunny') || f.condition.includes('Hot') ? '☀️' : 
                               f.condition.includes('Rainy') || f.condition.includes('Showers') ? '🌧️' : 
                               f.condition.includes('Cloudy') || f.condition.includes('Overcast') ? '☁️' : '⛅'}
                            </div>
                            <p className="text-white text-sm font-bold">{f.tempDay}</p>
                            <p className="text-dark-500 text-xs">{f.tempNight}</p>
                            <span className="text-[10px] text-accent-400 block mt-1.5 font-medium truncate">{f.condition}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* 3. FLIGHT SEARCH */}
              {activeTool === 'flight' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 font-heading flex items-center gap-2">
                    <Plane className="text-success-500 w-5 h-5" /> Live Flight Search
                  </h2>
                  <form onSubmit={searchFlights} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
                    <div>
                      <label className="text-sm text-dark-300 font-medium mb-1.5 block">From (City or Code)</label>
                      <input 
                        type="text" 
                        value={flightOrigin} 
                        onChange={(e) => setFlightOrigin(e.target.value)} 
                        className="input-field" 
                        placeholder="e.g. Lahore" 
                      />
                    </div>
                    <div>
                      <label className="text-sm text-dark-300 font-medium mb-1.5 block">To (City or Code)</label>
                      <input 
                        type="text" 
                        value={flightDest} 
                        onChange={(e) => setFlightDest(e.target.value)} 
                        className="input-field" 
                        placeholder="e.g. London" 
                      />
                    </div>
                    <div>
                      <label className="text-sm text-dark-300 font-medium mb-1.5 block">Departure Date (Optional)</label>
                      <input 
                        type="date" 
                        value={flightDate} 
                        onChange={(e) => setFlightDate(e.target.value)} 
                        className="input-field" 
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center" style={{ height: '54px' }}>
                      Search on Skyscanner
                    </button>
                  </form>
                  <p className="text-dark-500 text-xs mt-3">We pre-fill Skyscanner parameters to search the cheapest deals for you instantly.</p>
                </div>
              )}

              {/* 4. COUNTRY INFO & PLUGS */}
              {activeTool === 'info' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 font-heading flex items-center gap-2">
                    <Clock className="text-warning-500 w-5 h-5" /> Local Country Information & Adapters
                  </h2>
                  <form onSubmit={checkCountryInfo} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'end' }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <label className="text-sm text-dark-300 font-medium mb-1.5 block">Select Destination Country</label>
                      <select 
                        value={infoCountry} 
                        onChange={(e) => setInfoCountry(e.target.value)} 
                        className="input-field"
                      >
                        {PASSPORT_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <button type="submit" disabled={infoLoading} className="btn-primary" style={{ height: '54px', minWidth: '180px' }}>
                      {infoLoading ? 'Loading...' : 'Get Details'}
                    </button>
                  </form>

                  {/* Info Results */}
                  {infoResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-4">Travel Standards for {infoResult.country}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        
                        <div className="glass-light p-4 rounded-xl border border-white/[0.04]">
                          <p className="text-dark-500 text-xs font-semibold">PLUG TYPES</p>
                          <h4 className="text-lg font-bold text-white mt-1">{infoResult.plugs}</h4>
                          <p className="text-xs text-dark-400 mt-1">Carry a universal adapter if traveling from Pakistan.</p>
                        </div>
                        
                        <div className="glass-light p-4 rounded-xl border border-white/[0.04]">
                          <p className="text-dark-500 text-xs font-semibold">VOLTAGE & FREQ</p>
                          <h4 className="text-lg font-bold text-white mt-1">{infoResult.voltage} @ {infoResult.frequency}</h4>
                          <p className="text-xs text-dark-400 mt-1">Make sure devices support local grid voltage.</p>
                        </div>

                        <div className="glass-light p-4 rounded-xl border border-white/[0.04]">
                          <p className="text-dark-500 text-xs font-semibold">TIME ZONE</p>
                          <h4 className="text-lg font-bold text-white mt-1">{infoResult.timezone}</h4>
                          <p className="text-xs text-dark-400 mt-1">Standard local time offset from GMT.</p>
                        </div>

                        <div className="glass-light p-4 rounded-xl border border-white/[0.04]">
                          <p className="text-dark-500 text-xs font-semibold">CURRENCY EXCHANGE (USD)</p>
                          <h4 className="text-lg font-bold text-white mt-1">1 USD ≈ {infoResult.exchangeRateToUSD} {infoResult.currency}</h4>
                          <p className="text-xs text-dark-400 mt-1">Approximate exchange rate standard currently.</p>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
