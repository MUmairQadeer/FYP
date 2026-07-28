import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Navigation } from 'lucide-react';

export default function Logo({ size = 'md', showSubtitle = true, link = true }) {
  const sizes = {
    sm: { box: 'w-9 h-9', icon: 'w-4 h-4', text: 'text-lg', sub: 'text-[9px]' },
    md: { box: 'w-11 h-11', icon: 'w-5 h-5', text: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 'w-14 h-14', icon: 'w-7 h-7', text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizes[size] || sizes.md;

  const content = (
    <div className="flex items-center gap-3.5 group select-none cursor-pointer">
      {/* ── Luxury Icon Container ── */}
      <div className="relative flex-shrink-0">
        {/* Outer Glow Halo */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500 via-amber-500 to-indigo-500 opacity-40 blur-md group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Main Glass Icon Box */}
        <div className={`${currentSize.box} rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 p-[1.5px] shadow-xl relative z-10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}>
          <div className="w-full h-full rounded-[14px] bg-[#090B10]/90 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
            {/* Subtle Gradient Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-amber-500/20 opacity-60" />
            
            {/* Flight Compass & Plane Symbol */}
            <div className="relative z-10 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${currentSize.icon} text-white transition-transform duration-500 group-hover:rotate-[360deg]`}
                style={{ filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.5))' }}
              >
                <path
                  d="M21 3L3 10.5L10 13.5L13 20.5L21 3Z"
                  fill="url(#logo-grad-1)"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 13.5L21 3"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="logo-grad-1" x1="3" y1="3" x2="21" y2="20.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6" />
                    <stop offset="0.5" stopColor="#60A5FA" />
                    <stop offset="1" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Sparkle Dot */}
              <Sparkles className="w-2.5 h-2.5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Brand Typography ── */}
      <div className="flex flex-col">
        <div className={`font-black font-heading ${currentSize.text} tracking-tight leading-none text-white flex items-center gap-1`}>
          <span>Trip</span>
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
            Planner
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className={`${currentSize.sub} font-bold text-slate-400 tracking-[0.18em] uppercase font-mono`}>
              AI TRIP ENGINE
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
