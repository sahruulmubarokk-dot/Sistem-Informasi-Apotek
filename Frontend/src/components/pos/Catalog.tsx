import React, { useState } from 'react';
import { Medicine, MedicineBatch } from '../../services/dbMedicine';
import { formatRupiah } from '../../utils/format';

interface CatalogProps {
  medicines: Medicine[];
  batches: MedicineBatch[];
  onItemClick: (medicine: Medicine) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ medicines, batches, onItemClick }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mendapatkan data batch terdekat berdasarkan tanggal kadaluwarsa (FEFO Queue)
  const getEarliestBatch = (medicineId: string) => {
    const medBatches = batches
      .filter(b => b.medicine_id === medicineId && b.stock > 0)
      .sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());
    return medBatches[0] || null;
  };

  const categories = ['all', ...Array.from(new Set(medicines.map(m => m.category)))];

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase()) || 
                         med.id.toLowerCase().includes(search.toLowerCase()) ||
                         med.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || med.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      {/* Bagian Filter & Pencarian */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Kategori Obat</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-emerald-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Semua Kategori' : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pencarian Obat</label>
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Ketik nama obat, kategori, atau kode..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-100 pt-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Katalog Obat Aktif (Real-time FEFO Queue)
        </h3>
        <span className="text-xs text-slate-500">Klik item untuk menambah ke keranjang</span>
      </div>

      {filteredMedicines.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          Tidak ada obat yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMedicines.map(med => {
            const earliestBatch = getEarliestBatch(med.id);
            const isStockCritical = med.stock_total <= med.min_stock;
            const hasNoStock = med.stock_total <= 0;

            let borderClass = 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/10';
            if (hasNoStock) {
              borderClass = 'border-slate-100 opacity-60 cursor-not-allowed';
            } else if (isStockCritical) {
              borderClass = 'border-rose-200 bg-rose-50/10 hover:border-rose-400';
            }

            return (
              <div 
                key={med.id} 
                onClick={() => !hasNoStock && onItemClick(med)}
                className={`border rounded-lg p-3 cursor-pointer transition-all flex justify-between items-start ${borderClass}`}
              >
                <div className="space-y-1">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-sm ${
                    med.category.toLowerCase().includes('keras') || med.category.toLowerCase().includes('resep')
                      ? 'bg-red-50 text-red-700' 
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {med.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{med.name}</h4>
                  
                  {earliestBatch ? (
                    <div className="text-xs space-y-0.5">
                      <p className="text-slate-500">Batch Terdekat: <span className="text-slate-700 font-semibold">{earliestBatch.batch_code}</span></p>
                      <p className="text-rose-600 font-medium">ED: {new Date(earliestBatch.expiry_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} (Antrean 1)</p>
                    </div>
                  ) : (
                    <p className="text-xs text-rose-500 font-semibold">Batch Kadaluwarsa / Tidak Ada Batch Aktif</p>
                  )}
                </div>
                
                <div className="text-right flex flex-col items-end justify-between h-full min-h-[60px]">
                  <span className="text-xs font-bold text-emerald-600">{formatRupiah(med.price)} / Unit</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    hasNoStock 
                      ? 'bg-slate-100 text-slate-500' 
                      : isStockCritical 
                        ? 'bg-rose-100 text-rose-700 animate-pulse' 
                        : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    Stok: {med.stock_total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
