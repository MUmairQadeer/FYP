import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Globe, Mail, Heart, MapPin, MessageCircle, Link as LinkIcon } from 'lucide-react';

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

      <div className="container-custom mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 no-underline mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold font-heading text-white tracking-tight">
                Trip<span className="text-primary-400">Planner</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-6 max-w-sm">
              AI-powered travel planning for 195 countries. Generate personalized itineraries, 
              track budgets, and explore the world — all in one platform.
            </p>
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
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/[0.08] hover:border-primary-500/30 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 list-none p-0">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-dark-400 hover:text-white text-sm transition-colors no-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Destinations
            </h4>
            <ul className="space-y-2.5 list-none p-0">
              {footerLinks.destinations.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-dark-400 hover:text-white text-sm transition-colors no-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5 list-none p-0">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-dark-400 hover:text-white text-sm transition-colors no-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-xs flex items-center gap-1">
            © {currentYear} AI Trip Planner. Made with <Heart className="w-3 h-3 text-accent-500 fill-accent-500" /> for travelers worldwide.
          </p>
          <div className="flex items-center gap-2 text-dark-500 text-xs">
            <Globe className="w-3.5 h-3.5" />
            <span>195 Countries • 150+ Currencies • Powered by GPT-4o</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
