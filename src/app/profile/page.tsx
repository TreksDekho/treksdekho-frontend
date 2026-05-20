'use client';
import { useState } from 'react';
import { User, MapPin, Zap, Save, Edit2, Check } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const FITNESS_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

const fitnessColors: Record<string, string> = {
  beginner:     'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
  advanced:     'bg-orange-100 text-orange-700 border-orange-200',
  expert:       'bg-red-100 text-red-700 border-red-200',
};

export default function ProfilePage() {
  const { user, login } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);

  const [form, setForm] = useState({
    fullName:        user?.fullName        ?? '',
    username:        user?.username        ?? '',
    bio:             user?.bio             ?? '',
    homeCity:        user?.homeCity        ?? '',
    homeCountry:     user?.homeCountry     ?? '',
    fitnessLevel:    user?.fitnessLevel    ?? 'intermediate',
    experienceYears: user?.experienceYears ?? 0,
  });

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/auth/me', form);
      // Update the Zustand store with fresh user data
      useAuthStore.setState({ user: data.data });
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Update failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setForm({
      fullName:        user?.fullName        ?? '',
      username:        user?.username        ?? '',
      bio:             user?.bio             ?? '',
      homeCity:        user?.homeCity        ?? '',
      homeCountry:     user?.homeCountry     ?? '',
      fitnessLevel:    user?.fitnessLevel    ?? 'intermediate',
      experienceYears: user?.experienceYears ?? 0,
    });
    setEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header card */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#1b4332] flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {user?.fullName?.[0] ?? 'T'}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">{user?.fullName ?? 'Trekker'}</h1>
          <p className="text-sm text-gray-500">@{user?.username}</p>
          <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${fitnessColors[user?.fitnessLevel ?? 'intermediate']}`}>
            {user?.fitnessLevel}
          </span>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-ghost shrink-0">
            <Edit2 size={15} /> Edit
          </button>
        ) : (
          <div className="flex gap-2 shrink-0">
            <button onClick={cancel} className="btn-ghost">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary">
              <Save size={15} />{saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Treks', value: user?.totalTreks ?? 0 },
          { label: 'Distance', value: `${(user?.totalDistanceKm ?? 0).toLocaleString()} km` },
          { label: 'Elevation', value: `${(user?.totalElevationM ?? 0).toLocaleString()} m` },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Edit form / read-only view */}
      <div className="card space-y-5">
        <h2 className="font-bold text-gray-900 flex items-center gap-2"><User size={16} className="text-[#2d6a4f]" /> Personal Info</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Full Name</label>
            {editing ? (
              <input className="input" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
            ) : (
              <p className="text-sm font-medium text-gray-900">{user?.fullName || '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Username</label>
            {editing ? (
              <input className="input" value={form.username} onChange={(e) => set('username', e.target.value)} pattern="[a-zA-Z0-9_]+" />
            ) : (
              <p className="text-sm font-medium text-gray-900">@{user?.username || '—'}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Bio</label>
          {editing ? (
            <textarea
              className="input resize-none"
              rows={3}
              value={form.bio}
              maxLength={500}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Tell other trekkers about yourself…"
            />
          ) : (
            <p className="text-sm text-gray-700">{user?.bio || <span className="text-gray-400 italic">No bio yet</span>}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1 flex items-center gap-1"><MapPin size={11} />City</label>
            {editing ? (
              <input className="input" value={form.homeCity} placeholder="e.g. Dehradun" onChange={(e) => set('homeCity', e.target.value)} />
            ) : (
              <p className="text-sm font-medium text-gray-900">{user?.homeCity || '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Country</label>
            {editing ? (
              <input className="input" value={form.homeCountry} placeholder="e.g. India" onChange={(e) => set('homeCountry', e.target.value)} />
            ) : (
              <p className="text-sm font-medium text-gray-900">{user?.homeCountry || '—'}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1 flex items-center gap-1"><Zap size={11} />Fitness Level</label>
          {editing ? (
            <div className="grid grid-cols-4 gap-2">
              {FITNESS_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => set('fitnessLevel', lvl)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all capitalize ${
                    form.fitnessLevel === lvl
                      ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#2d6a4f]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          ) : (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${fitnessColors[user?.fitnessLevel ?? 'intermediate']}`}>
              <Check size={11} className="mr-1" />{user?.fitnessLevel}
            </span>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Years of Experience</label>
          {editing ? (
            <input
              className="input w-32"
              type="number"
              min={0}
              max={60}
              value={form.experienceYears}
              onChange={(e) => set('experienceYears', Number(e.target.value))}
            />
          ) : (
            <p className="text-sm font-medium text-gray-900">{user?.experienceYears ?? 0} year{user?.experienceYears !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
    </div>
  );
}
