'use client';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Mountain } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Pick Your Trek',
    body: 'Browse verified routes by difficulty, date, and budget. Every trek has real prices, real operators, and honest difficulty ratings.',
  },
  {
    icon: ShieldCheck,
    step: '02',
    title: 'We Handle the Rest',
    body: 'Transport from Pune, certified guides, safety gear check, permits — all coordinated. You get one confirmation on WhatsApp.',
  },
  {
    icon: Mountain,
    step: '03',
    title: 'Just Show Up & Trek',
    body: 'Meet at the designated point in Pune. We take it from there. You focus on the mountains.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#1a3a2a] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading font-bold text-[#f5f0e8] text-3xl sm:text-4xl mb-3">
            How TreksDekho Works
          </h2>
          <p className="text-[#8a9a8e] max-w-md mx-auto">
            We removed every friction point between you and the mountain.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-[#c8902a]/40 to-transparent" />

          {STEPS.map(({ icon: Icon, step, title, body }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center px-4"
            >
              {/* Icon circle */}
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 rounded-2xl bg-[#0f1f17] border border-[#c8902a]/20 flex items-center justify-center mx-auto">
                  <Icon size={30} className="text-[#c8902a]" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#c8902a] text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <h3 className="font-heading font-bold text-[#f5f0e8] text-xl mb-3">{title}</h3>
              <p className="text-[#8a9a8e] text-sm leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-14"
        >
          <a
            href="#treks"
            className="inline-block bg-[#c8902a] hover:bg-[#e8a838] text-white font-heading font-bold px-8 py-4 rounded-2xl transition-colors"
          >
            Browse Treks Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
