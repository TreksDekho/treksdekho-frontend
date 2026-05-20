'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';
import Link from 'next/link';

const FITNESS_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', username: '', email: '',
    password: '', fitnessLevel: 'intermediate',
  });
  const { register, login, loading } = useAuthStore();
  const router = useRouter();

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    try {
      await register(form);
      // Auto-login after successful registration
      await login(form.email, form.password);
      toast.success('Welcome to the Digital Compass! 🏔️');
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
      const msg =
        axiosErr?.response?.data?.message ??
        axiosErr?.response?.data?.error ??
        'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1b4332] rounded-2xl mb-4">
            <Compass size={28} className="text-[#b7e4c7]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of trekkers on the Digital Compass</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <input className="input" placeholder="Priya Sharma" value={form.fullName}
                  onChange={(e) => set('fullName', e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
                <input className="input" placeholder="priya_treks" value={form.username}
                  onChange={(e) => set('username', e.target.value)} required pattern="[a-zA-Z0-9_]+" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input className="input" type="email" placeholder="your@email.com" value={form.email}
                onChange={(e) => set('email', e.target.value)} required autoComplete="email" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <input className="input" type="password" placeholder="Min. 8 characters" value={form.password}
                onChange={(e) => set('password', e.target.value)} required minLength={8} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Fitness Level</label>
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
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-[#2d6a4f] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
