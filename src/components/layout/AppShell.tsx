'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

// Routes anyone can access without auth
const PUBLIC_ROUTES = ['/', '/login', '/register'];
// Routes that logged-in users should be bounced away from
const AUTH_ONLY_ROUTES = ['/login', '/register'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, hydrate } = useAuthStore();
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    hydrate().finally(() => setReady(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
  const isAuthOnly = AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    if (!ready) return;
    if (!user && !isPublic) router.replace('/login');
    if (user && isAuthOnly) router.replace('/dashboard');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user, isPublic, isAuthOnly]);

  // Loading splash for protected routes only
  if (!ready && !isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-[#1b4332] rounded-2xl flex items-center justify-center animate-pulse">
            <Compass size={28} className="text-[#b7e4c7]" />
          </div>
          <p className="text-sm text-gray-500">Loading your compass…</p>
        </div>
      </div>
    );
  }

  // Redirect in progress — render nothing while navigating
  if (ready && !user && !isPublic) return null;
  if (ready && user && isAuthOnly) return null;

  // Public routes (landing / login / register) render without any chrome
  if (isPublic) {
    return <>{children}</>;
  }

  // Authenticated: full app shell
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f8f7f4]">
          {children}
        </main>
      </div>
    </div>
  );
}
