'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, IndianRupee, MapPin, Users } from 'lucide-react';

const REASONS = [
  {
    icon: ShieldCheck,
    title: 'Verified Operators Only',
    body: 'Every operator on TreksDekho is vetted. Certified guides, proper safety gear, and real insurance — not just promises.',
  },
  {
    icon: IndianRupee,
    title: 'No Hidden Costs',
    body: 'Transport, guide, permits — everything listed upfront. The price you see is the price you pay. No surprises on trek day.',
  },
  {
    icon: MapPin,
    title: 'Monsoon Safety Built In',
    body: 'Dangerous routes blocked automatically during restrictions. Gear checklists enforced. Offline GPS available for remote areas.',
  },
  {
    icon: Users,
    title: 'Community-Rooted',
    body: 'We work with Pune\'s local trekking community — enthusiast clubs, local guides, people who know these mountains intimately.',
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-[#1a3a2a] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading font-bold text-[#f5f0e8] text-3xl sm:text-4xl mb-3">
            Why TreksDekho
          </h2>
          <p className="text-[#8a9a8e] max-w-md mx-auto">
            Not another generic travel site. Built specifically for the Sahyadri trekking community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {REASONS.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#0f1f17] rounded-2xl p-6 border border-[#f5f0e8]/5 hover:border-[#c8902a]/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[#c8902a]/10 flex items-center justify-center mb-4">
                <Icon size={22} className="text-[#c8902a]" />
              </div>
              <h3 className="font-heading font-bold text-[#f5f0e8] text-lg mb-2">{title}</h3>
              <p className="text-[#8a9a8e] text-sm leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
