import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

export default function Logo({ size = 'md', showSubtitle = true, link = true }) {
  const sizes = {
    sm: { box: 34, icon: 15, text: 'text-lg', sub: 'text-[0.6875rem]' },
    md: { box: 42, icon: 19, text: 'text-xl', sub: 'text-[0.6875rem]' },
    lg: { box: 56, icon: 26, text: 'text-2xl', sub: 'text-[0.6875rem]' },
  };

  const s = sizes[size] || sizes.md;

  const content = (
    <div className="flex items-center gap-3 group select-none cursor-pointer">
      {/* Icon mark */}
      <div
        className="relative flex items-center justify-center rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
        style={{
          width: s.box,
          height: s.box,
          background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
          boxShadow: '0 6px 20px rgba(79, 124, 255, 0.35)',
          flexShrink: 0,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 55%)' }}
        />
        <Plane
          className="relative z-10 text-white transition-transform duration-500 group-hover:-translate-y-0.5"
          style={{ width: s.icon, height: s.icon, transform: 'rotate(-8deg)' }}
        />
      </div>

      {/* Brand typography */}
      <div className="flex flex-col justify-center">
        <div
          className={`font-heading font-bold tracking-tight leading-none text-white ${s.text}`}
        >
          Trip<span className="text-primary-400">Planner</span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className="w-1 h-1 rounded-full animate-pulse"
              style={{ background: 'var(--color-primary-400)' }}
            />
            <span
              className={`${s.sub} font-semibold text-dark-500 uppercase font-mono tracking-[0.18em]`}
            >
              AI Travel Engine
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to="/" className="no-underline inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
