import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Globe, Mail, Heart, MapPin, MessageCircle, Link as LinkIcon, ArrowRight, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Plan Trip', path: '/plan' },
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Budget Tracker', path: '/budget' },
      { label: 'Travel Tools', path: '/tools' },
      { label: 'Community', path: '/community' },
    ],
    destinations: [
      { label: 'Europe', path: '/community?region=europe' },
      { label: 'Asia', path: '/community?region=asia' },
      { label: 'Middle East', path: '/community?region=middle-east' },
      { label: 'North America', path: '/community?region=north-america' },
      { label: 'Pakistan', path: '/community?region=south-asia' },
    ],
    support: [
      { label: 'Help Center', path: '#' },
      { label: 'Privacy Policy', path: '#' },
      { label: 'Terms of Service', path: '#' },
      { label: 'Contact Us', path: '#' },
    ],
  };

  return (
    <footer className="relative border-t border-white/[0.06] bg-dark-950">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', justifyContent: 'space-between' }}>
          {/* Brand */}
          <div style={{ flex: '1 1 350px', maxWidth: 450 }}>
            <Link to="/" className="flex items-center gap-3 no-underline mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold font-heading text-white tracking-tight">
                Trip<span className="text-primary-400">Planner</span>
              </span>
            </Link>
            <p style={{ color: 'var(--color-dark-400)', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: 32, maxWidth: 400 }}>
              AI-powered travel planning for 195 countries. Generate personalized itineraries, 
              track budgets, and explore the world — all in one platform.
            </p>
            
            {/* Newsletter Subscription */}
            <div style={{ marginBottom: 40 }}>
              <h5 style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Join our newsletter</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, maxWidth: 384 }}>
                <div className="relative flex-1 group" style={{ display: 'flex' }}>
                  <Mail style={{ width: 16, height: 16, position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-dark-500)', zIndex: 10 }} />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 16px 10px 42px', fontSize: '0.875rem', color: 'white', outline: 'none' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary-500)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                  />
                </div>
                <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: 8, flexShrink: 0 }}>
                  <Send style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {[
                { Icon: MessageCircle, href: '#' },
                { Icon: LinkIcon, href: '#' },
                { Icon: Globe, href: '#' },
                { Icon: Mail, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div style={{ flex: '1 1 140px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="group flex items-center gap-2 text-dark-400 hover:text-white text-sm transition-colors no-underline">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 group-hover:text-primary-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div style={{ flex: '1 1 140px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin style={{ width: 14, height: 14 }} />
              Destinations
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {footerLinks.destinations.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="group flex items-center gap-2 text-dark-400 hover:text-white text-sm transition-colors no-underline">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 group-hover:text-primary-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div style={{ flex: '1 1 140px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="group flex items-center gap-2 text-dark-400 hover:text-white text-sm transition-colors no-underline">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 group-hover:text-primary-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ color: 'var(--color-dark-500)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4, margin: 0 }}>
            © {currentYear} AI Trip Planner. Made with <Heart style={{ width: 12, height: 12, color: 'var(--color-accent-500)', fill: 'var(--color-accent-500)' }} /> for travelers worldwide.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-dark-500)', fontSize: '0.75rem' }}>
            <Globe style={{ width: 14, height: 14 }} />
            <span>195 Countries • 150+ Currencies • Powered by GPT-4o</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
