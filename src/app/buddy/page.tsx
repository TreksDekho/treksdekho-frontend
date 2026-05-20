'use client';
import { useState, useEffect } from 'react';
import { Users, MapPin, Flame, Mountain, Send, ChevronRight, Star } from 'lucide-react';
import { cn, fitnessColor } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';


interface BuddyCandidate {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  homeCity: string | null;
  homeCountry: string | null;
  fitnessLevel: string;
  experienceYears: number;
  totalTreks: number;
  streakDays: number;
  sharedInterests: string[];
  matchScore: number;
  proximityScore: number;
  fitnessScore: number;
  dateScore: number;
  interestScore: number;
  experienceScore: number;
  distanceKm: number;
}

function ScoreBar({ label, value, max = 30, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span><span>{value}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100">
        <div className={`h-1.5 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MatchScoreRing({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? '#2d6a4f' : score >= 50 ? '#457b9d' : '#e76f51';
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
        {score}
      </span>
    </div>
  );
}

export default function BuddyPage() {
  const [matches, setMatches] = useState<BuddyCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [radiusKm, setRadiusKm] = useState(200);
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/buddy/matches?radiusKm=${radiusKm}&limit=20`);
      setMatches(data.data);
    } catch {
      // keep demo data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(); }, []); // eslint-disable-line

  const sendRequest = async (recipientId: string) => {
    setSending(recipientId);
    try {
      await api.post('/buddy/request', { recipientId });
      setSent((prev) => new Set([...prev, recipientId]));
      toast.success('Buddy request sent!');
    } catch {
      toast.error('Failed to send request.');
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="section-title text-2xl">Trek Buddy Matching</h1>
        <p className="section-subtitle">Find a compatible trail companion based on fitness, location, and interests</p>
      </div>

      {/* Controls */}
      <div className="card flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Search radius</label>
          <input
            type="range" min={25} max={500} step={25}
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-32 accent-[#2d6a4f]"
          />
          <span className="text-sm font-semibold text-[#2d6a4f] w-16">{radiusKm} km</span>
        </div>
        <button onClick={fetchMatches} className="btn-primary ml-auto">
          <Users size={16} /> Find Buddies
        </button>
      </div>

      {/* Algorithm legend */}
      <div className="card bg-[#f0fdf4] border-green-100">
        <p className="text-xs font-semibold text-[#2d6a4f] mb-2">HOW MATCHING WORKS</p>
        <div className="grid grid-cols-5 gap-2 text-xs text-center text-gray-600">
          {[['📍 Proximity', '30 pts'], ['💪 Fitness', '25 pts'], ['📅 Dates', '20 pts'], ['🎯 Interests', '15 pts'], ['🏔️ Experience', '10 pts']].map(([l, v]) => (
            <div key={l} className="bg-white rounded-lg p-2">
              <div className="font-medium">{l}</div>
              <div className="text-[#2d6a4f] font-bold">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Match Cards */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="card animate-pulse h-36 bg-gray-100" />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No matches found</p>
          <p className="text-sm mt-1">Try increasing the search radius or update your profile dates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => (
            <div key={m.id} className="card flex gap-5 items-start">
              {/* Avatar + score ring */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white font-bold text-lg">
                  {m.fullName[0]}
                </div>
                <MatchScoreRing score={m.matchScore} />
                <span className="text-[10px] text-gray-400">match</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{m.fullName}</h3>
                    <p className="text-xs text-gray-500">@{m.username}</p>
                  </div>
                  <span className={cn('badge', fitnessColor(m.fitnessLevel))}>{m.fitnessLevel}</span>
                </div>

                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                  {m.homeCity && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />{m.homeCity}{m.homeCountry ? `, ${m.homeCountry}` : ''}
                      &nbsp;·&nbsp;{m.distanceKm} km away
                    </span>
                  )}
                  <span className="flex items-center gap-1"><Mountain size={11} />{m.totalTreks} treks</span>
                  <span className="flex items-center gap-1"><Star size={11} />{m.experienceYears}y experience</span>
                  {m.streakDays > 0 && <span className="flex items-center gap-1"><Flame size={11} className="text-orange-500" />{m.streakDays}d streak</span>}
                </div>

                {m.sharedInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {m.sharedInterests.map((i) => (
                      <span key={i} className="badge bg-green-50 text-green-700">{i}</span>
                    ))}
                  </div>
                )}

                {/* Score breakdown */}
                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
                  <ScoreBar label="Proximity" value={m.proximityScore} max={30} color="bg-[#2d6a4f]" />
                  <ScoreBar label="Fitness" value={m.fitnessScore} max={25} color="bg-[#457b9d]" />
                  <ScoreBar label="Dates" value={m.dateScore} max={20} color="bg-[#e76f51]" />
                  <ScoreBar label="Interests" value={m.interestScore} max={15} color="bg-purple-500" />
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => sendRequest(m.id)}
                  disabled={sending === m.id || sent.has(m.id)}
                  className={cn('btn-primary text-sm py-1.5 px-3', sent.has(m.id) && 'bg-green-600 hover:bg-green-700')}
                >
                  {sent.has(m.id) ? '✓ Sent' : sending === m.id ? 'Sending…' : <><Send size={14} /> Connect</>}
                </button>
                <button className="btn-ghost text-sm py-1.5 px-3 border border-gray-200">
                  <ChevronRight size={14} /> Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
