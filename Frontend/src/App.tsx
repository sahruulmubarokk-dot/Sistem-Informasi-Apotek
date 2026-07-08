import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/auth/Login';
import { POS } from './pages/pos/POS';
import { Dashboard } from './pages/dashboard/Dashboard';
import { formatFullDate } from './utils/format';

const AppContent: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'pos' | 'dashboard'>('pos');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update live clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400"></div>
        <p className="text-slate-400 text-sm font-medium">Memuat sistem ApotekSim...</p>
      </div>
    );
  }

  // Auth Guard: Jika belum login, tampilkan halaman Login
  if (!user) {
    return <Login />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-100 font-sans">
      
      {/* SIDEBAR ASIDE */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0">
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Logo / Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="font-bold text-lg text-white tracking-wide">ApotekSim</span>
          </div>

          {/* Navigasi Utama */}
          <nav className="flex-1 px-4 py-4 space-y-1.5">
            <button 
              onClick={() => setActiveTab('pos')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pos' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Point of Sales (POS)
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Dasbor Administrasi
            </button>
          </nav>
        </div>

        {/* Info Pengguna / Role Active */}
        <div className="p-4 border-t border-slate-800 flex items-center gap-3 bg-slate-950">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400 uppercase">
            {profile?.role?.substring(0, 3) || 'ADM'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{profile?.full_name || 'Apoteker Supervisor'}</p>
            <p className="text-[10px] text-slate-500 truncate capitalize">{profile?.role || 'Administrator'}</p>
          </div>
          <button 
            onClick={signOut}
            className="text-slate-500 hover:text-rose-400 transition-colors"
            title="Keluar Sesi"
          >
            <svg className="w-4 h-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* VIEW KONTEN UTAMA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Topbar Aplikasi */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">
              {activeTab === 'pos' ? 'Point of Sales (POS) Apotek' : 'Dasbor Administrasi Apotek'}
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sistem Terhubung (Live)
            </span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-700">{formatFullDate(currentTime)}</p>
            <p className="text-[10px] text-slate-400">Sistem Akurasi Basis Data FEFO Aktif</p>
          </div>
        </header>

        {/* Kontainer Area Peta Rute */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === 'pos' ? <POS /> : <Dashboard />}
        </div>
      </main>

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};
export default App;
