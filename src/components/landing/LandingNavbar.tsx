'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import TreksDekhoLogo from './TreksDekhoLogo';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0f1f17]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <TreksDekhoLogo size={34} />
          <span className="font-heading font-bold text-[#f5f0e8] text-lg tracking-tight">
            Treks<span style={{ color: '#D4691A' }}>Dekho</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#treks" className="text-[#8a9a8e] hover:text-[#f5f0e8] text-sm transition-colors">
            Treks
          </a>
          <a href="#how-it-works" className="text-[#8a9a8e] hover:text-[#f5f0e8] text-sm transition-colors">
            How it works
          </a>
          <a href="#why-us" className="text-[#8a9a8e] hover:text-[#f5f0e8] text-sm transition-colors">
            Why us
          </a>
          <a href="#operators" className="text-[#c8902a]/80 hover:text-[#c8902a] text-sm transition-colors font-medium">
            For Operators
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#join"
            className="bg-[#c8902a] hover:bg-[#e8a838] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Find a Trek
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#f5f0e8] p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0f1f17]/98 backdrop-blur-md border-t border-[#1a3a2a] px-4 py-5 space-y-4">
          <a href="#treks" onClick={() => setOpen(false)} className="block text-[#f5f0e8] text-sm py-2">Treks</a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block text-[#f5f0e8] text-sm py-2">How it works</a>
          <a href="#why-us" onClick={() => setOpen(false)} className="block text-[#f5f0e8] text-sm py-2">Why us</a>
          <a href="#operators" onClick={() => setOpen(false)} className="block text-[#c8902a] text-sm py-2 font-medium">For Operators</a>
          <div className="pt-2">
            <a
              href="#join"
              onClick={() => setOpen(false)}
              className="block text-center bg-[#c8902a] text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
            >
              Find a Trek
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
