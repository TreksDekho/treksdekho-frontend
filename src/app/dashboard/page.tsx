'use client';
import { useEffect, useState } from 'react';
import { Map, Users, ShieldCheck, Flame, TrendingUp, Award, Mountain, Star } from 'lucide-react';
import Link from 'next/link';
import { difficultyColor } from '@/lib/utils';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';

interface TrekLog {
  id: string; trailName: string; region: string | null;
  distanceKm: number; elevationGainM: number;
  rating: number | null; difficulty: string;
  startedAt: string;
}

const quickActions = [
  { href: '/trails', label: 'Find a Trail', desc: 'Discover trails near you', icon: Map, color: 'bg-[#2d6a4f]' },
  { href: '/buddy', label: 'Find a Buddy', desc: 'Match with a trekking partner', icon: Users, color: 'bg-[#457b9d]' },
  { href: '/safety', label: 'Safety Check', desc: 'Set SOS & check-in timer', icon: ShieldCheck, color: 'bg-[#e76f51]' },
  { href: '/gear', label: 'Gear Check', desc: 'Review your packing list', icon: Award, color: 'bg-[#6b705c]' },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<TrekLog[]>([]);

  useEffect(() => {
    api.get('/auth/me/trek-logs').then(r => setLogs(r.data.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Treks Completed', value: String(user?.totalTreks ?? 0), icon: Map, color: 'bg-green-50 text-green-700' },
    { label: 'Total Distance', value: `${(user?.totalDistanceKm ?? 0).toLocaleString()} km`, icon: TrendingUp, color: 'bg-blue-50 text-blue-700' },
    { label: 'Elevation Gained', value: `${(user?.totalElevationM ?? 0).toLocaleString()} m`, icon: Mountain, color: 'bg-purple-50 text-purple-700' },
    { label: 'Day Streak', value: `${user?.streakDays ?? 0} 🔥`, icon: Flame, color: 'bg-orange-50 text-orange-700' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-white p-8">
        <p className="text-[#b7e4c7] text-sm font-medium mb-1">Good morning, {user?.fullName ?? 'Trekker'} 👋</p>
        <h1 className="text-3xl font-bold mb-2">Ready for your next adventure?</h1>
        <p className="text-white/70 text-sm max-w-md">
          Explore trails, find a trek buddy, and stay safe on the mountain. Your compass is ready.
        </p>
        <Link href="/trails" className="mt-5 inline-flex items-center gap-2 bg-white text-[#1b4332] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#b7e4c7] transition-colors">
          <Map size={16} /> Explore Trails
        </Link>
      </div>

      <div>
        <h2 className="section-title">Your Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${color}`}><Icon size={20} /></div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map(({ href, label, desc, icon: Icon, color }) => (
            <Link key={href} href={href} className="card flex items-center gap-4 hover:shadow-md transition-shadow group">
              <div className={`p-3 rounded-xl ${color} text-white shrink-0`}><Icon size={22} /></div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-[#2d6a4f] transition-colors">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-title">Recent Activity</h2>
        {logs.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">
            <Map size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No treks logged yet</p>
            <p className="text-sm mt-1">Complete your first trek to see your journal here.</p>
            <Link href="/trails" className="btn-primary mt-4 mx-auto w-fit">Find a Trail</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.slice(0, 3).map((log) => (
              <div key={log.id} className="card flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-[#1b4332]/10 flex items-center justify-center shrink-0">
                  <Mountain size={20} className="text-[#2d6a4f]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{log.trailName}</p>
                    <span className={`badge ${difficultyColor(log.difficulty)}`}>{log.difficulty}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {log.region} · {new Date(log.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-800">{log.distanceKm} km</p>
                  {log.rating && (
                    <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />{log.rating}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <Link href="/progress" className="text-[#2d6a4f] text-sm font-medium hover:underline flex items-center gap-1 pl-1">
              View full trek journal →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
