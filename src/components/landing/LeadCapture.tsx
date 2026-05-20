'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { WHATSAPP_NUMBER } from '@/data/treks';

type FormState = 'idle' | 'loading' | 'success' | 'error';
type ContactMethod = 'whatsapp' | 'email';

const GROUP_SIZES = ['Just me', '2', '3–4', '5+'];
const DIFFICULTIES = ['Easy', 'Moderate', 'Tough', 'Any'];

export default function LeadCapture() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('whatsapp');
  const [groupSize, setGroupSize] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [state, setState] = useState<FormState>('idle');

  const contactValue = contactMethod === 'whatsapp' ? phone : email;
  const isValid = name && contactValue && groupSize && difficulty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setState('loading');

    const payload = {
      name,
      contactMethod,
      contact: contactValue,
      groupSize,
      difficulty,
      timestamp: new Date().toISOString(),
    };

    const scriptUrl = process.env.NEXT_PUBLIC_LEADS_SCRIPT_URL;

    try {
      if (scriptUrl) {
        await fetch(scriptUrl, { method: 'POST', body: JSON.stringify(payload) });
      }
      setState('success');

      if (contactMethod === 'whatsapp') {
        const msg = encodeURIComponent(
          `Hi! I'm ${name}. Group of ${groupSize}, looking for a ${difficulty} trek. Can you help me find the right one?`
        );
        setTimeout(() => {
          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
        }, 800);
      } else {
        const subject = encodeURIComponent('Trek enquiry — TreksDekho');
        const body = encodeURIComponent(
          `Hi TreksDekho,\n\nI'm ${name}. I'm looking for a ${difficulty} trek for a group of ${groupSize}.\n\nCan you suggest options?\n\nThanks`
        );
        setTimeout(() => {
          window.open(`mailto:${WHATSAPP_NUMBER}?subject=${subject}&body=${body}`, '_blank');
        }, 800);
      }
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <section id="join" className="bg-[#0f1f17] py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-heading font-bold text-[#f5f0e8] text-2xl mb-2">
            You&apos;re on the list!
          </h3>
          <p className="text-[#8a9a8e] mb-8">
            WhatsApp is opening — we&apos;ll confirm your trek details and answer any questions there.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm ${name}. I just filled the form on TreksDekho.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25d366] hover:bg-[#1ebe5d] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Open WhatsApp
            </a>
            <a href="#treks" className="border border-[#f5f0e8]/10 text-[#f5f0e8] font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3a2a] transition-colors">
              Browse More Treks
            </a>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="join" className="bg-[#0f1f17] py-20 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#1a3a2a] rounded-3xl p-8 border border-[#f5f0e8]/5"
        >
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-[#f5f0e8] text-3xl mb-2">
              Find Your Perfect Trek
            </h2>
            <p className="text-[#8a9a8e] text-sm">
              Tell us what you&apos;re looking for. We&apos;ll match you and confirm on WhatsApp within 2 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-[#f5f0e8] text-sm font-medium mb-1.5">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Desai"
                required
                className="w-full bg-[#0f1f17] border border-[#f5f0e8]/10 text-[#f5f0e8] placeholder-[#8a9a8e] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8902a]/50 transition-colors"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-[#f5f0e8] text-sm font-medium mb-1.5">WhatsApp number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full bg-[#0f1f17] border border-[#f5f0e8]/10 text-[#f5f0e8] placeholder-[#8a9a8e] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#c8902a]/50 transition-colors"
              />
            </div>

            {/* Group size */}
            <div>
              <label className="block text-[#f5f0e8] text-sm font-medium mb-2">Group size</label>
              <div className="grid grid-cols-4 gap-2">
                {GROUP_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setGroupSize(s)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      groupSize === s
                        ? 'bg-[#c8902a] text-white'
                        : 'bg-[#0f1f17] text-[#8a9a8e] border border-[#f5f0e8]/10 hover:text-[#f5f0e8]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[#f5f0e8] text-sm font-medium mb-2">Difficulty preference</label>
              <div className="grid grid-cols-4 gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      difficulty === d
                        ? 'bg-[#c8902a] text-white'
                        : 'bg-[#0f1f17] text-[#8a9a8e] border border-[#f5f0e8]/10 hover:text-[#f5f0e8]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {state === 'error' && (
              <p className="text-[#c94f3a] text-sm text-center">
                Something went wrong. Try the WhatsApp button below instead.
              </p>
            )}

            <button
              type="submit"
              disabled={state === 'loading' || !name || !phone || !groupSize || !difficulty}
              className="w-full bg-[#c8902a] hover:bg-[#e8a838] disabled:opacity-50 disabled:cursor-not-allowed text-white font-heading font-bold py-4 rounded-2xl transition-colors text-base"
            >
              {state === 'loading' ? 'Sending…' : 'Find My Trek on WhatsApp →'}
            </button>

            <p className="text-center text-[#8a9a8e] text-xs">
              We&apos;ll reach out within 2 hours. No spam, ever.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
