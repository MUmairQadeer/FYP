import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, LogIn, UserPlus, LogOut, LayoutDashboard, User,
  ChevronDown, Sparkles, ShieldCheck, ArrowRight
} from 'lucide-react';
import { NAV_LINKS } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

import Logo from '../common/Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'glass shadow-2xl shadow-black/50' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Logo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1" style={{ margin: '0 24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 6px',
              background: 'rgba(14, 16, 24, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 9999,
              backdropFilter: 'blur(20px)',
            }}>
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      position: 'relative',
                      padding: '9px 20px',
                      borderRadius: 9999,
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      textDecoration: 'none',
                      color: isActive ? '#fff' : 'var(--color-dark-400)',
                      transition: 'color 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      zIndex: 1,
                    }}
                    className={!isActive ? 'hover:text-white' : ''}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 9999,
                          background: 'var(--color-primary-500)',
                          boxShadow: '0 4px 16px rgba(79, 124, 255, 0.35)',
                        }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 2 }}>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Auth / Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '4px 12px 4px 5px',
                    borderRadius: 9999,
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    background: showProfileMenu ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  className="hover:!bg-white/[0.08]"
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', padding: 2,
                      background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))',
                    }}>
                      <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        background: '#0E1018', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#fff', fontWeight: 700,
                        fontSize: '0.9375rem', fontFamily: 'var(--font-heading)', overflow: 'hidden',
                      }}>
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          user.name ? user.name.charAt(0).toUpperCase() : 'U'
                        )}
                      </div>
                    </div>
                    <span style={{
                      position: 'absolute', bottom: 0, right: 0, width: 10, height: 10,
                      borderRadius: '50%', background: 'var(--color-success-500)',
                      border: '2px solid #0A0C12',
                    }} />
                  </div>
                  <ChevronDown
                    style={{
                      width: 15, height: 15, color: 'var(--color-dark-400)',
                      transition: 'transform 0.25s ease',
                      transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                        width: 300, background: 'rgba(14, 16, 24, 0.97)',
                        border: '1px solid var(--color-border-dark)', borderRadius: 18,
                        backdropFilter: 'blur(24px)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                        padding: '12px', zIndex: 100,
                      }}
                    >
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 14,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)', marginBottom: 8,
                      }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: '50%', padding: 2, flexShrink: 0,
                          background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: '100%', height: '100%', borderRadius: '50%', background: '#0E1018',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: '1.125rem',
                            fontFamily: 'var(--font-heading)', overflow: 'hidden',
                          }}>
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              user.name ? user.name.charAt(0).toUpperCase() : 'U'
                            )}
                          </div>
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9375rem', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }} className="truncate">
                            {user.name}
                          </div>
                          <div style={{ color: 'var(--color-dark-400)', fontSize: '0.75rem' }} className="truncate">
                            {user.email}
                          </div>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6,
                            padding: '2px 8px', borderRadius: 9999, background: 'rgba(79,124,255,0.12)',
                            border: '1px solid rgba(79,124,255,0.25)', color: 'var(--color-primary-400)',
                            fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                          }}>
                            <ShieldCheck style={{ width: 10, height: 10 }} /> Pro Member
                          </div>
                        </div>
                      </div>

                      <Link to="/dashboard" style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                        borderRadius: 12, textDecoration: 'none', color: 'var(--color-dark-200)',
                        fontWeight: 600, fontSize: '0.875rem', transition: 'background 0.2s',
                      }} className="hover:!bg-white/[0.06] group">
                        <LayoutDashboard style={{ width: 17, height: 17, color: 'var(--color-primary-400)', flexShrink: 0 }} />
                        Dashboard
                        <ArrowRight style={{ width: 13, height: 13, marginLeft: 'auto', color: 'var(--color-dark-500)' }} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                      <Link to="/profile" style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                        borderRadius: 12, textDecoration: 'none', color: 'var(--color-dark-200)',
                        fontWeight: 600, fontSize: '0.875rem', transition: 'background 0.2s',
                      }} className="hover:!bg-white/[0.06] group">
                        <User style={{ width: 17, height: 17, color: 'var(--color-primary-400)', flexShrink: 0 }} />
                        Profile Settings
                        <ArrowRight style={{ width: 13, height: 13, marginLeft: 'auto', color: 'var(--color-dark-500)' }} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

                      <button onClick={logout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 14px', borderRadius: 12, background: 'transparent',
                        border: 'none', cursor: 'pointer', color: 'var(--color-error-400)',
                        fontWeight: 600, fontSize: '0.875rem', transition: 'background 0.2s',
                        textAlign: 'left',
                      }} className="hover:!bg-error-500/10">
                        <LogOut style={{ width: 17, height: 17, flexShrink: 0 }} />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !py-2.5 !px-5 !text-sm no-underline !rounded-full">
                  <LogIn className="w-4 h-4" />
                  Log In
                </Link>
                <Link to="/register" className="btn-primary !py-2.5 !px-5 !text-sm no-underline !rounded-full">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-dark-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="lg:hidden glass border-t border-white/[0.08] overflow-hidden"
          >
            <div className="px-5 py-5 space-y-2">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all no-underline ${
                      isActive
                        ? 'bg-primary-500/15 text-white border border-primary-500/30'
                        : 'text-dark-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />}
                    {link.label}
                  </Link>
                );
              })}

              {user ? (
                <div className="pt-4 border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-11 h-11 rounded-xl p-[2px] bg-gradient-to-tr from-primary-400 to-primary-600 shrink-0">
                      <div className="w-full h-full rounded-[8px] bg-slate-900 flex items-center justify-center text-white font-bold text-base font-heading">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate font-heading">{user.name}</p>
                      <p className="text-xs text-dark-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-dark-300 hover:text-white hover:bg-white/[0.06] transition-colors no-underline">
                    <LayoutDashboard className="w-4 h-4 text-primary-400" />
                    Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-dark-300 hover:text-white hover:bg-white/[0.06] transition-colors no-underline">
                    <User className="w-4 h-4 text-primary-400" />
                    Profile Settings
                  </Link>
                  <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-error-400 hover:bg-error-500/10 border border-error-500/20 transition-colors text-left cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/[0.08] flex gap-3">
                  <Link to="/login" className="btn-secondary !py-2.5 !text-sm flex-1 justify-center no-underline !rounded-xl">
                    Log In
                  </Link>
                  <Link to="/register" className="btn-primary !py-2.5 !text-sm flex-1 justify-center no-underline !rounded-xl">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
