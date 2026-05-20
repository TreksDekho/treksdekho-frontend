'use client';
import { useEffect, useState, useRef } from 'react';
import { BarChart3, TrendingUp, Mountain, Award, Flame, Calendar, Star, Plus, X, Search } from 'lucide-react';
import { difficultyColor } from '@/lib/utils';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

interface Medal { id: string; name: string; desc: string; icon: string; category: string; earnedAt: string | null }
interface Challenge { id: string; title: string; desc: string; target: number; unit: string; ends: string; progress: number }
interface TrekLog {
  id: string; trailName: string; region: string | null; distanceKm: number;
  elevationGainM: number; durationSeconds: number | null; rating: number | null;
  difficulty: string; notes: string | null; startedAt: string;
}
interface TrailOption { id: string; name: string; region: string | null; distanceKm: number; difficulty: string }

function LogTrekModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [trails, setTrails] = useState<TrailOption[]>([]);
  const [trailQuery, setTrailQuery] = useState('');
  const [selectedTrail, setSelectedTrail] = useState<TrailOption | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [form, setForm] = useState({
    distanceKm: '', elevationGainM: '', durationHours: '', durationMins: '',
    userRating: '5', notes: '', startedAt: new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchTrails = (q: string) => {
    setTrailQuery(q);
    setShowDropdown(true);
    if (searchRef.current) clearTimeout(searchRef.current);
    if (!q.trim()) { setTrails([]); return; }
    searchRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get(`/trails?q=${encodeURIComponent(q)}&limit=8`);
        setTrails(data.data);
      } catch { /* ignore */ }
    }, 300);
  };

  const pick = (t: TrailOption) => {
    setSelectedTrail(t);
    setTrailQuery(t.name);
    setShowDropdown(false);
    setForm((f) => ({ ...f, distanceKm: String(t.distanceKm) }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrail) { toast.error('Select a trail first'); return; }
    setSaving(true);
    try {
      const durationSecs = form.durationHours || form.durationMins
        ? (Number(form.durationHours || 0) * 3600 + Number(form.durationMins || 0) * 60) || undefined
        : undefined;
      await api.post('/auth/me/trek-logs', {
        trailId:        selectedTrail.id,
        distanceKm:     Number(form.distanceKm),
        elevationGainM: Number(form.elevationGainM),
        durationSeconds: durationSecs,
        userRating:     Number(form.userRating),
        notes:          form.notes || undefined,
        startedAt:      new Date(form.startedAt).toISOString(),
      });
      // Refresh user stats from server
      const me = await api.get('/auth/me');
      useAuthStore.setState({ user: me.data.data });
      toast.success('Trek logged! 🏔️');
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to log trek';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">Log a Trek</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          {/* Trail search */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Trail</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input pl-8"
                placeholder="Search trail name…"
                value={trailQuery}
                onChange={(e) => searchTrails(e.target.value)}
                onFocus={() => trailQuery && setShowDropdown(true)}
                autoComplete="off"
              />
              {showDropdown && trails.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 z-10 max-h-48 overflow-y-auto">
                  {trails.map((t) => (
                    <button key={t.id} type="button" onMouseDown={() => pick(t)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm">
                      <span className="font-medium">{t.name}</span>
                      {t.region && <span className="text-gray-400 ml-2 text-xs">{t.region}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!selectedTrail && trailQuery.length > 2 && trails.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">No trails found — try a different name.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Distance (km)</label>
              <input className="input" type="number" step="0.1" min="0" required
                value={form.distanceKm} onChange={(e) => setForm((f) => ({ ...f, distanceKm: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Elevation gain (m)</label>
              <input className="input" type="number" min="0" required
                value={form.elevationGainM} onChange={(e) => setForm((f) => ({ ...f, elevationGainM: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Date</label>
            <input className="input" type="date" required value={form.startedAt}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setForm((f) => ({ ...f, startedAt: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Duration (hours)</label>
              <input className="input" type="number" min="0" placeholder="0"
                value={form.durationHours} onChange={(e) => setForm((f) => ({ ...f, durationHours: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Duration (mins)</label>
              <input className="input" type="number" min="0" max="59" placeholder="0"
                value={form.durationMins} onChange={(e) => setForm((f) => ({ ...f, durationMins: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setForm((f) => ({ ...f, userRating: String(n) }))}
                  className={`w-9 h-9 rounded-xl text-sm font-medium border transition-all ${
                    Number(form.userRating) >= n ? 'bg-amber-400 text-white border-amber-400' : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Notes (optional)</label>
            <textarea className="input resize-none" rows={3} placeholder="How was the trek? Conditions, highlights…"
              value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>

          <button type="submit" disabled={saving || !selectedTrail} className="btn-primary w-full justify-center py-2.5">
            {saving ? 'Saving…' : 'Save Trek'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { user } = useAuthStore();
  const [medals, setMedals] = useState<Medal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [logs, setLogs] = useState<TrekLog[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);

  const loadLogs = () => api.get('/auth/me/trek-logs').then(r => setLogs(r.data.data)).catch(() => {});

  useEffect(() => {
    api.get('/auth/me/medals').then(r => setMedals(r.data.data)).catch(() => {});
    api.get('/auth/me/challenges').then(r => setChallenges(r.data.data)).catch(() => {});
    loadLogs();
  }, []);

  const formatDuration = (secs: number | null) => {
    if (!secs) return null;
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    return d > 0 ? `${d}d ${h}h` : `${h}h`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {showLogModal && <LogTrekModal onClose={() => setShowLogModal(false)} onSaved={loadLogs} />}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl">My Progress</h1>
          <p className="section-subtitle">Your trek journal, achievements, and monthly challenges</p>
        </div>
        <button onClick={() => setShowLogModal(true)} className="btn-primary shrink-0">
          <Plus size={16} /> Log Trek
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Distance', value: `${(user?.totalDistanceKm ?? 0).toLocaleString()} km`, icon: TrendingUp, color: 'bg-blue-50 text-blue-700' },
          { label: 'Elevation Gained', value: `${(user?.totalElevationM ?? 0).toLocaleString()} m`, icon: Mountain, color: 'bg-green-50 text-green-700' },
          { label: 'Treks Logged', value: String(user?.totalTreks ?? 0), icon: BarChart3, color: 'bg-purple-50 text-purple-700' },
          { label: 'Day Streak', value: `${user?.streakDays ?? 0} days 🔥`, icon: Flame, color: 'bg-orange-50 text-orange-700' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${color}`}><Icon size={18} /></div>
            <div>
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Challenges */}
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-[#e76f51]" /> Monthly Challenges
          </h2>
          <div className="space-y-4">
            {challenges.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No active challenges this month.</p>
            ) : challenges.map((c) => {
              const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
              return (
                <div key={c.id ?? c.title}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.desc}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      ends {new Date(c.ends).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-[#2d6a4f] transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                      {c.progress}/{c.target} {c.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medals */}
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award size={18} className="text-[#e76f51]" /> Medals & Badges
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {medals.length === 0 ? (
              <p className="text-xs text-gray-400 col-span-3 text-center py-4">No medals yet — keep trekking!</p>
            ) : medals.map((m) => (
              <div
                key={m.id ?? m.name}
                className={`rounded-xl p-3 text-center border transition-all ${
                  m.earnedAt
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-100 bg-gray-50 opacity-50 grayscale'
                }`}
              >
                <div className="text-2xl mb-1">{m.icon || '🏅'}</div>
                <p className="text-xs font-semibold text-gray-800 leading-tight">{m.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{m.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            {medals.filter(m => !m.earnedAt).length} medals still to unlock
          </p>
        </div>
      </div>

      {/* Trek Journal */}
      <div className="card">
        <h2 className="font-bold text-gray-900 mb-4">Trek Journal</h2>
        {logs.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <BarChart3 size={36} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No trek logs yet</p>
            <p className="text-sm mt-1">Your GPS-recorded treks will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border border-gray-100 rounded-xl p-4 hover:border-[#2d6a4f]/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{log.trailName}</h3>
                      <span className={`badge ${difficultyColor(log.difficulty)}`}>{log.difficulty}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {log.region} · {new Date(log.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {log.notes && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{log.notes}</p>}
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    {log.rating && (
                      <div className="flex items-center justify-end gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-800">{log.rating}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">{log.distanceKm} km</p>
                    <p className="text-xs text-gray-500">⬆️ {(log.elevationGainM ?? 0).toLocaleString()} m</p>
                    {log.durationSeconds && <p className="text-xs text-gray-500">{formatDuration(log.durationSeconds)}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
