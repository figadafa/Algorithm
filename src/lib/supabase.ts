import { createClient } from '@supabase/supabase-js';
import { Platform, AppState, AppStateStatus } from 'react-native';
import { getSecureItem, setSecureItem, deleteSecureItem } from './secureStorage';

// Pastikan variabel lingkungan sudah terisi
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_ANON_KEY di .env');
}

// Adapter untuk Expo SecureStore dan localStorage
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => getSecureItem(key),
  setItem: (key: string, value: string) => setSecureItem(key, value),
  removeItem: (key: string) => deleteSecureItem(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Mengelola AppState dan auto-refresh Supabase session secara global
AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
  if (nextAppState === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Panggil startAutoRefresh saat modul dimuat jika statusnya aktif
if (AppState.currentState === 'active') {
  supabase.auth.startAutoRefresh();
}


