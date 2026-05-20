'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Visitor counter ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2200) {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const trigger = useCallback(() => setActive(true), []);

  useEffect(() => {
    if (!active || target === 0) return;
    const t0 = Date.now();
    const id = setInterval(() => {
      const p = Math.min((Date.now() - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (p >= 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);

  return { count, trigger };
}

function VisitorStat() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [visitors, setVisitors] = useState(0);
  const [fetched, setFetched] = useState(false);
  const { count: displayCount, trigger } = useCountUp(visitors);

  // Increment + fetch count from free counter API
  useEffect(() => {
    if (fetched) return;
    setFetched(true);
    fetch('https://api.counterapi.dev/v1/treksdekho-site/visits/up')
      .then((r) => r.json())
      .then((d) => setVisitors(1000 + (d.value ?? 0)))
      .catch(() => setVisitors(1000)); // floor at 1000
  }, [fetched]);

  useEffect(() => {
    if (inView && visitors > 0) trigger();
  }, [inView, visitors, trigger]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-heading font-bold text-3xl sm:text-4xl text-[#f5f0e8] tabular-nums">
        {displayCount > 0 ? displayCount.toLocaleString('en-IN')+'+' : '—'}
      </p>
      <p className="text-[#8a9a8e] text-xs mt-1 uppercase tracking-wider">Trekkers visited</p>
    </div>
  );
}

// ── Fort chips ────────────────────────────────────────────────────────────────
const FORTS = [
  { name: 'Raigad',          note: "Shivaji's Capital" },
  { name: 'Sinhagad',        note: 'Battle of 1670' },
  { name: 'Rajgad',          note: 'First Capital' },
  { name: 'Pratapgad',       note: 'Battle of 1659' },
  { name: 'Harishchandragad', note: 'Kokankada' },
  { name: 'Lohagad',         note: 'Ancient Fort' },
  { name: 'Torna',           note: 'Where it began' },
  { name: 'Purandar',        note: 'Treaty Fort' },
];

// ── Main component ─────────────────────────────────────────────────────────
export default function SahyadriLegacy() {
  return (
    <section className="relative bg-[#0a1810] py-20 px-4 overflow-hidden border-t border-[#1a3a2a]">
      {/* Subtle fort-texture background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #c8902a 0px, #c8902a 1px,
            transparent 1px, transparent 40px
          )`,
        }}
      />

      <div className="relative max-w-5xl mx-auto">

        {/* Marathi subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-[#c8902a]/60 text-sm font-medium tracking-[0.2em] mb-4"
        >
          सह्याद्रीचे किल्ले — मराठा साम्राज्याचे रक्षणकर्ते
        </motion.p>

        {/* Headline — staggered typographic composition */}
        <div className="text-center mb-6 space-y-1">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-heading font-normal text-[#f5f0e8]/60 text-2xl sm:text-3xl md:text-4xl tracking-wide leading-tight"
          >
            Born From the
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="font-heading font-bold text-[#f5f0e8] text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none"
          >
            Sahyadri.
          </motion.p>

          {/* Decorative rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="flex justify-center pt-2 pb-1"
          >
            <span className="block h-px w-16 bg-gradient-to-r from-transparent via-[#c8902a] to-transparent origin-center" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.48 }}
            className="font-heading font-bold text-[#c8902a] text-5xl sm:text-6xl md:text-7xl tracking-tight leading-none drop-shadow-[0_0_40px_rgba(200,144,42,0.35)]"
          >
            Built For It.
          </motion.p>
        </div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-center space-y-4 mb-12"
        >
          <p className="text-[#f5f0e8]/80 leading-relaxed">
            The Sahyadri is not just a mountain range. It is the spine of Maharashtra —
            over <span className="text-[#c8902a] font-semibold">350 forts</span> standing watch
            across 1,600 km, each stone laid by the architects of Swarajya.
          </p>
          <p className="text-[#8a9a8e] leading-relaxed text-sm">
            For centuries these cliffs and ridgelines protected the Maratha Empire.
            Today they draw thousands of trekkers from Pune and Mumbai every weekend —
            yet no platform has ever honored them the way they deserve.
          </p>
        </motion.div>

        {/* Fort chips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-14"
        >
          {FORTS.map(({ name, note }, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
              className="flex items-center gap-1.5 bg-[#1a3a2a] border border-[#c8902a]/20 text-[#f5f0e8]/80 text-xs px-3 py-1.5 rounded-full"
            >
              {/* Fort battlement icon */}
              <svg viewBox="0 0 12 10" className="w-3 h-2.5 fill-[#c8902a] shrink-0">
                <rect x="0" y="4" width="12" height="6" />
                <rect x="0" y="0" width="2.5" height="5" />
                <rect x="4.75" y="0" width="2.5" height="5" />
                <rect x="9.5" y="0" width="2.5" height="5" />
              </svg>
              <span className="font-medium">{name}</span>
              <span className="text-[#8a9a8e]">· {note}</span>
            </motion.span>
          ))}
        </motion.div>

        {/* Shivaji quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-xl mx-auto text-center mb-16"
        >
          <p className="text-[#c8902a] font-heading text-xl sm:text-2xl font-bold mb-2 leading-snug">
            &ldquo;हे राज्य व्हावे ही श्रीचियाची इच्छा&rdquo;
          </p>
          <p className="text-[#8a9a8e] text-sm italic mb-1">
            &ldquo;Let this kingdom come to be — it is the will of the Almighty.&rdquo;
          </p>
          <footer className="text-[#8a9a8e]/60 text-xs">
            — Chhatrapati Shivaji Maharaj
          </footer>
        </motion.blockquote>

        {/* Stats strip — visitor counter + treks + operators */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto border border-[#1a3a2a] rounded-2xl p-6 bg-[#0f1f17]/60 backdrop-blur-sm"
        >
          {/* Live visitor counter */}
          <VisitorStat />

          {/* Divider */}
          <div className="h-full w-px bg-[#1a3a2a] mx-auto hidden sm:block col-span-0" />

          {/* Treks listed */}
          <div className="text-center">
            <p className="font-heading font-bold text-3xl sm:text-4xl text-[#f5f0e8]">6</p>
            <p className="text-[#8a9a8e] text-xs mt-1 uppercase tracking-wider">Treks listed</p>
          </div>

          {/* Operators joining */}
          <div className="text-center">
            <p className="font-heading font-bold text-3xl sm:text-4xl text-[#f5f0e8]">3+</p>
            <p className="text-[#8a9a8e] text-xs mt-1 uppercase tracking-wider">Operators joining</p>
          </div>
        </motion.div>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-[#8a9a8e] text-sm mt-8 max-w-md mx-auto"
        >
          TreksDekho is our promise — to every Pune trekker who has felt the pull of
          these mountains — that the Sahyadri will finally be as accessible as it is magnificent.
        </motion.p>

      </div>
    </section>
  );
}
