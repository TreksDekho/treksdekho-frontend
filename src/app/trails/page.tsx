'use client';
import { useState, useEffect } from 'react';
import { Search, MapPin, Mountain, Clock, Star, Filter, ChevronDown, Droplets, X, TrendingUp, Bookmark } from 'lucide-react';
import { cn, difficultyColor, formatDistance } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth';


interface Trail {
  id: string;
  name: string;
  region: string | null;
  country: string;
  distanceKm: number;
  elevationGainM: number;
  difficulty: string;
  estimatedHoursMin: number | null;
  estimatedHoursMax: number | null;
  avgRating: number | null;
  ratingCount: number;
  waterSourcesCount: number;
  tags: string[];
}

interface TrailDetail extends Trail {
  description: string | null;
  maxElevationM: number | null;
  routeType: string | null;
  conditions: Array<{ condition: string; notes: string | null; reportedAt: string }>;
  saved: boolean;
}

function TrailDrawer({ trailId, onClose }: { trailId: string; onClose: () => void }) {
  const [detail, setDetail] = useState<TrailDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    api.get(`/trails/${trailId}`).then(r => setDetail(r.data.data)).catch(() => toast.error('Failed to load trail')).finally(() => setLoading(false));
  }, [trailId]);

  const toggleSave = async () => {
    if (!user) { toast.error('Sign in to save trails'); return; }
    if (!detail) return;
    try {
      if (detail.saved) {
        await api.delete(`/trails/${trailId}/save`);
        setDetail((d) => d ? { ...d, saved: false } : d);
        toast.success('Removed from saved trails');
      } else {
        await api.post(`/trails/${trailId}/save`);
        setDetail((d) => d ? { ...d, saved: true } : d);
        toast.success('Trail saved!');
      }
    } catch { toast.error('Could not update saved trails'); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 flex items-center gap-3 p-4">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
          <h2 className="font-bold text-gray-900 flex-1 truncate">{detail?.name ?? 'Trail Details'}</h2>
          {detail && (
            <button onClick={toggleSave} className={cn('p-1.5 rounded-lg transition-colors', detail.saved ? 'text-[#2d6a4f] bg-[#2d6a4f]/10' : 'text-gray-400 hover:bg-gray-100')}>
              <Bookmark size={18} fill={detail.saved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : detail ? (
          <div className="p-5 space-y-5">
            {/* Difficulty + rating */}
            <div className="flex items-center gap-3">
              <span className={cn('badge', difficultyColor(detail.difficulty))}>{detail.difficulty}</span>
              {detail.avgRating && (
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  <Star size={13} fill="currentColor" />
                  <span className="font-medium">{detail.avgRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-xs">({detail.ratingCount} ratings)</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={14} />{detail.region ? `${detail.region}, ` : ''}{detail.country}
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Mountain, label: 'Distance', value: formatDistance(detail.distanceKm) },
                { icon: TrendingUp, label: 'Elevation gain', value: `+${detail.elevationGainM}m` },
                ...(detail.estimatedHoursMin ? [{ icon: Clock, label: 'Est. time', value: `${detail.estimatedHoursMin}–${detail.estimatedHoursMax}h` }] : []),
                ...(detail.maxElevationM ? [{ icon: Mountain, label: 'Max elevation', value: `${detail.maxElevationM}m` }] : []),
                ...(detail.waterSourcesCount > 0 ? [{ icon: Droplets, label: 'Water sources', value: String(detail.waterSourcesCount) }] : []),
                ...(detail.routeType ? [{ icon: Mountain, label: 'Route type', value: detail.routeType }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                    <Icon size={11} />{label}
                  </div>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {detail.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">About this trail</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{detail.description}</p>
              </div>
            )}

            {/* Tags */}
            {detail.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {detail.tags.map((tag) => (
                  <span key={tag} className="badge bg-gray-100 text-gray-600">{tag}</span>
                ))}
              </div>
            )}

            {/* Live conditions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Conditions</h3>
              {detail.conditions.length === 0 ? (
                <p className="text-xs text-gray-400">No condition reports yet.</p>
              ) : (
                <div className="space-y-2">
                  {detail.conditions.slice(0, 5).map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-[#2d6a4f] mt-1 shrink-0" />
                      <div>
                        <span className="font-medium text-gray-800 capitalize">{c.condition.replace(/_/g, ' ')}</span>
                        {c.notes && <span className="text-gray-500"> — {c.notes}</span>}
                        <span className="text-gray-400 ml-1">· {new Date(c.reportedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="p-6 text-gray-400 text-sm">Trail not found.</p>
        )}
      </div>
    </div>
  );
}

const DIFFICULTIES = ['easy', 'moderate', 'hard', 'expert'];

export default function TrailsPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [total, setTotal] = useState(0);

  const fetchTrails = async (q = query, diff = difficulty) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (diff) params.set('difficulty', diff);
      params.set('limit', '20');
      const { data } = await api.get(`/trails?${params}`);
      setTrails(data.data);
      setTotal(data.meta.total);
    } catch {
      // keep demo data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrails(); }, []); // eslint-disable-line

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {selectedId && <TrailDrawer trailId={selectedId} onClose={() => setSelectedId(null)} />}
      {/* Header */}
      <div>
        <h1 className="section-title text-2xl">Trail Discovery</h1>
        <p className="section-subtitle">
          Crowdsourced routes with real-time conditions · {total} trails available
        </p>
      </div>

      {/* Search & Filters */}
      <div className="card flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by name, region…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTrails()}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <div className="relative">
            <select
              className="input pr-8 appearance-none cursor-pointer"
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); fetchTrails(query, e.target.value); }}
            >
              <option value="">All difficulties</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button onClick={() => fetchTrails()} className="btn-primary">Search</button>
      </div>

      {/* Trail Cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse h-40 bg-gray-100" />
          ))}
        </div>
      ) : trails.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <Mountain size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No trails found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {trails.map((trail) => (
            <div key={trail.id} onClick={() => setSelectedId(trail.id)} className="card hover:shadow-md transition-shadow cursor-pointer group">
              {/* Difficulty banner */}
              <div className="flex items-start justify-between mb-3">
                <span className={cn('badge text-xs', difficultyColor(trail.difficulty))}>
                  {trail.difficulty}
                </span>
                {trail.avgRating && (
                  <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Star size={13} fill="currentColor" />
                    <span className="font-medium">{trail.avgRating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({trail.ratingCount})</span>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-gray-900 group-hover:text-[#2d6a4f] transition-colors mb-1">
                {trail.name}
              </h3>

              <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                <MapPin size={12} />
                {trail.region ? `${trail.region}, ` : ''}{trail.country}
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Mountain size={12} className="text-[#2d6a4f]" />
                  {formatDistance(trail.distanceKm)}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13 16 8 11 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                  +{trail.elevationGainM}m
                </span>
                {trail.estimatedHoursMin && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-[#457b9d]" />
                    {trail.estimatedHoursMin}–{trail.estimatedHoursMax}h
                  </span>
                )}
                {trail.waterSourcesCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Droplets size={12} className="text-blue-500" />
                    {trail.waterSourcesCount} water source{trail.waterSourcesCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {trail.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {trail.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="badge bg-gray-100 text-gray-600">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
