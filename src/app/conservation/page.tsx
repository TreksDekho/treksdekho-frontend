'use client';
import { useEffect, useState } from 'react';
import { Leaf, Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

interface VolunteerEvent {
  id: string;
  title: string;
  description: string | null;
  locationName: string | null;
  organizer: string | null;
  eventDate: string;
  spots: number;
  registered: number;
  tags: string[] | null;
}

const lntPrinciples = [
  { num: 1, title: 'Plan ahead & prepare', desc: 'Know the regulations. Prepare for emergencies.' },
  { num: 2, title: 'Travel on durable surfaces', desc: 'Stay on designated trails. Camp on rock, gravel or dry grass.' },
  { num: 3, title: 'Dispose of waste properly', desc: 'Pack it in, pack it out. Leave no food scraps.' },
  { num: 4, title: 'Leave what you find', desc: "Don't pick wildflowers or disturb natural objects." },
  { num: 5, title: 'Minimise campfire impacts', desc: 'Use a camp stove. No fires above treeline.' },
  { num: 6, title: 'Respect wildlife', desc: 'Observe from a distance. Store food securely.' },
  { num: 7, title: 'Be considerate of others', desc: 'Keep noise down. Yield the trail. Smile.' },
];

export default function ConservationPage() {
  const { user } = useAuthStore();
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [joining, setJoining] = useState<string | null>(null);
  const [joined, setJoined] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.get('/conservation/volunteer-events').then((r) => setEvents(r.data.data)).catch(() => {});
  }, []);

  const join = async (eventId: string) => {
    if (!user) { toast.error('Sign in to register for events'); return; }
    setJoining(eventId);
    try {
      await api.post(`/conservation/volunteer-events/${eventId}/join`);
      setJoined((s) => new Set([...s, eventId]));
      setEvents((ev) => ev.map((e) => e.id === eventId ? { ...e, registered: e.registered + 1 } : e));
      toast.success("You're registered! See you on the trail 🌿");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Could not register';
      toast.error(msg);
    } finally {
      setJoining(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="section-title text-2xl">Conservation & Volunteering</h1>
        <p className="section-subtitle">Protect the trails you love. Give back to the mountains.</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-white p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shrink-0">🌿</div>
        <div>
          <p className="text-[#b7e4c7] text-xs font-semibold mb-1">ECO-CONSCIOUS MEMBER</p>
          <h2 className="text-xl font-bold">Leave No Trace Badge</h2>
          <p className="text-white/70 text-sm mt-1">Attend one volunteer event and follow LNT principles to earn this badge on your profile.</p>
        </div>
      </div>

      <div>
        <h2 className="section-title">Upcoming Volunteer Events</h2>
        {events.length === 0 ? (
          <div className="card text-center py-12 text-gray-400">
            <Leaf size={36} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No upcoming events yet</p>
            <p className="text-sm mt-1">Check back soon — new clean-up events are added regularly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((e) => {
              const spotsLeft = e.spots - e.registered;
              const pct = Math.min(100, (e.registered / e.spots) * 100);
              const isJoined = joined.has(e.id);
              return (
                <div key={e.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900">{e.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={11} />{new Date(e.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {e.locationName && <span className="flex items-center gap-1"><MapPin size={11} />{e.locationName}</span>}
                        {e.organizer && <span className="flex items-center gap-1"><Users size={11} />{e.organizer}</span>}
                      </div>
                      {e.description && <p className="text-sm text-gray-600 mt-2">{e.description}</p>}
                      {e.tags && e.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">{e.tags.map((t) => <span key={t} className="badge bg-green-100 text-green-700">{t}</span>)}</div>
                      )}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{e.registered} registered</span>
                          <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100">
                          <div className="h-1.5 rounded-full bg-green-500 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => join(e.id)}
                      disabled={isJoined || spotsLeft === 0 || joining === e.id}
                      className={`btn-primary shrink-0 text-sm py-2 px-4 ${isJoined ? 'opacity-60 cursor-default' : ''}`}
                    >
                      {joining === e.id ? <Loader2 size={14} className="animate-spin" /> : <Leaf size={14} />}
                      {isJoined ? 'Joined' : spotsLeft === 0 ? 'Full' : 'Join'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="font-bold text-gray-900 mb-4">🌿 7 Leave No Trace Principles</h2>
        <div className="space-y-3">
          {lntPrinciples.map((p) => (
            <div key={p.num} className="flex gap-3 items-start">
              <span className="w-7 h-7 rounded-full bg-[#2d6a4f] text-white text-xs font-bold flex items-center justify-center shrink-0">{p.num}</span>
              <div>
                <p className="font-semibold text-sm text-gray-900">{p.title}</p>
                <p className="text-xs text-gray-500">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
