import React from 'react';
import { PrescriptionDetails } from '../../hooks/useCart';

interface RecipeFormProps {
  details: PrescriptionDetails;
  onChange: (details: PrescriptionDetails) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ details, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...details,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200 shadow-sm transition-all space-y-4">
      <div className="flex items-center gap-2 text-amber-800">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="font-bold text-sm">Dokumentasi & Regulasi Resep Dokter (Wajib Obat Keras)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-amber-900 mb-2">Nama Dokter</label>
          <input
            type="text"
            name="doctor_name"
            placeholder="Dr. Budi Santoso"
            value={details.doctor_name}
            onChange={handleInputChange}
            className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs focus:outline-amber-500 text-slate-800"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-amber-900 mb-2">No. SIP Dokter</label>
          <input
            type="text"
            name="doctor_sip"
            placeholder="SIP/123/X/2026"
            value={details.doctor_sip}
            onChange={handleInputChange}
            className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs focus:outline-amber-500 text-slate-800"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-amber-900 mb-2">Nama Pasien</label>
          <input
            type="text"
            name="patient_name"
            placeholder="Ny. Ratna Sari"
            value={details.patient_name}
            onChange={handleInputChange}
            className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs focus:outline-amber-500 text-slate-800"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_racikan"
          id="is-racikan"
          checked={details.is_racikan}
          onChange={handleInputChange}
          className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="is-racikan" className="text-xs font-medium text-amber-900">
          Transaksi mencakup Obat Racikan (Sistem otomatis memotong multi-stok bahan baku)
        </label>
      </div>
    </div>
  );
};
