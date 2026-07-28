import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Plane, LogIn, UserPlus, LogOut, LayoutDashboard, User,
  ChevronDown, Sparkles, Heart, Compass, ShieldCheck, Settings, ArrowRight
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

  // Click outside to close profile menu
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-2xl shadow-black/50 border-b border-white/[0.08]'
          : 'bg-transparent'
      }`}
    >
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
          
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links Dock */}
          <div className="hidden lg:flex items-center justify-center flex-1" style={{ margin: '0 32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              background: 'rgba(15, 17, 23, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      position: 'relative',
                      padding: '9px 22px',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 600,
                      textDecoration: 'none',
                      color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                      transition: 'all 0.25s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                    className={!isActive ? 'hover:!text-white' : ''}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '9999px',
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(29, 78, 216, 0.18) 100%)',
                          border: '1px solid rgba(59, 130, 246, 0.45)',
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
                          zIndex: 0,
                        }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                      />
                    )}

                    {isActive && (
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--color-brand-blue)',
                        boxShadow: '0 0 10px #3B82F6',
                        position: 'relative',
                        zIndex: 10,
                      }} />
                    )}

                    <span style={{ position: 'relative', zIndex: 10 }}>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop User Profile Button & Dropdown */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                {/* Trigger Button */}
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '6px 16px 6px 8px',
                    borderRadius: 9999,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    background: showProfileMenu ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    border: showProfileMenu ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: showProfileMenu ? '0 0 24px rgba(59, 130, 246, 0.25)' : 'none',
                  }}
                  className="hover:!bg-white/[0.08] hover:!border-white/20"
                >
                  {/* Avatar Ring */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      padding: 2,
                      background: 'linear-gradient(135deg, #3B82F6 0%, #F59E0B 50%, #8B5CF6 100%)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: '#0F1117',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1rem',
                        fontFamily: 'var(--font-heading)',
                        overflow: 'hidden',
                      }}>
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          user.name ? user.name.charAt(0).toUpperCase() : 'U'
                        )}
                      </div>
                    </div>
                    {/* Status Dot */}
                    <span style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      background: '#10B981',
                      border: '2px solid #090B10',
                    }} />
                  </div>

                  {/* Name & Role Text */}
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }} className="truncate">
                      {user.name ? user.name.split(' ')[0] : 'User'}
                    </div>
                    <div style={{ color: '#60A5FA', fontSize: '0.7rem', fontWeight: 600, marginTop: 2 }} className="truncate">
                      PRO Traveler
                    </div>
                  </div>

                  {/* Chevron Arrow */}
                  <ChevronDown
                    style={{
                      width: 16,
                      height: 16,
                      color: showProfileMenu ? '#60A5FA' : 'var(--color-text-secondary)',
                      transition: 'transform 0.3s ease',
                      transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                      marginLeft: 4,
                    }}
                  />
                </button>

                {/* Luxury Profile Dropdown Menu */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 14, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 12px)',
                        width: '320px',
                        background: 'rgba(15, 17, 23, 0.96)',
                        border: '1px solid var(--color-border-dark)',
                        borderRadius: '24px',
                        backdropFilter: 'blur(28px)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 36px rgba(59,130,246,0.15)',
                        padding: '20px',
                        zIndex: 100,
                        overflow: 'hidden',
                      }}
                    >
                      {/* Ambient Backdrop Glow Orbs */}
                      <div style={{ position: 'absolute', top: -50, right: -50, width: 140, height: 140, background: 'rgba(59, 130, 246, 0.15)', borderRadius: '50%', filter: 'blur(35px)', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', bottom: -50, left: -50, width: 120, height: 120, background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />

                      {/* Header User Card */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '16px',
                        borderRadius: 18,
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        marginBottom: 16,
                        position: 'relative',
                        zIndex: 10,
                      }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: 16,
                          padding: 2,
                          background: 'linear-gradient(135deg, #3B82F6 0%, #F59E0B 50%, #8B5CF6 100%)',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 14,
                            background: '#0F1117',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '1.25rem',
                            fontFamily: 'var(--font-heading)',
                            overflow: 'hidden',
                          }}>
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              user.name ? user.name.charAt(0).toUpperCase() : 'U'
                            )}
                          </div>
                        </div>

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', fontFamily: 'var(--font-heading)', lineHeight: 1.2, margin: 0 }} className="truncate">
                              {user.name}
                            </h4>
                            <Sparkles style={{ width: 14, height: 14, color: '#F59E0B', flexShrink: 0 }} />
                          </div>

                          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', margin: '0 0 6px 0', lineHeight: 1.3 }} className="truncate">
                            {user.email}
                          </p>

                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 9999,
                            background: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            color: '#10B981',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                          }}>
                            <ShieldCheck style={{ width: 11, height: 11 }} />
                            <span>Pro Member</span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Item Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 10 }}>
                        <Link
                          to="/dashboard"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '12px 14px',
                            borderRadius: 14,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          className="hover:!bg-white/[0.06] group"
                        >
                          <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: 12,
                            background: 'rgba(59, 130, 246, 0.12)',
                            border: '1px solid rgba(59, 130, 246, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#60A5FA',
                            flexShrink: 0,
                          }}>
                            <LayoutDashboard style={{ width: 18, height: 18 }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-heading)' }}>
                              Dashboard
                            </div>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: 1 }}>
                              Manage trips & itineraries
                            </div>
                          </div>
                          <ArrowRight style={{ width: 14, height: 14, color: 'var(--color-dark-500)' }} className="group-hover:!text-blue-400 group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                          to="/profile"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '12px 14px',
                            borderRadius: 14,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          className="hover:!bg-white/[0.06] group"
                        >
                          <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: 12,
                            background: 'rgba(139, 92, 246, 0.12)',
                            border: '1px solid rgba(139, 92, 246, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#C084FC',
                            flexShrink: 0,
                          }}>
                            <User style={{ width: 18, height: 18 }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-heading)' }}>
                              Profile Settings
                            </div>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: 1 }}>
                              Account & preferences
                            </div>
                          </div>
                          <ArrowRight style={{ width: 14, height: 14, color: 'var(--color-dark-500)' }} className="group-hover:!text-purple-400 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      </div>

                      {/* Divider */}
                      <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.08)', margin: '14px 0', position: 'relative', zIndex: 10 }} />

                      {/* Log Out Action */}
                      <button
                        onClick={logout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '12px 14px',
                          borderRadius: 14,
                          border: '1px solid transparent',
                          background: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        className="hover:!bg-rose-500/10 hover:!border-rose-500/25 group"
                      >
                        <div style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          background: 'rgba(244, 63, 94, 0.12)',
                          border: '1px solid rgba(244, 63, 94, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FB7185',
                          flexShrink: 0,
                        }}>
                          <LogOut style={{ width: 18, height: 18 }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                          <div style={{ color: '#FB7185', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-heading)' }}>
                            Log Out
                          </div>
                          <div style={{ color: 'rgba(251, 113, 133, 0.7)', fontSize: '0.75rem', marginTop: 1 }}>
                            Sign out of session
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !py-2.5 !px-5 !text-sm no-underline !rounded-xl">
                  <LogIn className="w-4 h-4" />
                  Log In
                </Link>
                <Link to="/register" className="btn-primary !py-2.5 !px-5 !text-sm no-underline !rounded-xl">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass border-t border-white/[0.08] overflow-hidden"
          >
            <div className="px-6 py-5 space-y-2">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all no-underline ${
                      isActive
                        ? 'bg-white/[0.08] text-white border border-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {user ? (
                <div className="pt-4 border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-11 h-11 rounded-xl p-[2px] bg-gradient-to-tr from-blue-500 via-amber-400 to-indigo-500 shrink-0">
                      <div className="w-full h-full rounded-[8px] bg-slate-900 flex items-center justify-center text-white font-extrabold text-base font-heading">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate font-heading">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors no-underline"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors no-underline"
                  >
                    <User className="w-4 h-4 text-purple-400" />
                    Profile Settings
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors text-left cursor-pointer"
                  >
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
