import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, UserPlus, User, Plane, Check, X } from 'lucide-react';
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
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 relative page-transition">
      <div className="absolute inset-0">
        <div className="glow-dot w-[500px] h-[500px] bg-accent-600 top-[-200px] left-[-100px]" />
        <div className="glow-dot w-[400px] h-[400px] bg-primary-600 bottom-[-100px] right-[-100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-white">Create Account</h1>
            <p className="text-dark-400 text-sm mt-1">Start planning your trips with AI</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-dark-300 font-medium mb-1.5 block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field !pl-11" placeholder="Your full name" />
              </div>
            </div>

            <div>
              <label className="text-sm text-dark-300 font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field !pl-11" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="text-sm text-dark-300 font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2" />
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
              <div className="relative">
                <Lock className="w-4 h-4 text-dark-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field !pl-11"
                  placeholder="Confirm your password"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-error-500 text-xs mt-1">Passwords don't match</p>
              )}
            </div>

            <label className="flex items-start gap-2 text-sm text-dark-400 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 rounded border-dark-600 bg-dark-800 text-primary-500" />
              <span>I agree to the <a href="#" className="text-primary-400 no-underline">Terms of Service</a> and <a href="#" className="text-primary-400 no-underline">Privacy Policy</a></span>
            </label>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center !py-3.5 disabled:opacity-50">
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
            <div className="relative flex justify-center"><span className="px-4 bg-dark-800/80 text-dark-500 text-sm">or</span></div>
          </div>

          <button className="w-full py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-dark-200 font-medium text-sm flex items-center justify-center gap-3 hover:bg-white/[0.08] transition-all cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-dark-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium no-underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
