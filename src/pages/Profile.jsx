import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, Shield, Bell, Globe, Wallet, Sparkles, Check,
  Camera, Key, Award, Save, Sliders, Moon, Sun,
  CreditCard, CheckCircle2, AlertCircle, ChevronRight, Zap, Upload, Trash2, Edit2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Preset luxury avatars
const PRESET_AVATARS = [
  { id: '1', name: 'Explorer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { id: '2', name: 'Pilot', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { id: '3', name: 'Nomad', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
  { id: '4', name: 'Adventurer', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
  { id: '5', name: 'Captain', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80' },
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const fileInputRef = useRef(null);

  // Real user data state
  const [name, setName] = useState(user?.name || 'Umair');
  const [email, setEmail] = useState(user?.email || 'muhammadumair.coding@gmail.com');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);

  // Preference fields
  const [currency, setCurrency] = useState(user?.defaultCurrency || 'USD');
  const [travelStyle, setTravelStyle] = useState(user?.travelStyle || 'Luxury');
  const [dietary, setDietary] = useState('Halal Food Only');
  const [travelPace, setTravelPace] = useState('Moderate');

  // Toggle states
  const [toggles, setToggles] = useState({
    autoOptimize: true,
    aiSuggestions: true,
    emailAlerts: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingName, setSavingName] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingBoth, setSavingBoth] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Keep local inputs synchronized whenever user context changes
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.avatarUrl !== undefined) setAvatarUrl(user.avatarUrl);
      if (user.defaultCurrency) setCurrency(user.defaultCurrency);
      if (user.travelStyle) setTravelStyle(user.travelStyle);
    }
  }, [user]);

  // Profile Picture Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result;
      setAvatarUrl(base64Url);
      await updateProfile({ avatarUrl: base64Url });
      toast.success('Profile picture updated!', { icon: '📸' });
    };
    reader.readAsDataURL(file);
  };

  // Preset Avatar Select Handler
  const handlePresetSelect = async (url) => {
    setAvatarUrl(url);
    await updateProfile({ avatarUrl: url });
    toast.success('Avatar updated!', { icon: '✨' });
  };

  // Remove Profile Picture Handler
  const handleRemovePhoto = async () => {
    setAvatarUrl(null);
    await updateProfile({ avatarUrl: null });
    toast.success('Profile picture removed');
  };

  // ── 1. SAVE NAME SEPARATELY ──
  const handleSaveName = async (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setSavingName(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success(`Display name updated to "${name.trim()}"!`, {
        style: {
          background: 'rgba(15, 17, 23, 0.95)',
          color: '#fff',
          border: '1px solid rgba(79, 124, 255, 0.4)',
          backdropFilter: 'blur(16px)',
        },
        icon: '👤'
      });
    } catch (err) {
      toast.error('Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  // ── 2. SAVE EMAIL SEPARATELY ──
  const handleSaveEmail = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSavingEmail(true);
    try {
      await updateProfile({ email: email.trim() });
      toast.success(`Email updated to "${email.trim()}"!`, {
        style: {
          background: 'rgba(15, 17, 23, 0.95)',
          color: '#fff',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          backdropFilter: 'blur(16px)',
        },
        icon: '✉️'
      });
    } catch (err) {
      toast.error('Failed to update email');
    } finally {
      setSavingEmail(false);
    }
  };

  // ── 3. SAVE BOTH NAME & EMAIL ──
  const handleSaveBoth = async (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSavingBoth(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
      });
      toast.success('Name and Email updated successfully!', {
        style: {
          background: 'rgba(15, 17, 23, 0.95)',
          color: '#fff',
          border: '1px solid rgba(79, 124, 255, 0.4)',
          backdropFilter: 'blur(16px)',
        },
        icon: '✨'
      });
    } catch (err) {
      toast.error('Failed to save profile changes');
    } finally {
      setSavingBoth(false);
    }
  };

  // ── 4. SAVE PASSWORD ──
  const handleSavePassword = async (e) => {
    e?.preventDefault();
    if (!passwordData.newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSavingPassword(true);
    try {
      await updateProfile({ password: passwordData.newPassword });
      toast.success('Password updated successfully!', { icon: '🔒' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error('Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  // ── 5. SAVE PREFERENCES ──
  const handleSavePreferences = async (e) => {
    e?.preventDefault();
    try {
      await updateProfile({
        defaultCurrency: currency,
        travelStyle: travelStyle,
      });
      toast.success('Travel preferences saved!', { icon: '🎯' });
    } catch (err) {
      toast.error('Failed to save preferences');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account & Security', icon: Shield, desc: 'Photo, name, email & password' },
    { id: 'preferences', label: 'Travel Preferences', icon: Sliders, desc: 'Currency & travel style' },
    { id: 'notifications', label: 'AI & Notifications', icon: Bell, desc: 'Concierge alerts & AI options' },
    { id: 'membership', label: 'Pro Membership', icon: Award, desc: 'Subscription status & benefits' },
  ];

  return (
    <div
      className="page-transition"
      style={{ minHeight: '100vh', background: 'var(--color-dark-950)', color: 'var(--color-text-primary)', paddingTop: '108px', paddingBottom: '104px' }}
    >
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="container-custom" style={{ maxWidth: 1320 }}>

        {/* ── Luxury Header Banner Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 36,
            background: 'var(--color-secondary-dark)',
            border: '1px solid var(--color-border-dark)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
            padding: '36px 44px',
          }}
        >
          {/* Ambient Glow Backdrop Orbs */}
          <div style={{ position: 'absolute', top: -100, right: -100, width: 450, height: 450, borderRadius: '50%', background: 'rgba(79, 124, 255, 0.12)', filter: 'blur(100px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(79, 124, 255, 0.08)', filter: 'blur(100px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap' }}>
            
            {/* User Profile Banner Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              {/* Avatar Ring */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 92,
                  height: 92,
                  borderRadius: '50%',
                  padding: 3,
                  background: 'linear-gradient(135deg, var(--color-primary-400) 0%, var(--color-primary-600) 100%)',
                  boxShadow: '0 8px 24px rgba(79,124,255,0.35)',
                  overflow: 'hidden',
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
                    fontWeight: 700,
                    fontSize: '2.25rem',
                    fontFamily: 'var(--font-heading)',
                    overflow: 'hidden',
                  }}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      name ? name.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--color-brand-blue)',
                    border: '3px solid #0F1117',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    transition: 'transform 0.2s',
                  }}
                  className="hover:scale-110"
                  title="Upload New Profile Picture"
                >
                  <Camera style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <h1 style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    color: 'white',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    margin: 0,
                  }}>
                    {user?.name || name}
                  </h1>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 12px',
                    borderRadius: 9999,
                    background: 'rgba(79, 124, 255, 0.12)',
                    border: '1px solid rgba(79, 124, 255, 0.25)',
                    color: 'var(--color-primary-400)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    <Sparkles style={{ width: 12, height: 12 }} />
                    PRO Explorer
                  </span>
                </div>

                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginBottom: 12 }}>
                  {user?.email || email}
                </p>

                {/* Account Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Shield style={{ width: 13, height: 13, color: '#10B981' }} /> Verified Account
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Zap style={{ width: 13, height: 13, color: 'var(--color-primary-400)' }} /> GPT-4o Engine Active
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '16px 28px',
              background: 'rgba(255,255,255,0.025)',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>14</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Trips Saved</div>
              </div>
              <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--color-primary-400)', fontWeight: 700, fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>8</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Countries</div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ── Main Layout: Sidebar Tabs Left & Form Right ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 32, alignItems: 'start' }} className="profile-grid">
          
          {/* LEFT COLUMN: Setting Navigation Tabs */}
          <div className="lg:!col-span-4" style={{ gridColumn: 'span 12' }}>
            <div style={{
              background: 'var(--color-secondary-dark)',
              border: '1px solid var(--color-border-dark)',
              borderRadius: 24,
              padding: '16px',
              boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 18px',
                      borderRadius: 18,
                      border: isActive ? '1px solid rgba(79, 124, 255, 0.4)' : '1px solid transparent',
                      background: isActive ? 'linear-gradient(135deg, rgba(79, 124, 255, 0.15) 0%, rgba(45, 92, 230, 0.1) 100%)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                    }}
                    className={!isActive ? 'hover:!bg-white/[0.04]' : ''}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: isActive ? 'var(--color-brand-blue)' : 'rgba(255,255,255,0.04)',
                      border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? 'white' : 'var(--color-text-secondary)',
                      flexShrink: 0,
                      boxShadow: isActive ? '0 4px 16px rgba(79, 124, 255, 0.4)' : 'none',
                    }}>
                      <TabIcon style={{ width: 18, height: 18 }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: isActive ? 'white' : 'var(--color-dark-200)', fontWeight: 700, fontSize: '0.9375rem', fontFamily: 'var(--font-heading)' }}>
                        {tab.label}
                      </div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: 1 }} className="truncate">
                        {tab.desc}
                      </div>
                    </div>

                    <ChevronRight style={{
                      width: 16,
                      height: 16,
                      color: isActive ? 'var(--color-brand-blue)' : 'var(--color-dark-500)',
                      opacity: isActive ? 1 : 0.5,
                    }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Tab Content Form */}
          <div className="lg:!col-span-8" style={{ gridColumn: 'span 12' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'var(--color-secondary-dark)',
                  border: '1px solid var(--color-border-dark)',
                  borderRadius: 24,
                  padding: '36px 40px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                }}
              >

                {/* ── TAB 1: Account & Security ── */}
                {activeTab === 'account' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    
                    {/* Sub-section 0: Profile Photo Upload Feature */}
                    <div style={{
                      padding: '24px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 18,
                    }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Camera style={{ width: 18, height: 18, color: 'var(--color-primary-400)' }} /> Profile Picture
                      </h4>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
                        Upload a custom portrait photo or choose from our luxury travel avatars
                      </p>

                      {/* Photo Actions Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-primary"
                          style={{ padding: '10px 20px', borderRadius: 12, fontSize: '0.875rem' }}
                        >
                          <Upload style={{ width: 15, height: 15 }} />
                          <span>Upload Custom Photo</span>
                        </button>

                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '10px 18px',
                              borderRadius: 12,
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              color: '#F87171',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                          >
                            <Trash2 style={{ width: 14, height: 14 }} />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>

                      {/* Preset Luxury Avatars */}
                      <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                          Or choose a luxury travel avatar
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                          {PRESET_AVATARS.map((avatar) => {
                            const isSelected = avatarUrl === avatar.url;
                            return (
                              <button
                                key={avatar.id}
                                type="button"
                                onClick={() => handlePresetSelect(avatar.url)}
                                style={{
                                  position: 'relative',
                                  width: 52,
                                  height: 52,
                                  borderRadius: '50%',
                                  padding: 2,
                                  background: isSelected ? 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))' : 'rgba(255,255,255,0.08)',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'transform 0.2s',
                                }}
                                className="hover:scale-110"
                                title={avatar.name}
                              >
                                <img
                                  src={avatar.url}
                                  alt={avatar.name}
                                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                {isSelected && (
                                  <div style={{
                                    position: 'absolute',
                                    bottom: -2,
                                    right: -2,
                                    width: 18,
                                    height: 18,
                                    borderRadius: '50%',
                                    background: '#10B981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    border: '2px solid #0F1117',
                                  }}>
                                    <Check style={{ width: 10, height: 10 }} />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

                    {/* Sub-section 1: REAL NAME & EMAIL EDIT (SUPPORT SEPARATE & TOGETHER UPDATES) */}
                    <div>
                      <div style={{ marginBottom: 20 }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>
                          Personal Profile Details
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                          You can change your name, email, or both separately using the dedicated action buttons below
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        
                        {/* ── CARD A: CHANGE NAME SEPARATELY ── */}
                        <div style={{
                          padding: '24px',
                          background: 'rgba(255,255,255,0.025)',
                          borderRadius: 18,
                          border: '1px solid rgba(255,255,255,0.07)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 16,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                            <label style={{ color: 'white', fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <User style={{ width: 18, height: 18, color: 'var(--color-primary-400)' }} /> Full Name
                            </label>
                            <button
                              type="button"
                              onClick={handleSaveName}
                              disabled={savingName}
                              className="btn-primary"
                              style={{ padding: '8px 18px', borderRadius: 12, fontSize: '0.875rem' }}
                            >
                              <Save style={{ width: 14, height: 14 }} />
                              <span>{savingName ? 'Saving...' : 'Update Name Only'}</span>
                            </button>
                          </div>

                          <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: 16, top: 16, width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="input-field"
                              style={{ paddingLeft: 46, fontSize: '1rem' }}
                              placeholder="Enter your name"
                            />
                          </div>
                        </div>

                        {/* ── CARD B: CHANGE EMAIL SEPARATELY ── */}
                        <div style={{
                          padding: '24px',
                          background: 'rgba(255,255,255,0.025)',
                          borderRadius: 18,
                          border: '1px solid rgba(255,255,255,0.07)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 16,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                            <label style={{ color: 'white', fontSize: '0.9375rem', fontWeight: 700, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Mail style={{ width: 18, height: 18, color: 'var(--color-primary-400)' }} /> Email Address
                            </label>
                            <button
                              type="button"
                              onClick={handleSaveEmail}
                              disabled={savingEmail}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 18px',
                                borderRadius: 12,
                                background: 'var(--color-primary-500)',
                                border: '1px solid var(--color-primary-400)',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              className="hover:!brightness-110"
                            >
                              <Save style={{ width: 14, height: 14 }} />
                              <span>{savingEmail ? 'Saving...' : 'Update Email Only'}</span>
                            </button>
                          </div>

                          <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: 16, top: 16, width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="input-field"
                              style={{ paddingLeft: 46, fontSize: '1rem' }}
                              placeholder="Enter your email address"
                            />
                          </div>
                        </div>

                        {/* ── CARD C: SAVE BOTH NAME & EMAIL AT ONCE ── */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
                          <button
                            type="button"
                            onClick={handleSaveBoth}
                            disabled={savingBoth}
                            className="btn-primary"
                            style={{ padding: '14px 32px', borderRadius: 14, fontSize: '0.9375rem', boxShadow: '0 6px 20px rgba(79, 124, 255, 0.35)' }}
                          >
                            <Save style={{ width: 18, height: 18 }} />
                            <span>{savingBoth ? 'Saving Profile...' : 'Save Both Name & Email'}</span>
                          </button>
                        </div>

                      </div>
                    </div>

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

                    {/* Sub-section 2: Password Update Form */}
                    <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Key style={{ width: 18, height: 18, color: 'var(--color-brand-blue)' }} /> Change Security Password
                        </h4>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                          Ensure your account stays secure by using a strong password
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                        <div>
                          <label style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>Current Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>New Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="input-field"
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 6 }}>Confirm New Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
                        <button
                          type="submit"
                          disabled={savingPassword}
                          className="btn-secondary"
                          style={{ padding: '10px 24px', borderRadius: 12, fontSize: '0.875rem' }}
                        >
                          <Lock style={{ width: 15, height: 15 }} />
                          <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── TAB 2: Travel Preferences ── */}
                {activeTab === 'preferences' && (
                  <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>
                        AI Generation Preferences
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        Customize default currency, dining habits, and travel pace for AI plans
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                      <div>
                        <label style={{ display: 'block', color: 'var(--color-dark-200)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>
                          Preferred Currency
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="input-field"
                        >
                          <option value="USD">USD ($) - US Dollar</option>
                          <option value="EUR">EUR (€) - Euro</option>
                          <option value="GBP">GBP (£) - British Pound</option>
                          <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                          <option value="AED">AED (AED) - UAE Dirham</option>
                          <option value="JPY">JPY (¥) - Japanese Yen</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', color: 'var(--color-dark-200)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>
                          Default Travel Style
                        </label>
                        <select
                          value={travelStyle}
                          onChange={(e) => setTravelStyle(e.target.value)}
                          className="input-field"
                        >
                          <option value="Luxury">✨ Luxury & Premium</option>
                          <option value="Adventure">🏔️ Adventure & Outdoors</option>
                          <option value="Cultural">🏛️ Cultural & Historical</option>
                          <option value="Relaxed">🏖️ Relaxed & Beach</option>
                          <option value="Family">👨‍👩‍👧‍👦 Family Friendly</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', color: 'var(--color-dark-200)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>
                          Dietary Requirements
                        </label>
                        <select
                          value={dietary}
                          onChange={(e) => setDietary(e.target.value)}
                          className="input-field"
                        >
                          <option value="Halal Food Only">🕌 Halal Dining Only</option>
                          <option value="Vegetarian">🥗 Vegetarian</option>
                          <option value="Vegan">🌱 Vegan</option>
                          <option value="No Restrictions">🍕 No Restrictions</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', color: 'var(--color-dark-200)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>
                          Itinerary Pace
                        </label>
                        <select
                          value={travelPace}
                          onChange={(e) => setTravelPace(e.target.value)}
                          className="input-field"
                        >
                          <option value="Relaxed">☕ Relaxed (2-3 stops / day)</option>
                          <option value="Moderate">🚶 Moderate (4-5 stops / day)</option>
                          <option value="Fast-Paced">⚡ Fast-Paced (6+ stops / day)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12 }}>
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ padding: '12px 28px', borderRadius: 14, fontSize: '0.9375rem' }}
                      >
                        <Save style={{ width: 16, height: 16 }} />
                        <span>Save Preferences</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ── TAB 3: AI & Notifications ── */}
                {activeTab === 'notifications' && (
                  <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)', marginBottom: 6 }}>
                        AI Assistant & Notifications
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        Manage automated AI schedule optimization and email notifications
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {[
                        {
                          key: 'autoOptimize',
                          title: 'Auto-Optimize Itinerary Timings',
                          desc: 'Allow AI to automatically adjust activity schedules based on local transit & peak hours',
                          icon: Sparkles,
                          color: 'var(--color-primary-400)',
                        },
                        {
                          key: 'aiSuggestions',
                          title: 'Smart Recommendation Cards',
                          desc: 'Display personalized local dining & hidden gem recommendations on trip pages',
                          icon: Zap,
                          color: 'var(--color-primary-400)',
                        },
                        {
                          key: 'emailAlerts',
                          title: 'Email Trip Summaries & PDF Exports',
                          desc: 'Receive confirmation emails and PDF downloads directly in your inbox',
                          icon: Mail,
                          color: 'var(--color-primary-400)',
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 20,
                            padding: '20px 24px',
                            background: 'rgba(255,255,255,0.025)',
                            borderRadius: 18,
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                            <div style={{
                              width: 38,
                              height: 38,
                              borderRadius: 12,
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: item.color,
                              flexShrink: 0,
                            }}>
                              <item.icon style={{ width: 18, height: 18 }} />
                            </div>
                            <div>
                              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9375rem', fontFamily: 'var(--font-heading)', marginBottom: 2 }}>
                                {item.title}
                              </div>
                              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                {item.desc}
                              </div>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => setToggles({ ...toggles, [item.key]: !toggles[item.key] })}
                            style={{
                              width: 52,
                              height: 28,
                              borderRadius: 9999,
                              background: toggles[item.key] ? 'var(--color-brand-blue)' : 'rgba(255,255,255,0.1)',
                              border: 'none',
                              padding: 3,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: toggles[item.key] ? 'flex-end' : 'flex-start',
                              boxShadow: toggles[item.key] ? '0 0 16px rgba(79, 124, 255, 0.4)' : 'none',
                              flexShrink: 0,
                            }}
                          >
                            <motion.div
                              layout
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: '#FFFFFF',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                              }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12 }}>
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ padding: '12px 28px', borderRadius: 14, fontSize: '0.9375rem' }}
                      >
                        <Save style={{ width: 16, height: 16 }} />
                        <span>Save Settings</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ── TAB 4: Pro Membership ── */}
                {activeTab === 'membership' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 24,
                      padding: '32px',
                      background: 'linear-gradient(135deg, rgba(79, 124, 255, 0.2) 0%, var(--color-secondary-dark) 50%, rgba(79, 124, 255, 0.12) 100%)',
                      border: '1px solid rgba(79, 124, 255, 0.35)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
                        <div>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 12px',
                            borderRadius: 9999,
                            background: 'rgba(79, 124, 255, 0.15)',
                            border: '1px solid rgba(79, 124, 255, 0.3)',
                            color: 'var(--color-primary-400)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: 10,
                          }}>
                            <Sparkles style={{ width: 13, height: 13 }} /> Active Membership
                          </div>

                          <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)', margin: 0 }}>
                            PRO Explorer Plan
                          </h3>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary-400)', fontFamily: 'var(--font-heading)' }}>
                            $19 <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>/ month</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>Renews Aug 28, 2026</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                        {[
                          'Unlimited AI Itinerary Generation',
                          'GPT-4o Priority Reasoning Model',
                          'CartoDB Dark Voyager Interactive Maps',
                          'PDF Export & Route Customization',
                          '24/7 AI Travel Concierge Assistant',
                        ].map((feature, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'var(--color-dark-200)' }}>
                            <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981', flexShrink: 0 }} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Manage Payment Card */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 20,
                      padding: '24px',
                      background: 'rgba(255,255,255,0.025)',
                      borderRadius: 18,
                      border: '1px solid rgba(255,255,255,0.06)',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          background: 'rgba(79, 124, 255, 0.12)',
                          border: '1px solid rgba(79, 124, 255, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-primary-400)',
                          flexShrink: 0,
                        }}>
                          <CreditCard style={{ width: 22, height: 22 }} />
                        </div>
                        <div>
                          <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9375rem', fontFamily: 'var(--font-heading)' }}>
                            Payment Method
                          </div>
                          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: 2 }}>
                            Visa ending in •••• 4242 (Expires 12/28)
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toast.success('Subscription portal opened!')}
                        className="btn-secondary"
                        style={{ borderRadius: 12, padding: '10px 20px', fontSize: '0.875rem' }}
                      >
                        Manage Billing
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
