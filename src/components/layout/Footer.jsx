import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plane, Globe, Mail, Heart, MapPin, MessageCircle,
  Link as LinkIcon, Send, LayoutDashboard, Wallet,
  Wrench, Users, LifeBuoy, ShieldCheck,
  FileText, PhoneCall, Route,
} from 'lucide-react';

/* ── Product link with isolated hover state ── */
function ProductLink({ label, path, Icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        to={path}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 8,
          color: hovered ? 'white' : 'var(--color-text-secondary)',
          background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
          border: hovered ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.18s',
        }}
      >
        <span style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          background: hovered ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: hovered ? '#60a5fa' : 'var(--color-text-muted)',
          transition: 'all 0.18s',
        }}>
          <Icon style={{ width: 13, height: 13 }} />
        </span>
        {label}
      </Link>
    </li>
  );
}

/* ── Destination link with dot indicator ── */
function DestLink({ label, path }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        to={path}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px', borderRadius: 8,
          color: hovered ? '#60a5fa' : 'var(--color-text-secondary)',
          background: hovered ? 'rgba(59,130,246,0.06)' : 'transparent',
          fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.18s',
        }}
      >
        <span style={{
          width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
          background: hovered ? '#60a5fa' : 'rgba(255,255,255,0.2)',
          transition: 'background 0.18s',
        }} />
        {label}
      </Link>
    </li>
  );
}

/* ── Support link ── */
function SupportLink({ label, path, Icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        to={path}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px', borderRadius: 8,
          color: hovered ? 'white' : 'var(--color-text-secondary)',
          background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
          fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.18s',
        }}
      >
        <Icon style={{ width: 13, height: 13, flexShrink: 0, opacity: 0.5 }} />
        {label}
      </Link>
    </li>
  );
}

/* ══════════ Footer ══════════ */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const product = [
    { label: 'Plan Trip',      path: '/plan',      icon: Route },
    { label: 'Dashboard',      path: '/dashboard', icon: LayoutDashboard },
    { label: 'Budget Tracker', path: '/budget',    icon: Wallet },
    { label: 'Travel Tools',   path: '/tools',     icon: Wrench },
    { label: 'Community',      path: '/community', icon: Users },
  ];

  const destinations = [
    { label: 'Europe',        path: '/community?region=europe' },
    { label: 'Asia',          path: '/community?region=asia' },
    { label: 'Middle East',   path: '/community?region=middle-east' },
    { label: 'North America', path: '/community?region=north-america' },
    { label: 'Pakistan',      path: '/community?region=south-asia' },
  ];

  const support = [
    { label: 'Help Center',      path: '#', icon: LifeBuoy },
    { label: 'Privacy Policy',   path: '#', icon: ShieldCheck },
    { label: 'Terms of Service', path: '#', icon: FileText },
    { label: 'Contact Us',       path: '#', icon: PhoneCall },
  ];

  const socials = [
    { Icon: MessageCircle, href: '#', label: 'Twitter' },
    { Icon: LinkIcon,      href: '#', label: 'LinkedIn' },
    { Icon: Globe,         href: '#', label: 'Website' },
    { Icon: Mail,          href: '#', label: 'Email' },
  ];

  return (
    <footer style={{
      position: 'relative',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'var(--color-dark-950)',
    }}>
      {/* Top gradient line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px 40px' }}>
        <div className="footer-grid" style={{
          display: 'grid',
          gap: '48px 40px',
        }}>

          {/* ── Brand ── */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #3B82F6, #F59E0B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plane style={{ width: 20, height: 20, color: 'white' }} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white' }}>
                Trip<span style={{ color: '#60a5fa' }}>Planner</span>
              </span>
            </Link>

            <p style={{
              color: 'var(--color-text-secondary)', fontSize: '0.875rem',
              lineHeight: 1.75, marginBottom: 28, maxWidth: 340,
            }}>
              AI-powered travel planning for 195 countries. Generate personalized
              itineraries, track budgets, and explore the world — all in one platform.
            </p>

            {/* Newsletter */}
            <div style={{ marginBottom: 28 }}>
              <h5 style={{
                color: 'white', fontSize: '0.7rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12,
              }}>
                Join our newsletter
              </h5>
              <div style={{ display: 'flex', gap: 8, maxWidth: 360 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Mail style={{
                    width: 15, height: 15,
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                  }} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    style={{
                      width: '100%', paddingLeft: 40, paddingRight: 14,
                      paddingTop: 11, paddingBottom: 11,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8, fontSize: '0.85rem', color: 'white', outline: 'none',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                  />
                </div>
                <button className="btn-primary" style={{ padding: '10px 14px', borderRadius: 8, flexShrink: 0 }}>
                  <Send style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map(({ Icon, href, label }) => (
                <SocialIcon key={label} Icon={Icon} href={href} label={label} />
              ))}
            </div>
          </div>

          {/* ── Product ── */}
          <div>
            <h4 style={{
              color: 'white', fontWeight: 700, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20,
            }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {product.map(({ label, path, icon }) => (
                <ProductLink key={label} label={label} path={path} Icon={icon} />
              ))}
            </ul>
          </div>

          {/* ── Destinations ── */}
          <div>
            <h4 style={{
              color: 'white', fontWeight: 700, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <MapPin style={{ width: 13, height: 13, color: '#60a5fa' }} />
              Destinations
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {destinations.map(({ label, path }) => (
                <DestLink key={label} label={label} path={path} />
              ))}
            </ul>
          </div>

          {/* ── Support ── */}
          <div>
            <h4 style={{
              color: 'white', fontWeight: 700, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20,
            }}>
              Support
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {support.map(({ label, path, icon }) => (
                <SupportLink key={label} label={label} path={path} Icon={icon} />
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          marginTop: 56, paddingTop: 28,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 12,
        }}>
          <p style={{
            color: 'var(--color-text-muted)', fontSize: '0.78rem',
            display: 'flex', alignItems: 'center', gap: 5, margin: 0,
          }}>
            © {currentYear} AI Trip Planner. Made with{' '}
            <Heart style={{ width: 12, height: 12, color: '#F59E0B', fill: '#F59E0B' }} />{' '}
            for travelers worldwide.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
            <Globe style={{ width: 13, height: 13 }} />
            <span>195 Countries · 150+ Currencies · Powered by Gemini AI</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid { grid-template-columns: minmax(260px, 1.8fr) 1fr 1fr 1fr; }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; } }
      `}</style>
    </footer>
  );
}

/* ── Social icon (isolated state) ── */
function SocialIcon({ Icon, href, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 36, height: 36, borderRadius: 9,
        background: hovered ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.04)',
        border: hovered ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: hovered ? '#60a5fa' : 'var(--color-text-muted)',
        textDecoration: 'none', transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <Icon style={{ width: 15, height: 15 }} />
    </a>
  );
}
