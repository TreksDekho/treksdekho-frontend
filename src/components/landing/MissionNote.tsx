'use client';
import { motion } from 'framer-motion';
import { WHATSAPP_NUMBER } from '@/data/treks';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function MissionNote() {
  const trekkerMsg = encodeURIComponent(
    "Hi! I'm a trekker from Pune and I have feedback for TreksDekho:"
  );
  const operatorMsg = encodeURIComponent(
    "Hi! I'm a trek operator / guide in the Sahyadri and I'd like to share my experience:"
  );

  return (
    <section className="bg-[#1a3a2a] py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#0f1f17] text-[#c8902a] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#c8902a]/20 mb-4 uppercase tracking-widest">
            Why We Built This
          </span>
          <h2 className="font-heading font-bold text-[#f5f0e8] text-3xl sm:text-4xl mb-4">
            The Problem We&apos;re Solving
          </h2>
          <p className="text-[#8a9a8e] max-w-xl mx-auto leading-relaxed">
            Every Pune trekker knows the drill. Thursday night, you want to book a weekend trek.
            What follows is 2 hours of chaos.
          </p>
        </motion.div>

        {/* Problem statement — full width */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#0f1f17] rounded-2xl p-6 sm:p-8 mb-10 border border-[#f5f0e8]/5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: '🔍',
                label: 'Search chaos',
                body: '6 WhatsApp groups. 4 Instagram pages. 3 JustDial listings with numbers that don\'t pick up.',
              },
              {
                icon: '💸',
                label: 'Price mystery',
                body: 'Same Lohagad trek — one operator charges ₹799, another ₹1,500. No one explains why.',
              },
              {
                icon: '⚠️',
                label: 'Safety gaps',
                body: 'No gear checklist. No weather warning. No idea if the operator is even certified.',
              },
            ].map(({ icon, label, body }) => (
              <div key={label} className="flex gap-3">
                <span className="text-2xl shrink-0">{icon}</span>
                <div>
                  <p className="text-[#f5f0e8] font-semibold text-sm mb-1">{label}</p>
                  <p className="text-[#8a9a8e] text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Two-column message */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* To Trekkers */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0f1f17] rounded-2xl p-6 border border-[#4caf74]/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🏕</span>
              <span className="text-[#4caf74] text-xs font-semibold uppercase tracking-widest">
                To Trekkers
              </span>
            </div>

            <p className="text-[#f5f0e8] font-heading font-bold text-lg mb-3 leading-snug">
              You deserve a better experience in the mountains.
            </p>

            <p className="text-[#8a9a8e] text-sm leading-relaxed mb-4">
              We&apos;re building TreksDekho because we&apos;ve been on the wrong trek with the
              wrong operator in the wrong weather — and it was avoidable. Every bit of it.
            </p>

            <p className="text-[#8a9a8e] text-sm leading-relaxed mb-6">
              This platform is early. <span className="text-[#f5f0e8]">Your feedback builds it.</span>{' '}
              Tell us what treks you want, what information you&apos;re missing, and what
              would make you trust a new platform. One message. That&apos;s all we ask.
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${trekkerMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#4caf74]/10 hover:bg-[#4caf74]/20 border border-[#4caf74]/30 text-[#4caf74] font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              <WhatsAppIcon />
              Share Trekker Feedback
            </a>
          </motion.div>

          {/* To Operators */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#0f1f17] rounded-2xl p-6 border border-[#c8902a]/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🧭</span>
              <span className="text-[#c8902a] text-xs font-semibold uppercase tracking-widest">
                To Operators & Guides
              </span>
            </div>

            <p className="text-[#f5f0e8] font-heading font-bold text-lg mb-3 leading-snug">
              You run the Sahyadri. We&apos;ll make sure people find you.
            </p>

            <p className="text-[#8a9a8e] text-sm leading-relaxed mb-4">
              You guide hundreds of trekkers every monsoon. You know every trail,
              every shelter, every danger. But half your time goes to repetitive WhatsApp
              inquiries and admin that has nothing to do with the mountain.
            </p>

            <p className="text-[#8a9a8e] text-sm leading-relaxed mb-6">
              We want to take that weight off. Tell us what tools would
              actually help you. <span className="text-[#f5f0e8]">What&apos;s broken in how you
              operate today?</span> We&apos;re building this with you, not for you.
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${operatorMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#c8902a]/10 hover:bg-[#c8902a]/20 border border-[#c8902a]/30 text-[#c8902a] font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              <WhatsAppIcon />
              Share Operator Feedback
            </a>
          </motion.div>
        </div>

        {/* Community ask — centered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-[#8a9a8e] text-sm leading-relaxed max-w-lg mx-auto">
            We are Pune people building for Pune people. This is early —
            honestly, very early. Help us get it right.{' '}
            <span className="text-[#f5f0e8]">जय महाराष्ट्र. जय सह्याद्री.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
