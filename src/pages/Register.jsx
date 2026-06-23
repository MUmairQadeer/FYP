import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, Plane, Check, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase', met: /[A-Z]/.test(password) },
    { label: 'Contains number', met: /\d/.test(password) },
    { label: 'Contains symbol', met: /[!@#$%^&*]/.test(password) },
  ];
  const strength = checks.filter(c => c.met).length;
  const colors = ['bg-error-500', 'bg-warning-500', 'bg-warning-500', 'bg-success-500'];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? colors[strength - 1] : 'bg-dark-700'}`} />
        ))}
      </div>
      <div className="space-y-1">
        {checks.map(({ label, met }) => (
          <div key={label} className={`flex items-center gap-1.5 text-xs ${met ? 'text-success-500' : 'text-dark-500'}`}>
            {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// Floating premium Boarding Pass Mock Component to wow users
function MockBoardingPass() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="glass-card mt-8"
      style={{
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(26, 29, 39, 0.65)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        maxWidth: '360px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'left'
      }}
    >
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plane style={{ width: '16px', height: '16px', color: 'var(--color-primary-400)' }} />
          <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-dark-400)' }}>AI Boarding Pass</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-success-500)', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '9999px', fontWeight: '600' }}>Confirmed</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h4 style={{ fontSize: '32px', fontWeight: '800', color: 'white', margin: 0, lineHeight: 1 }}>LHE</h4>
          <span style={{ fontSize: '11px', color: 'var(--color-dark-500)' }}>Lahore, PK</span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 16px' }}>
          <div style={{ width: '100%', height: '1px', borderTop: '2px dashed rgba(255,255,255,0.1)' }} />
          <Plane style={{ width: '14px', height: '14px', color: 'var(--color-primary-400)', position: 'absolute', transform: 'rotate(90deg)' }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <h4 style={{ fontSize: '32px', fontWeight: '800', color: 'white', margin: 0, lineHeight: 1 }}>CDG</h4>
          <span style={{ fontSize: '11px', color: 'var(--color-dark-500)' }}>Paris, FR</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '16px' }}>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--color-dark-500)', display: 'block', textTransform: 'uppercase' }}>Passenger</span>
          <span style={{ fontSize: '13px', color: 'white', fontWeight: '600' }}>Umair Qadeer</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-dark-500)', display: 'block', textTransform: 'uppercase' }}>Cabin Class</span>
          <span style={{ fontSize: '13px', color: 'var(--color-primary-400)', fontWeight: '600' }}>AI First Class</span>
        </div>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--color-dark-500)', display: 'block', textTransform: 'uppercase' }}>Date</span>
          <span style={{ fontSize: '13px', color: 'white', fontWeight: '600' }}>June 23, 2026</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-dark-500)', display: 'block', textTransform: 'uppercase' }}>Smart Seat</span>
          <span style={{ fontSize: '13px', color: 'var(--color-accent-400)', fontWeight: '600' }}>Seat AI-01</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!agreed) { setError('Please agree to the terms'); return; }
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container page-transition">
      {/* Left Side - 40% */}
      <div className="auth-left-panel">
        <div className="absolute inset-0">
          <div className="glow-dot w-[600px] h-[600px] bg-accent-600 top-[-200px] left-[-200px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        </div>
        
        <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div style={{ width: '100%' }}>
            <Link to="/" className="flex items-center gap-3 no-underline inline-flex" style={{ marginBottom: '40px' }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading text-white tracking-tight">
                Trip<span className="text-primary-400">Planner</span>
              </span>
            </Link>

            <h2 className="text-4xl font-bold font-heading text-white mb-4 leading-tight">
              Start your journey <br /><span className="gradient-text">with AI today.</span>
            </h2>
            <p className="text-dark-400 text-base max-w-[400px] mb-8">
              Create a free account to generate infinite itineraries, track your budget, and explore 195 countries.
            </p>
          </div>
          
          <MockBoardingPass />
        </div>
      </div>

      {/* Right Side - 60% */}
      <div className="auth-right-panel">
        <div className="absolute inset-0 lg:hidden">
          <div className="glow-dot w-[500px] h-[500px] bg-accent-600 top-[-200px] left-[-100px]" />
          <div className="glow-dot w-[400px] h-[400px] bg-primary-600 bottom-[-100px] right-[-100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
          style={{ width: '100%', maxWidth: '448px' }}
        >
          <div className="glass-card p-6 sm:p-10">
            {/* Logo Mobile */}
            <div className="text-center mb-8 lg:hidden">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center mx-auto mb-4">
                <Plane className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-heading text-white tracking-tight">Create Account</h1>
              <p className="text-dark-400 text-sm mt-2">Start planning your trips with AI</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-dark-300 font-medium mb-1.5 block">Full Name</label>
                <div className="relative group">
                  <User className="w-4 h-4 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-400 transition-colors" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field !pl-11" placeholder="Your full name" />
                </div>
              </div>

              <div>
                <label className="text-sm text-dark-300 font-medium mb-1.5 block">Email</label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-400 transition-colors" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field !pl-11" placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className="text-sm text-dark-300 font-medium mb-1.5 block">Password</label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field !pl-11 !pr-11"
                    placeholder="Create a strong password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div>
                <label className="text-sm text-dark-300 font-medium mb-1.5 block">Confirm Password</label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field !pl-11"
                    placeholder="Confirm your password"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-error-500 text-xs mt-1.5 flex items-center gap-1"><X className="w-3 h-3" /> Passwords don't match</p>
                )}
              </div>

              <label className="flex items-start gap-2 text-sm text-dark-400 cursor-pointer pt-2">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900" />
                <span>I agree to the <a href="#" className="text-primary-400 no-underline font-medium hover:text-primary-300 transition-colors">Terms of Service</a> and <a href="#" className="text-primary-400 no-underline font-medium hover:text-primary-300 transition-colors">Privacy Policy</a></span>
              </label>

              <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center !py-3.5 disabled:opacity-50 mt-2">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
              <div className="relative flex justify-center"><span className="px-4 bg-[var(--color-secondary-dark)] text-dark-500 text-sm font-medium">or continue with</span></div>
            </div>

            <button className="w-full py-3.5 rounded-lg bg-transparent border border-white/[0.12] text-white font-medium text-sm flex items-center justify-center gap-3 hover:bg-white/[0.04] transition-all cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>

            <p className="text-center text-dark-400 text-sm mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold no-underline transition-colors">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
