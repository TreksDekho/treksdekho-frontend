'use client';
import { create } from 'zustand';
import api from '@/lib/api';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  homeCity: string | null;
  homeCountry: string | null;
  fitnessLevel: string;
  experienceYears: number;
  totalDistanceKm: number;
  totalElevationM: number;
  totalTreks: number;
  streakDays: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string; password: string; fullName: string; username: string; fitnessLevel: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const deviceId = localStorage.getItem('device_id') ?? crypto.randomUUID();
      localStorage.setItem('device_id', deviceId);
      const { data } = await api.post('/auth/login', { email, password, deviceId });
      localStorage.setItem('access_token', data.data.accessToken);
      localStorage.setItem('refresh_token', data.data.refreshToken);
      const me = await api.get('/auth/me');
      set({ user: me.data.data, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  register: async (formData) => {
    set({ loading: true });
    try {
      await api.post('/auth/register', formData);
      set({ loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) await api.post('/auth/logout', { refreshToken });
    } catch { /* ignore */ }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null });
  },

  hydrate: async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 <= Date.now()) return;
      const { data } = await api.get('/auth/me');
      set({ user: data.data });
    } catch { /* token invalid — stay logged out */ }
  },
}));
