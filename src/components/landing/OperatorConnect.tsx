'use client';
import { motion } from 'framer-motion';
import { TrendingUp, Truck, ShieldCheck, BadgeCheck } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/data/treks';

const BENEFITS = [
  { icon: TrendingUp,  text: 'Direct booking leads sent to your WhatsApp' },
  { icon: Truck,       text: 'Pooled transport at lower per-head cost' },
  { icon: ShieldCheck, text: 'Digital waivers, gear checklists & permits handled' },
  { icon: BadgeCheck,  text: 'Verified Operator badge — instant trekker trust' },
];

const STEPS = [
  {
    n: '01',
    title: 'WhatsApp us your trek details',
    body: 'Route, dates, price, group size. We set up your listing within 24 hours.',
  },
  {
    n: '02',
    title: 'Go live and receive leads',
    body: 'Trekkers find your trek on TreksDekho and connect directly on WhatsApp.',
  },
  {
    n: '03',
    title: 'We handle the admin',
    body: 'Digital waivers, permit coordination, gear checklists — all managed for you.',
  },
];

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function OperatorConnect() {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi! I'm a trek operator in Pune / Sahyadri and I'd like to list my treks on TreksDekho. Here are my details:"
  )}`;

  return (
    <section id="operators" className="bg-[#0f1f17] py-20 px-4 border-t border-[#1a3a2a]">
      <div className="max-w-6xl mx-auto">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-3"
        >
          <span className="h-px flex-1 max-w-[48px] bg-[#c8902a]/40" />
          <span className="text-[#c8902a] text-xs font-semibold uppercase tracking-widest">
            For Trek Operators
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left column — pitch */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading font-bold text-[#f5f0e8] text-3xl sm:text-4xl mb-4 leading-tight">
              List Your Treks.
              <br />
              <span className="text-[#c8902a]">Grow Your Bookings.</span>
            </h2>

            <p className="text-[#8a9a8e] mb-8 leading-relaxed">
              You run the best treks in the Sahyadri. We give you the digital
              infrastructure to reach more trekkers, cut admin time, and scale
              without the headache.
            </p>

            {/* Benefits */}
            <ul className="space-y-4 mb-10">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#c8902a]/10 border border-[#c8902a]/20 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-[#c8902a]" />
                  </div>
                  <span className="text-[#f5f0e8] text-sm">{text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-heading font-bold px-7 py-4 rounded-2xl transition-colors text-base shadow-lg shadow-[#25d366]/20"
            >
              <WhatsAppIcon />
              Connect as an Operator
            </a>
            <p className="text-[#8a9a8e] text-xs mt-3">
              Free to list. We only earn a small commission when you get a confirmed booking.
            </p>
          </motion.div>

          {/* Right column — how it works card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-[#1a3a2a] rounded-3xl p-8 border border-[#f5f0e8]/5"
          >
            <p className="text-[#8a9a8e] text-xs font-semibold uppercase tracking-widest mb-6">
              How it works for operators
            </p>

            <div className="space-y-7">
              {STEPS.map(({ n, title, body }, i) => (
                <div key={n} className="flex gap-4">
                  <span className="font-heading font-bold text-[#c8902a] text-2xl leading-none shrink-0 mt-0.5 w-8">
                    {n}
                  </span>
                  <div className={i < STEPS.length - 1 ? 'relative pb-7 border-l border-[#f5f0e8]/10 pl-4 ml-[-0.5rem]' : 'pl-4 ml-[-0.5rem]'}>
                    <p className="text-[#f5f0e8] font-semibold text-sm mb-1">{title}</p>
                    <p className="text-[#8a9a8e] text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof strip */}
            <div className="mt-8 pt-6 border-t border-[#f5f0e8]/10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['AG', 'TF', 'SR'].map((initials) => (
                  <div
                    key={initials}
                    className="w-9 h-9 rounded-full bg-[#0f1f17] border-2 border-[#1a3a2a] flex items-center justify-center text-[10px] text-[#c8902a] font-bold"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-[#8a9a8e] text-xs leading-relaxed">
                Adventure Geek, TrekFit & Sahyadri Rangers
                <br />
                <span className="text-[#4caf74]">already onboarding</span>
              </p>
            </div>

            {/* Quick connect fields hint */}
            <div className="mt-6 bg-[#0f1f17] rounded-2xl p-4 border border-[#f5f0e8]/5">
              <p className="text-[#8a9a8e] text-xs mb-2 font-medium">Send us on WhatsApp:</p>
              <ul className="space-y-1 text-[#8a9a8e] text-xs">
                <li>→ Your name & operator/club name</li>
                <li>→ Trek name, route & base village</li>
                <li>→ Price per person & group size</li>
                <li>→ Available dates this monsoon</li>
              </ul>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
