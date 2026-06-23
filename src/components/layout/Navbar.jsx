import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Plane, LogIn, UserPlus, LogOut, LayoutDashboard, User } from 'lucide-react';
import { NAV_LINKS } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group no-underline">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-40 blur-lg group-hover:opacity-60 transition-opacity" />
            </div>
            <div>
              <span className="text-lg font-bold font-heading text-white tracking-tight">
                Trip<span className="text-primary-400">Planner</span>
              </span>
              <span className="hidden sm:block text-[10px] text-dark-400 -mt-1 tracking-widest uppercase">
                AI Powered
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1" style={{ gap: '16px', margin: '0 48px' }}>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative rounded-lg text-sm font-medium transition-all duration-300 no-underline ${
                    isActive
                      ? 'text-white'
                      : 'text-dark-400 hover:text-white'
                  }`}
                  style={{ padding: '8px 16px', display: 'block' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/[0.08] rounded-lg"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth / User Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.06] cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 glass-card !p-2 shadow-xl border border-white/[0.08]"
                    >
                      <div className="px-3 py-2 border-b border-white/[0.06] mb-2">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-dark-400 truncate">{user.email}</p>
                      </div>
                      
                      <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors no-underline">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors no-underline">
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      <div className="h-px bg-white/[0.06] my-2" />
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-error-500 hover:bg-error-500/10 rounded-lg transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !py-2 !px-5 !text-sm no-underline">
                  <LogIn className="w-4 h-4" />
                  Log In
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-5 !text-sm no-underline">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-dark-300 hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                      isActive
                        ? 'bg-white/[0.08] text-white'
                        : 'text-dark-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {user ? (
                <div className="pt-3 border-t border-white/[0.06] space-y-1">
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-dark-400">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error-500 hover:bg-error-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-white/[0.06] flex gap-3">
                  <Link to="/login" className="btn-secondary !py-2 !text-sm flex-1 justify-center no-underline">
                    Log In
                  </Link>
                  <Link to="/register" className="btn-primary !py-2 !text-sm flex-1 justify-center no-underline">
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
