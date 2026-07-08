import React, { createContext, useEffect, useState } from 'react';
import { supabase, isMockMode } from '../services/supabase';
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'apoteker' | 'kasir';
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mengambil profile data (role) dari tabel profiles database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (e) {
      console.error('Error fetching user profile role:', e);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Ambil sesi awal pada saat aplikasi dimuat
    if (isMockMode) {
      const mockUserStr = localStorage.getItem('mock_user');
      if (mockUserStr) {
        const parsed = JSON.parse(mockUserStr);
        setUser(parsed.user);
        setProfile(parsed.profile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Dengarkan perubahan status autentikasi secara dinamis
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    if (isMockMode) {
      let role: 'admin' | 'apoteker' | 'kasir' = 'kasir';
      let fullName = 'Kasir Demo';
      if (email.startsWith('admin')) {
        role = 'admin';
        fullName = 'Administrator Demo';
      } else if (email.startsWith('apoteker')) {
        role = 'apoteker';
        fullName = 'Apoteker Demo';
      } else if (email.startsWith('kasir')) {
        role = 'kasir';
        fullName = 'Kasir Demo';
      } else {
        setLoading(false);
        throw new Error('Email tidak dikenali dalam Mock Mode. Gunakan: admin@..., apoteker@..., atau kasir@...');
      }
      const mockUser = {
        user: { id: `usr-${role}`, email } as any,
        profile: { id: `usr-${role}`, full_name: fullName, role }
      };
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser.user);
      setProfile(mockUser.profile);
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    if (isMockMode) {
      localStorage.removeItem('mock_user');
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      throw error;
    }
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
