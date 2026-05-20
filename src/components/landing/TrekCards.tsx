'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Clock, Users, Search, X } from 'lucide-react';
import { TREKS, WHATSAPP_NUMBER, type Difficulty, type Trek } from '@/data/treks';
import { fetchTreksFromSheet } from '@/lib/fetchTreks';

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  Easy:     'bg-[#4caf74]/20 text-[#4caf74] border border-[#4caf74]/30',
  Moderate: 'bg-[#e8a838]/20 text-[#e8a838] border border-[#e8a838]/30',
  Tough:    'bg-[#c94f3a]/20 text-[#c94f3a] border border-[#c94f3a]/30',
};

const FILTERS: Array<Difficulty | 'All' | 'Monsoon'> = ['All', 'Monsoon', 'Easy', 'Moderate', 'Tough'];

const FortIcon = () => (
  <svg viewBox="0 0 12 10" className="w-3 h-2.5 fill-[#c8902a]/70 shrink-0">
    <rect x="0" y="4" width="12" height="6" />
    <rect x="0" y="0" width="2.5" height="5" />
    <rect x="4.75" y="0" width="2.5" height="5" />
    <rect x="9.5" y="0" width="2.5" height="5" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 shrink-0">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full">
      {/* Skeleton shown until image loads */}
      <div className={`absolute inset-0 bg-[#1a3a2a] transition-opacity duration-300 ${loaded ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2a5a3a]/40 to-transparent animate-[shimmer_1.4s_ease-in-out_infinite] bg-[length:200%_100%]" />
      </div>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function TrekCard({
  trek,
  isDimmed,
  onHoverChange,
}: {
  trek: typeof TREKS[0];
  isDimmed: boolean;
  onHoverChange: (h: boolean) => void;
}) {
  const [hovered, setHovered] = useState(false);

  // Preload gallery images as soon as card mounts — so hover is instant
  useEffect(() => {
    trek.photos.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [trek.photos]);

  const handleEnter = () => { setHovered(true); onHoverChange(true); };
  const handleLeave = () => { setHovered(false); onHoverChange(false); };

  const waMsg = encodeURIComponent(
    `Hi! I'm interested in the ${trek.name} trek (${trek.duration}, ₹${trek.price}). Can you share details?`
  );
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  return (
    <motion.div
      className="relative"
      animate={{ opacity: isDimmed ? 0.35 : 1, scale: isDimmed ? 0.97 : 1 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ── Compact card (holds grid space, fades on hover) ── */}
      <motion.div
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        className="bg-[#1a3a2a] rounded-2xl overflow-hidden border border-[#f5f0e8]/5 flex flex-col"
      >
        <div className="relative h-52 overflow-hidden shrink-0">
          <Image src={trek.image} alt={trek.name} fill className="object-cover" priority={trek.id === '1'} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f17]/75 via-[#0f1f17]/15 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${DIFFICULTY_STYLE[trek.difficulty]}`}>
              {trek.difficulty}
            </span>
            {trek.isMonsoonPick && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#c8902a]/20 text-[#c8902a] border border-[#c8902a]/30 backdrop-blur-sm">
                🌧 Monsoon Pick
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#0f1f17]/60 text-[#8a9a8e] border border-[#f5f0e8]/10 backdrop-blur-sm">
              {trek.region}
            </span>
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="font-heading font-bold text-[#f5f0e8] text-lg drop-shadow-md">₹{trek.price.toLocaleString()}</span>
            <span className="text-[#8a9a8e] text-xs ml-1">/ person</span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-[#f5f0e8] text-lg mb-1.5 leading-snug">{trek.name}</h3>
          <div className="flex items-center gap-1.5 mb-3">
            <FortIcon />
            <span className="text-[10px] text-[#c8902a]/80 leading-tight">{trek.heritage}</span>
          </div>
          <div className="flex flex-wrap gap-3 text-[#8a9a8e] text-xs mb-3">
            <span className="flex items-center gap-1"><MapPin size={11} />{trek.location}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{trek.duration}</span>
            <span className="flex items-center gap-1"><Users size={11} />{trek.groupSize} people</span>
          </div>
          <div className="border-l-2 border-[#4caf74]/40 pl-3">
            <p className="text-[10px] text-[#4caf74]/70 uppercase tracking-widest font-semibold mb-0.5">Why trek this</p>
            <p className="text-[#f5f0e8]/85 text-sm leading-snug">{trek.whyTrek}</p>
          </div>
          <div className="flex-1" />
          <div className="mt-3 pt-3 border-t border-[#f5f0e8]/8 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[#8a9a8e] text-xs">by</span>
              <span className="text-[#f5f0e8]/80 text-xs font-semibold">{trek.operatorName}</span>
            </div>
            <span className="flex items-center gap-1 text-[#c8902a]/70 text-xs">
              <InstagramIcon />@{trek.operatorInstagram}
            </span>
          </div>
          <div className="mt-3 w-full bg-[#c8902a] text-white text-sm font-semibold py-2.5 rounded-xl text-center">
            I&apos;m In 💬
          </div>
        </div>
      </motion.div>

      {/* ── Expanded hover panel ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1.03 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 z-50 rounded-2xl overflow-hidden border border-[#c8902a]/40 shadow-[0_0_0_1px_rgba(200,144,42,0.15),0_16px_70px_rgba(0,0,0,0.75)] bg-[#162e20]"
            style={{ transformOrigin: 'top center' }}
          >
            {/* Photo mosaic */}
            <div className="flex h-52 gap-0.5">
              <div className="relative flex-[3] overflow-hidden">
                <Image src={trek.image} alt={trek.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#162e20]/25" />
              </div>
              <div className="flex flex-col flex-[2] gap-0.5">
                <div className="flex-1 overflow-hidden">
                  <GalleryImage src={trek.photos[0]} alt={`${trek.name} view 2`} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <GalleryImage src={trek.photos[1]} alt={`${trek.name} view 3`} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-heading font-bold text-[#f5f0e8] text-xl leading-snug">{trek.name}</h3>
                <span className="font-heading font-bold text-[#c8902a] text-lg shrink-0">
                  ₹{trek.price.toLocaleString()}
                  <span className="text-[#8a9a8e] text-xs font-normal ml-0.5">/ person</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-4">
                <FortIcon />
                <span className="text-[10px] text-[#c8902a]/80">{trek.heritage}</span>
              </div>

              {/* Hook — centrepiece */}
              <div className="bg-[#0f1f17]/70 rounded-xl p-3.5 mb-4 border-l-[3px] border-[#4caf74]/50">
                <p className="text-[10px] text-[#4caf74]/70 uppercase tracking-widest font-semibold mb-1.5">Why Trek This</p>
                <p className="text-[#f5f0e8] text-[15px] font-semibold leading-snug">{trek.whyTrek}</p>
              </div>

              <p className="text-[#8a9a8e] text-xs leading-relaxed mb-4">{trek.about}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFFICULTY_STYLE[trek.difficulty]}`}>
                  {trek.difficulty}
                </span>
                <span className="text-xs text-[#8a9a8e] flex items-center gap-1 bg-[#0f1f17]/50 px-2.5 py-1 rounded-full">
                  <Clock size={11} />{trek.duration}
                </span>
                <span className="text-xs text-[#8a9a8e] flex items-center gap-1 bg-[#0f1f17]/50 px-2.5 py-1 rounded-full">
                  <Users size={11} />{trek.groupSize}
                </span>
                {trek.isMonsoonPick && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#c8902a]/20 text-[#c8902a] border border-[#c8902a]/30">
                    🌧 Monsoon Pick
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#f5f0e8]/8 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8a9a8e] text-xs">by</span>
                  <span className="text-[#f5f0e8]/80 text-xs font-semibold">{trek.operatorName}</span>
                </div>
                <a
                  href={`https://instagram.com/${trek.operatorInstagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#c8902a]/70 hover:text-[#c8902a] text-xs transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <InstagramIcon />@{trek.operatorInstagram}
                </a>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#c8902a] hover:bg-[#e8a838] text-white text-sm font-semibold py-3 rounded-xl text-center transition-colors"
              >
                I&apos;m In 💬
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TrekCards() {
  const [filter, setFilter] = useState<typeof FILTERS[0]>('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [treks, setTreks] = useState<Trek[]>(TREKS);

  useEffect(() => {
    fetchTreksFromSheet().then((data) => {
      if (data && data.length > 0) setTreks(data);
    });
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = treks.filter((t) => {
    const matchesFilter =
      filter === 'All' ? true :
      filter === 'Monsoon' ? t.isMonsoonPick :
      t.difficulty === filter;
    const matchesSearch = q === '' || (
      t.name.toLowerCase().includes(q) ||
      t.operatorName.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.region.toLowerCase().includes(q)
    );
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="treks" className="bg-[#0f1f17] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="font-heading font-bold text-[#f5f0e8] text-3xl sm:text-4xl mb-2">
            Monsoon Treks
          </h2>
          <p className="text-[#8a9a8e]">Hover any card to explore the trek. One tap to book.</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-5 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a9a8e] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by trek, operator, or location…"
            className="w-full bg-[#1a3a2a] border border-[#f5f0e8]/8 rounded-xl pl-9 pr-9 py-2.5 text-sm text-[#f5f0e8] placeholder:text-[#8a9a8e] focus:outline-none focus:border-[#c8902a]/50 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a9a8e] hover:text-[#f5f0e8] transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-[#c8902a] text-white shadow-[0_0_16px_rgba(200,144,42,0.3)]'
                  : 'bg-[#1a3a2a] text-[#8a9a8e] hover:text-[#f5f0e8] border border-[#f5f0e8]/5'
              }`}
            >
              {f === 'Monsoon' ? '🌧 Monsoon Picks' : f}
            </button>
          ))}
        </div>

        {/* overflow-visible so expanded panels clear the grid boundary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start [overflow:visible]">
          {filtered.map((trek) => (
            <TrekCard
              key={trek.id}
              trek={trek}
              isDimmed={hoveredId !== null && hoveredId !== trek.id}
              onHoverChange={(h) => setHoveredId(h ? trek.id : null)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#f5f0e8]/60 text-lg mb-1">No treks found</p>
            <p className="text-[#8a9a8e] text-sm">
              {query ? `No results for "${query}" — try a different name or operator.` : 'Try a different filter.'}
            </p>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="mt-4 text-[#c8902a] text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
