import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center page-transition">
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-6 inline-block"
        >
          🛸
        </motion.div>
        <h1 className="text-6xl sm:text-8xl font-bold font-heading text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Lost in space?</h2>
        <p className="text-dark-400 mb-8 max-w-[400px] mx-auto">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link to="/" className="btn-primary no-underline inline-flex">
          <ArrowLeft className="w-4 h-4" />
          Back to Earth
        </Link>
      </div>
    </div>
  );
}
