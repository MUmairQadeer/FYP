import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, UserPlus, User, Plane,
  Check, X, Sparkles, Star, Map, Cpu,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import Logo from '../components/common/Logo';

/* ── Password Strength ── */
function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase',    met: /[A-Z]/.test(password) },
    { label: 'Contains number',       met: /\d/.test(password) },
    { label: 'Contains symbol',       met: /[!@#$%^&*]/.test(password) },
  ];
  const strength = checks.filter(c => c.met).length;
  const barColors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981'];

  if (!password) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i < strength ? barColors[strength - 1] : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {checks.map(({ label, met }) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: '0.72rem',
            color: met ? '#10B981' : '#475569',
          }}>
            {met
              ? <Check style={{ width: 11, height: 11 }} />
              : <X style={{ width: 11, height: 11 }} />}
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Boarding Pass ── */
function MockBoardingPass() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        background: 'rgba(26,29,39,0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: '24px 28px',
        width: '100%',
        maxWidth: 340,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 180, height: 180, borderRadius: '50%',
        background: 'rgba(245,158,11,0.15)', filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Plane style={{ width: 14, height: 14, color: '#60a5fa' }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8' }}>
            AI Boarding Pass
          </span>
        </div>
        <span style={{
          fontSize: '0.65rem', color: '#10B981', fontWeight: 700,
          background: 'rgba(16,185,129,0.12)', padding: '3px 10px', borderRadius: 999,
          border: '1px solid rgba(16,185,129,0.2)',
        }}>
          Confirmed
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1, margin: 0 }}>LHE</p>
          <p style={{ fontSize: '0.68rem', color: '#475569', marginTop: 3 }}>Lahore, PK</p>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 14px', position: 'relative' }}>
          <div style={{ width: '100%', borderTop: '2px dashed rgba(255,255,255,0.1)' }} />
          <Plane style={{ width: 14, height: 14, color: '#F59E0B', position: 'absolute', transform: 'rotate(90deg)' }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1, margin: 0 }}>CDG</p>
          <p style={{ fontSize: '0.68rem', color: '#475569', marginTop: 3 }}>Paris, FR</p>
        </div>
      </div>

      <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', marginBottom: 16 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px' }}>
        {[
          { label: 'Passenger',   value: 'Umair Qadeer',   align: 'left',  color: 'white' },
          { label: 'Cabin Class', value: 'AI First Class', align: 'right', color: '#60a5fa' },
          { label: 'Date',        value: 'June 24, 2026',  align: 'left',  color: 'white' },
          { label: 'Smart Seat',  value: 'Seat AI-01',     align: 'right', color: '#F59E0B' },
        ].map(({ label, value, align, color }) => (
          <div key={label} style={{ textAlign: align }}>
            <p style={{ fontSize: '0.6rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Feature bullets ── */
const features = [
  { icon: Cpu,  label: 'AI itinerary in under 10 seconds' },
  { icon: Map,  label: '195 countries, 150+ currencies' },
  { icon: Star, label: 'Free forever — no credit card' },
];

/* ── Main Register Page ── */
export default function Register() {
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [error, setError]                   = useState('');
  const [agreed, setAgreed]                 = useState(false);
  const { register, isLoading }             = useAuth();
  const navigate                            = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password !== confirmPassword)  { setError('Passwords do not match'); return; }
    if (password.length < 8)           { setError('Password must be at least 8 characters'); return; }
    if (!agreed)                       { setError('Please agree to the terms'); return; }
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();

        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const res = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: tokenResponse.access_token,
            googleUser: {
              googleId: userInfo.sub,
              email: userInfo.email,
              name: userInfo.name,
            },
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Google sign-up failed');

        localStorage.setItem('token', data.token);
        toast.success('Account created successfully!');
        navigate('/dashboard');
        window.location.reload();
      } catch (err) {
        setError(err.message || 'Google sign-up failed');
      }
    },
    onError: () => {
      setError('Google sign-up failed. Please try again.');
    },
  });

  const inputIcon = (Icon) => ({
    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
    width: 16, height: 16, color: 'var(--color-text-muted)',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-dark-950)' }}>

      {/* ══ LEFT PANEL ══ */}
      <div
        className="register-left-panel"
        style={{
          display: 'none',
          flex: '0 0 44%',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          background: 'var(--color-dark-900)',
        }}
      >
        {/* Glows */}
        <div style={{ position: 'absolute', top: -160, left: -160, width: 480, height: 480, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 320, height: 320, borderRadius: '50%', background: 'rgba(59,130,246,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1, height: '100%',
          padding: '48px', paddingTop: '104px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)',
              fontWeight: 800, fontFamily: 'var(--font-heading)',
              color: 'white', lineHeight: 1.2,
              letterSpacing: '-0.02em', marginBottom: 16,
            }}>
              Start your journey<br />
              <span style={{ color: '#F59E0B' }}>with AI today.</span>
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.95rem', lineHeight: 1.7,
              maxWidth: 340, marginBottom: 36,
            }}>
              Create a free account to generate infinite itineraries,
              track your budget, and explore 195 countries.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {features.map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(245,158,11,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 15, height: 15, color: '#F59E0B' }} />
                  </div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <MockBoardingPass />
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 48px',
        position: 'relative', overflowY: 'auto',
      }}>
        {/* Mobile glow */}
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 360, height: 360, borderRadius: '50%',
          background: 'rgba(245,158,11,0.07)', filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}
        >
          {/* Mobile-only logo */}
          <div style={{ textAlign: 'center', marginBottom: 24 }} className="register-mobile-logo">
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, #F59E0B, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
            }}>
              <Plane style={{ width: 24, height: 24, color: 'white' }} />
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Create your TripPlanner AI account</p>
          </div>

          {/* Form Card */}
          <div style={{
            background: 'var(--color-secondary-dark)',
            border: '1px solid var(--color-border-dark)',
            borderRadius: 20, padding: '36px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
          }}>
            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h1 style={{
                fontSize: '1.6rem', fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                color: 'white', marginBottom: 6, letterSpacing: '-0.01em',
              }}>
                Create Account
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Start planning your trips with AI
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: 18, padding: '12px 16px', borderRadius: 10,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Sparkles style={{ width: 14, height: 14, flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={inputIcon(User)} />
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    className="input-field" placeholder="Your full name"
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={inputIcon(Mail)} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input-field" placeholder="you@example.com"
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={inputIcon(Lock)} />
                  <input
                    type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field" placeholder="Create a strong password"
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-muted)', padding: 0, display: 'flex', alignItems: 'center',
                  }}>
                    {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={inputIcon(Lock)} />
                  <input
                    type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input-field" placeholder="Confirm your password"
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-muted)', padding: 0, display: 'flex', alignItems: 'center',
                  }}>
                    {showConfirm ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <X style={{ width: 11, height: 11 }} /> Passwords don't match
                  </p>
                )}
              </div>

              {/* Terms */}
              <label style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontSize: '0.82rem', color: 'var(--color-text-secondary)', cursor: 'pointer',
              }}>
                <input
                  type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  style={{ width: 15, height: 15, marginTop: 2, accentColor: 'var(--color-brand-blue)', cursor: 'pointer', flexShrink: 0 }}
                />
                <span>
                  I agree to the{' '}
                  <a href="#" style={{ color: 'var(--color-brand-blue)', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: 'var(--color-brand-blue)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit" disabled={isLoading}
                className="btn-primary"
                style={{
                  width: '100%', justifyContent: 'center',
                  padding: '14px', fontSize: '0.95rem', marginTop: 4,
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? (
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" />
                ) : (
                  <><UserPlus style={{ width: 16, height: 16 }} /> Create Account</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ position: 'relative', margin: '20px 0' }}>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
              <span style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'var(--color-secondary-dark)', padding: '0 12px',
                color: 'var(--color-text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap',
              }}>
                or continue with
              </span>
            </div>

            {/* Google */}
            <button
              onClick={() => handleGoogleLogin()}
              style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', fontWeight: 600, fontSize: '0.875rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>

            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: 20 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-brand-blue)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .register-left-panel { display: flex !important; flex-direction: column; }
          .register-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}
