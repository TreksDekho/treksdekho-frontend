'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass, Map, Users, ShieldAlert, BarChart3,
  BackpackIcon, Leaf, LogOut, UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

const nav = [
  { href: '/',             label: 'Dashboard',      icon: Compass },
  { href: '/trails',       label: 'Trails',          icon: Map },
  { href: '/buddy',        label: 'Trek Buddy',      icon: Users },
  { href: '/safety',       label: 'Safety',          icon: ShieldAlert },
  { href: '/progress',     label: 'My Progress',     icon: BarChart3 },
  { href: '/gear',         label: 'Gear Checklist',  icon: BackpackIcon },
  { href: '/conservation', label: 'Conservation',    icon: Leaf },
  { href: '/profile',      label: 'Profile',         icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="w-60 shrink-0 bg-[#1b4332] text-white flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Compass size={22} className="text-[#b7e4c7]" />
          <span className="font-bold text-sm leading-tight">
            Trekker&apos;s<br />
            <span className="text-[#b7e4c7]">Digital Compass</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10',
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
