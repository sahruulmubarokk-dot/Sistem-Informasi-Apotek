import React from 'react';

interface AuditLogItem {
  id: string;
  transaction_date: string;
  type: string;
  total_payment: number;
  profiles?: {
    full_name: string;
  } | null;
}

interface AuditLogProps {
  logs: AuditLogItem[];
  loading: boolean;
}

export const AuditLog: React.FC<AuditLogProps> = ({ logs, loading }) => {
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} WIB`;
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Sistem Keamanan / Audit Trail
      </h3>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-800"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs flex-grow">
          Belum ada riwayat log keamanan masuk.
        </div>
      ) : (
        <div className="space-y-3 max-h-[220px] overflow-y-auto text-xs flex-grow">
          {logs.map((log) => {
            const cashierName = log.profiles?.full_name || 'System';
            const isResep = log.type === 'resep';

            return (
              <div 
                key={log.id} 
                className={`border-l-2 pl-3 py-1 ${isResep ? 'border-amber-500' : 'border-emerald-500'}`}
              >
                <p className="text-slate-500">
                  <span className="font-semibold text-slate-700">{formatTime(log.transaction_date)}</span> -{' '}
                  <span className="text-slate-800 font-bold">{cashierName}</span> berhasil melakukan checkout invoice{' '}
                  <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">{log.id}</span> ({isResep ? 'Resep' : 'Umum'})
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
