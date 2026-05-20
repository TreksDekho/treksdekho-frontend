'use client';
import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function TopBar() {
  const { user } = useAuthStore();

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1 max-w-sm relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]"
          placeholder="Search trails, buddies…"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
          <Bell size={18} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#e76f51] rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white text-xs font-bold">
            {user?.fullName?.[0] ?? 'T'}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user?.fullName ?? 'Trekker'}
          </span>
        </div>
      </div>
    </header>
  );
}
