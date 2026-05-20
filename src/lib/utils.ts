import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)} km`;
}

export function formatElevation(m: number): string {
  return `${m.toLocaleString()}m`;
}

export function difficultyColor(d: string): string {
  return {
    easy:     'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    hard:     'bg-orange-100 text-orange-800',
    expert:   'bg-red-100 text-red-800',
  }[d] ?? 'bg-gray-100 text-gray-800';
}

export function fitnessColor(f: string): string {
  return {
    beginner:     'bg-emerald-100 text-emerald-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced:     'bg-purple-100 text-purple-800',
    expert:       'bg-red-100 text-red-800',
  }[f] ?? 'bg-gray-100 text-gray-800';
}
