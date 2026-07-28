import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Plane, Sparkles, Shield, Zap, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import Logo from '../components/common/Logo';

/* ── Floating Boarding Pass ── */
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
      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 180, height: 180, borderRadius: '50%',
        background: 'rgba(59,130,246,0.18)', filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
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

      {/* Route */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1, margin: 0 }}>JFK</p>
          <p style={{ fontSize: '0.68rem', color: '#475569', marginTop: 3 }}>New York, US</p>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 14px', position: 'relative' }}>
          <div style={{ width: '100%', borderTop: '2px dashed rgba(255,255,255,0.1)' }} />
          <Plane style={{ width: 14, height: 14, color: '#60a5fa', position: 'absolute', transform: 'rotate(90deg)' }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1, margin: 0 }}>HND</p>
          <p style={{ fontSize: '0.68rem', color: '#475569', marginTop: 3 }}>Tokyo, JP</p>
        </div>
      </div>

      {/* Dashed divider */}
      <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', marginBottom: 16 }} />

      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px' }}>
        {[
          { label: 'Passenger',   value: 'Umair Qadeer',      align: 'left',  color: 'white' },
          { label: 'Cabin Class', value: 'AI Business Class', align: 'right', color: '#60a5fa' },
          { label: 'Date',        value: 'June 24, 2026',     align: 'left',  color: 'white' },
          { label: 'Smart Seat',  value: 'Seat AI-08',        align: 'right', color: '#F59E0B' },
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

/* ── Feature Pills ── */
const features = [
  { icon: Zap,    label: 'AI Itineraries in seconds' },
  { icon: Globe,  label: '195 Countries supported' },
  { icon: Shield, label: 'Secure & private' },
];

/* ── Main Login Page ── */
export default function Login() {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const { login, googleLogin, isLoading }          = useAuth();
  const navigate                      = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        // Exchange the access token for user info, then send id_token to backend
        // For implicit flow, we get an access_token. We need to use the credential flow instead.
        // Let's use the Google userinfo endpoint to get user details
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        
        // Send to our backend
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
        if (!res.ok) throw new Error(data.message || 'Google login failed');

        localStorage.setItem('token', data.token);
        toast.success('Welcome!');
        navigate('/dashboard');
        // Reload to update auth state
        window.location.reload();
      } catch (err) {
        setError(err.message || 'Google login failed');
      }
    },
    onError: () => {
      setError('Google login failed. Please try again.');
    },
  });

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-dark-950)',
    }}>

      {/* ══ LEFT PANEL (hidden on mobile) ══ */}
      <div style={{
        display: 'none',
        flex: '0 0 44%',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        background: 'var(--color-dark-900)',
      }}
        className="login-left-panel"
      >
        {/* Background glows */}
        <div style={{
          position: 'absolute', top: -160, left: -160,
          width: 480, height: 480, borderRadius: '50%',
          background: 'rgba(59,130,246,0.12)', filter: 'blur(80px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, right: -100,
          width: 340, height: 340, borderRadius: '50%',
          background: 'rgba(245,158,11,0.07)', filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          height: '100%', padding: '48px 48px',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '104px', /* 72px navbar + 32px breathing room */
        }}>
          {/* Top text */}
          <div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'white',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}>
              Plan your next<br />
              <span style={{ color: 'var(--color-brand-blue)' }}>great adventure.</span>
            </h2>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.95rem', lineHeight: 1.7,
              maxWidth: 340, marginBottom: 36,
            }}>
              Join thousands of travelers using AI to generate perfectly
              tailored itineraries for any destination in the world.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {features.map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(59,130,246,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 15, height: 15, color: '#60a5fa' }} />
                  </div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Boarding Pass card */}
          <MockBoardingPass />
        </div>
      </div>

      {/* ══ RIGHT PANEL ══ */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px 48px', /* top: 72px nav + 28px breathing room */
        position: 'relative',
        overflowY: 'auto',
      }}>
        {/* Background glows (visible on mobile) */}
        <div style={{
          position: 'absolute', top: -100, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(59,130,246,0.08)', filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}
        >
          {/* Mobile-only logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }} className="login-mobile-logo">
            <Logo size="lg" />
          </div>

          {/* Form card */}
          <div style={{
            background: 'var(--color-secondary-dark)',
            border: '1px solid var(--color-border-dark)',
            borderRadius: 20,
            padding: '36px 36px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
          }}>
            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h1 style={{
                fontSize: '1.6rem', fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                color: 'white', marginBottom: 6,
                letterSpacing: '-0.01em',
              }}>
                Welcome Back
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Sign in to continue planning your trips
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: 20, padding: '12px 16px', borderRadius: 10,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Sparkles style={{ width: 14, height: 14, flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block', fontSize: '0.8rem', fontWeight: 600,
                  color: 'var(--color-text-secondary)', marginBottom: 8,
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    width: 16, height: 16, color: 'var(--color-text-muted)',
                  }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                    style={{ paddingLeft: 42 }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{
                  display: 'block', fontSize: '0.8rem', fontWeight: 600,
                  color: 'var(--color-text-secondary)', marginBottom: 8,
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    width: 16, height: 16, color: 'var(--color-text-muted)',
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="••••••••"
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--color-text-muted)', padding: 0,
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: 'var(--color-text-secondary)', fontSize: '0.82rem', cursor: 'pointer',
                }}>
                  <input type="checkbox" style={{ width: 15, height: 15, accentColor: 'var(--color-brand-blue)', cursor: 'pointer' }} />
                  Remember me
                </label>
                <Link to="/forgot-password" style={{
                  color: 'var(--color-brand-blue)', fontSize: '0.82rem',
                  fontWeight: 600, textDecoration: 'none',
                }}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{
                  width: '100%', justifyContent: 'center',
                  padding: '14px', fontSize: '0.95rem',
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  marginTop: 4,
                }}
              >
                {isLoading ? (
                  <div style={{
                    width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                  }} className="animate-spin" />
                ) : (
                  <>
                    <LogIn style={{ width: 16, height: 16 }} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ position: 'relative', margin: '22px 0' }}>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
              <span style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'var(--color-secondary-dark)',
                padding: '0 12px',
                color: 'var(--color-text-muted)', fontSize: '0.78rem',
                whiteSpace: 'nowrap',
              }}>
                or continue with
              </span>
            </div>

            {/* Google button */}
            <button
              onClick={() => handleGoogleLogin()}
              style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
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

            {/* Sign up link */}
            <p style={{
              textAlign: 'center', color: 'var(--color-text-secondary)',
              fontSize: '0.85rem', marginTop: 22,
            }}>
              Don't have an account?{' '}
              <Link to="/register" style={{
                color: 'var(--color-brand-blue)', fontWeight: 700, textDecoration: 'none',
              }}>
                Sign up free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 1024px) {
          .login-left-panel { display: flex !important; flex-direction: column; }
          .login-mobile-logo { display: none !important; }
        }
        @media (max-width: 480px) {
          .login-form-card { padding: 24px 20px !important; }
        }
      `}</style>
    </div>
  );
}
