'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image — Harishchandragad Kokankada, Sahyadri
          Replace with your own Kokankada photo for maximum authenticity.
          Recommended: shoot at golden hour or monsoon mist for best effect. */}
      <Image
        src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=1920&q=80"
        alt="Harishchandragad Kokankada cliff, Sahyadri"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0f1f17]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Monsoon badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#1a3a2a]/80 backdrop-blur-sm border border-[#c8902a]/30 text-[#c8902a] text-xs font-semibold px-4 py-2 rounded-full mb-6"
        >
          🌧 Monsoon season is here · Treks now open
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-[#f5f0e8] leading-tight mb-6"
        >
          The Sahyadris,
          <br />
          {/* Tagline highlight — ochre text + underline glow */}
          <span className="relative inline-block">
            <span className="text-[#c8902a] drop-shadow-[0_0_32px_rgba(200,144,42,0.6)]">
              Finally Decoded.
            </span>
            {/* Animated underline */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c8902a] to-transparent origin-left"
            />
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#f5f0e8]/70 text-lg sm:text-xl max-w-xl mx-auto mb-10 font-light"
        >
          Find verified treks, book in one tap, trek with confidence.
          <br className="hidden sm:block" />
          No more searching 10 sites. No more surprises.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a
            href="#treks"
            className="bg-[#c8902a] hover:bg-[#e8a838] text-white font-heading font-bold text-base px-8 py-4 rounded-2xl transition-colors"
          >
            Browse Monsoon Treks
          </a>
          <a
            href="#how-it-works"
            className="bg-[#1a3a2a]/80 hover:bg-[#1a3a2a] border border-[#f5f0e8]/20 text-[#f5f0e8] font-semibold text-base px-8 py-4 rounded-2xl transition-colors backdrop-blur-sm"
          >
            How it works
          </a>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-[#8a9a8e] text-sm"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf74]" />
            Verified operators
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf74]" />
            Safety-first
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf74]" />
            Pune-based
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf74]" />
            Transparent pricing
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ duration: 1.5, delay: 1, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#8a9a8e]"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
