import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isMockMode = !supabaseUrl || supabaseUrl.includes('your-supabase-project') || supabaseUrl.includes('viuqzncsprgdfnlvwzwb');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Peringatan: Variabel lingkungan VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum dikonfigurasi di file .env');
}

export const supabase = createClient(
  isMockMode ? 'https://placeholder-project.supabase.co' : supabaseUrl,
  isMockMode ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key' : supabaseAnonKey
);

