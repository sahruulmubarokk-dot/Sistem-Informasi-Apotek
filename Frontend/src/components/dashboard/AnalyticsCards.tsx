import React from 'react';
import { Medicine, MedicineBatch } from '../../services/dbMedicine';
import { formatRupiah } from '../../utils/format';

interface AnalyticsCardsProps {
  medicines: Medicine[];
  batches: MedicineBatch[];
  todayRevenue: number;
  monthlyRestockCost: number;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({
  medicines,
  batches,
  todayRevenue,
  monthlyRestockCost
}) => {
  // Hitung jumlah SKU obat yang stoknya di bawah batas minimal (stok kritis)
  const lowStockCount = medicines.filter(m => m.stock_total <= m.min_stock).length;

  // Hitung jumlah batch obat yang akan kedaluwarsa dalam 3 bulan ke depan (90 hari)
  const nearExpiryCount = batches.filter(b => {
    const diffTime = new Date(b.expiry_date).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 90;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Kartu Omset */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold block">Omset Penjualan (Hari Ini)</span>
          <span className="text-2xl font-bold text-slate-900 mt-1">{formatRupiah(todayRevenue)}</span>
          <span className="text-xs text-emerald-600 font-medium block mt-1">
            ▲ Terpantau Real-time
          </span>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>

      {/* Kartu Pengeluaran Restock */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold block">Pembelian Restock (Bulan Ini)</span>
          <span className="text-2xl font-bold text-slate-900 mt-1">{formatRupiah(monthlyRestockCost)}</span>
          <span className="text-xs text-blue-600 font-medium block mt-1">Pengadaan Pemasok Aktif</span>
        </div>
        <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>

      {/* Kartu Stok Kritis */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold block">Alert Stok di Bawah Batas</span>
          <span className={`text-2xl font-bold mt-1 block ${lowStockCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {lowStockCount} SKU Obat
          </span>
          <span className="text-xs text-rose-500 font-medium block mt-1">
            {lowStockCount > 0 ? '⚠️ Butuh Purchase Order Segera' : 'Stok terpenuhi'}
          </span>
        </div>
        <div className={`p-3 rounded-xl ${lowStockCount > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      {/* Kartu Batch Kedaluwarsa */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold block">Batch Mendekati Kedaluwarsa</span>
          <span className={`text-2xl font-bold mt-1 block ${nearExpiryCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {nearExpiryCount} Batch
          </span>
          <span className="text-xs text-amber-600 font-medium block mt-1">
            {nearExpiryCount > 0 ? '⏳ Kurang dari 90 Hari' : 'Seluruh batch aman'}
          </span>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
