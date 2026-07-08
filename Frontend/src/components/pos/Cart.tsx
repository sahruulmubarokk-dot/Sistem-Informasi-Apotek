import React from 'react';
import { CartItem } from '../../hooks/useCart';
import { formatRupiah } from '../../utils/format';

interface CartProps {
  items: CartItem[];
  subtotal: number;
  ppn: number;
  total: number;
  paymentMethod: 'tunai' | 'debit' | 'qris';
  amountPaid: number;
  changeReturned: number;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onPaymentMethodChange: (method: 'tunai' | 'debit' | 'qris') => void;
  onAmountPaidChange: (amount: number) => void;
  onCheckout: () => void;
  loading: boolean;
  error: string | null;
}

export const Cart: React.FC<CartProps> = ({
  items,
  subtotal,
  ppn,
  total,
  paymentMethod,
  amountPaid,
  changeReturned,
  onRemove,
  onUpdateQty,
  onPaymentMethodChange,
  onAmountPaidChange,
  onCheckout,
  loading,
  error
}) => {
  const invoicePlaceholder = `INV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-000`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header Invoice */}
      <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex justify-between items-center">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Ringkasan Invoice
        </h3>
        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
          {invoicePlaceholder}
        </span>
      </div>

      {/* Daftar Item Keranjang */}
      <div className="p-4 flex-1 space-y-4 max-h-[320px] overflow-y-auto min-h-[180px]">
        {items.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Keranjang kosong. Pilih obat dari katalog.
          </div>
        ) : (
          items.map(item => (
            <div key={item.medicine.id} className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex-1 mr-4">
                <h4 className="text-xs font-bold text-slate-900">{item.medicine.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-400">
                    {formatRupiah(item.medicine.price)}
                  </span>
                  <div className="flex items-center border border-slate-200 rounded">
                    <button 
                      type="button" 
                      onClick={() => onUpdateQty(item.medicine.id, item.quantity - 1)}
                      className="px-1.5 py-0.5 bg-slate-50 text-slate-500 hover:bg-slate-100 text-xs"
                    >-</button>
                    <span className="px-2 text-xs font-semibold text-slate-800">{item.quantity}</span>
                    <button 
                      type="button" 
                      onClick={() => onUpdateQty(item.medicine.id, item.quantity + 1)}
                      className="px-1.5 py-0.5 bg-slate-50 text-slate-500 hover:bg-slate-100 text-xs"
                    >+</button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-950">
                  {formatRupiah(item.medicine.price * item.quantity)}
                </span>
                <button 
                  onClick={() => onRemove(item.medicine.id)}
                  className="text-slate-300 hover:text-rose-500 transition-all"
                  title="Hapus"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Kalkulasi Biaya */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Subtotal Item</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>PPN Medis (11%)</span>
          <span>{formatRupiah(ppn)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2 mt-1">
          <span>Total Bayar</span>
          <span className="text-emerald-600">{formatRupiah(total)}</span>
        </div>
      </div>

      {/* Pembayaran & Aksi */}
      <div className="p-4 bg-white border-t border-slate-200 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Metode Pembayaran</label>
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button" 
              onClick={() => onPaymentMethodChange('tunai')}
              className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 justify-center transition-all border ${
                paymentMethod === 'tunai' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Tunai
            </button>
            <button 
              type="button" 
              onClick={() => onPaymentMethodChange('debit')}
              className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 justify-center transition-all border ${
                paymentMethod === 'debit' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Debit/EDC
            </button>
            <button 
              type="button" 
              onClick={() => onPaymentMethodChange('qris')}
              className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 justify-center transition-all border ${
                paymentMethod === 'qris' 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M4 8h16M4 16h16" />
              </svg>
              QRIS
            </button>
          </div>
        </div>

        {paymentMethod === 'tunai' && (
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Uang Diterima</label>
              <input 
                type="number" 
                placeholder="Rp 50.000"
                value={amountPaid || ''}
                onChange={(e) => onAmountPaidChange(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-sm focus:outline-emerald-500 text-right text-slate-800"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 py-1">
              <span>Kembalian</span>
              <span className="font-bold text-slate-800">{formatRupiah(changeReturned)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <button 
          onClick={onCheckout}
          disabled={loading || items.length === 0}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm p-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Selesaikan Transaksi & Cetak
            </>
          )}
        </button>
      </div>
    </div>
  );
};
