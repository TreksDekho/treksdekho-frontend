'use client';
import { useState } from 'react';
import { ShieldAlert, Bell, Phone, Plus, Timer, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface Contact { name: string; phone: string; email: string; relationship: string; isPrimary: boolean; }
interface Timer { id: string; expectedReturn: string; checkInBy: string; }

export default function SafetyPage() {
  // SOS
  const [sosActive, setSosActive] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosMessage, setSosMessage] = useState('');

  // Check-in Timer
  const [timer, setTimer] = useState<Timer | null>(null);
  const [timerForm, setTimerForm] = useState({ expectedReturn: '', checkInBy: '' });
  const [timerLoading, setTimerLoading] = useState(false);

  // Emergency Contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactForm, setContactForm] = useState<Contact>({ name: '', phone: '', email: '', relationship: '', isPrimary: false });
  const [showContactForm, setShowContactForm] = useState(false);

  const triggerSOS = async () => {
    if (!window.confirm('⚠️ Send SOS alert to all emergency contacts?')) return;
    setSosLoading(true);
    try {
      await api.post('/safety/sos', { message: sosMessage || undefined });
      setSosActive(true);
      toast.error('🚨 SOS SENT — Your contacts have been notified!', { duration: 8000 });
    } catch {
      toast.error('Failed to send SOS');
    } finally {
      setSosLoading(false);
    }
  };

  const setCheckInTimer = async () => {
    if (!timerForm.expectedReturn || !timerForm.checkInBy) {
      toast.error('Please fill in both dates');
      return;
    }
    setTimerLoading(true);
    try {
      const { data } = await api.post('/safety/checkin/timer', {
        expectedReturn: new Date(timerForm.expectedReturn).toISOString(),
        checkInBy: new Date(timerForm.checkInBy).toISOString(),
      });
      setTimer(data.data);
      toast.success('✅ Check-in timer activated!');
    } catch {
      toast.error('Failed to set timer');
    } finally {
      setTimerLoading(false);
    }
  };

  const checkIn = async () => {
    if (!timer) return;
    try {
      await api.post('/safety/checkin', { timerId: timer.id });
      setTimer(null);
      toast.success("✅ Checked in! Your contacts know you're safe.");
    } catch {
      toast.error('Check-in failed');
    }
  };

  const addContact = async () => {
    if (!contactForm.name || !contactForm.phone) {
      toast.error('Name and phone are required');
      return;
    }
    try {
      await api.post('/safety/contacts', contactForm);
      setContacts((prev) => [...prev, contactForm]);
      setContactForm({ name: '', phone: '', email: '', relationship: '', isPrimary: false });
      setShowContactForm(false);
      toast.success('Contact added!');
    } catch {
      toast.error('Failed to add contact');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="section-title text-2xl">Safety Dashboard</h1>
        <p className="section-subtitle">Emergency SOS, check-in timers, and your safety network</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* SOS */}
        <div className={cn('card border-2', sosActive ? 'border-red-200 bg-red-50' : 'border-transparent')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-red-100 text-red-600"><ShieldAlert size={20} /></div>
            <div>
              <h2 className="font-bold text-gray-900">Emergency SOS</h2>
              <p className="text-xs text-gray-500">Alerts all emergency contacts instantly</p>
            </div>
            {sosActive && <span className="ml-auto badge bg-red-100 text-red-700 animate-pulse">ACTIVE</span>}
          </div>

          <textarea
            className="input mb-3 resize-none text-sm"
            rows={2}
            placeholder="Optional: describe your emergency…"
            value={sosMessage}
            onChange={(e) => setSosMessage(e.target.value)}
          />

          {sosActive ? (
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm bg-red-100 rounded-xl p-3">
              <AlertTriangle size={16} />
              SOS is active. Stay visible. Help is coming.
            </div>
          ) : (
            <button
              onClick={triggerSOS}
              disabled={sosLoading}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {sosLoading ? 'Sending…' : '🆘 SEND SOS ALERT'}
            </button>
          )}

          <p className="text-xs text-gray-400 mt-2 text-center">
            Hold 3 seconds on mobile to prevent accidental triggers
          </p>
        </div>

        {/* Check-in Timer */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600"><Timer size={20} /></div>
            <div>
              <h2 className="font-bold text-gray-900">Check-In Timer</h2>
              <p className="text-xs text-gray-500">Auto-alert if you miss your check-in deadline</p>
            </div>
          </div>

          {timer ? (
            <div className="space-y-3">
              <div className="bg-green-50 rounded-xl p-3 text-sm">
                <p className="font-medium text-green-800 flex items-center gap-2">
                  <Bell size={14} /> Timer Active
                </p>
                <p className="text-green-700 text-xs mt-1">
                  Check in by: <strong>{new Date(timer.checkInBy).toLocaleString()}</strong>
                </p>
                <p className="text-green-700 text-xs">
                  Expected return: <strong>{new Date(timer.expectedReturn).toLocaleString()}</strong>
                </p>
              </div>
              <button onClick={checkIn} className="w-full btn-primary justify-center bg-green-600 hover:bg-green-700">
                <CheckCircle2 size={16} /> Check In Now (I&apos;m Safe)
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Expected Return</label>
                <input
                  type="datetime-local"
                  className="input text-sm"
                  value={timerForm.expectedReturn}
                  onChange={(e) => setTimerForm((f) => ({ ...f, expectedReturn: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Check-In Deadline (alert if missed)</label>
                <input
                  type="datetime-local"
                  className="input text-sm"
                  value={timerForm.checkInBy}
                  onChange={(e) => setTimerForm((f) => ({ ...f, checkInBy: e.target.value }))}
                />
              </div>
              <button onClick={setCheckInTimer} disabled={timerLoading} className="w-full btn-primary justify-center">
                <Bell size={16} /> {timerLoading ? 'Activating…' : 'Activate Timer'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600"><Phone size={20} /></div>
            <div>
              <h2 className="font-bold text-gray-900">Emergency Contacts</h2>
              <p className="text-xs text-gray-500">People notified when SOS is triggered</p>
            </div>
          </div>
          <button onClick={() => setShowContactForm(true)} className="btn-ghost border border-gray-200 text-sm">
            <Plus size={15} /> Add Contact
          </button>
        </div>

        {contacts.length === 0 && !showContactForm && (
          <div className="text-center py-8 text-gray-400">
            <Phone size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No emergency contacts added yet</p>
            <button onClick={() => setShowContactForm(true)} className="btn-primary mt-3 mx-auto text-sm">
              <Plus size={14} /> Add your first contact
            </button>
          </div>
        )}

        {contacts.map((c, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                {c.name[0]}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">{c.name} {c.isPrimary && <span className="badge bg-purple-100 text-purple-700 ml-1">Primary</span>}</p>
                <p className="text-xs text-gray-500">{c.phone} · {c.relationship}</p>
              </div>
            </div>
          </div>
        ))}

        {showContactForm && (
          <div className="mt-4 border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">New Contact</p>
              <button onClick={() => setShowContactForm(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="input text-sm" placeholder="Full name *" value={contactForm.name} onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))} />
              <input className="input text-sm" placeholder="Phone *" value={contactForm.phone} onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))} />
              <input className="input text-sm" placeholder="Email" value={contactForm.email} onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))} />
              <input className="input text-sm" placeholder="Relationship" value={contactForm.relationship} onChange={(e) => setContactForm((f) => ({ ...f, relationship: e.target.value }))} />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-[#2d6a4f]" checked={contactForm.isPrimary} onChange={(e) => setContactForm((f) => ({ ...f, isPrimary: e.target.checked }))} />
              Set as primary contact
            </label>
            <button onClick={addContact} className="btn-primary">Save Contact</button>
          </div>
        )}
      </div>

      {/* Medical Quick Reference */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-4">🏥 Medical Quick Reference</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Altitude Sickness', symptoms: 'Headache, nausea, dizziness', action: 'Descend 500m immediately. Rest. Hydrate.' },
            { title: 'Hypothermia', symptoms: 'Shivering, confusion, slurred speech', action: 'Add layers, get to shelter, warm drinks.' },
            { title: 'Blisters', symptoms: 'Hot spots, pain on feet', action: 'Clean, cover with moleskin. Do not pop.' },
            { title: 'Dehydration', symptoms: 'Dark urine, dizziness, dry mouth', action: 'Drink 500ml immediately. Sip regularly.' },
          ].map(({ title, symptoms, action }) => (
            <div key={title} className="rounded-xl border border-gray-100 p-3">
              <p className="font-semibold text-sm text-gray-900">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">Symptoms: {symptoms}</p>
              <p className="text-xs text-[#2d6a4f] font-medium mt-1">→ {action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
