import React, { useState } from 'react';
import { useMedicine } from '../../hooks/useMedicine';
import { useCart } from '../../hooks/useCart';
import { Catalog } from '../../components/pos/Catalog';
import { Cart } from '../../components/pos/Cart';
import { RecipeForm } from '../../components/pos/RecipeForm';

export const POS: React.FC = () => {
  const { medicines, batches, loading: medLoading } = useMedicine();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    ppn,
    total,
    transactionType,
    setTransactionType,
    prescriptionDetails,
    setPrescriptionDetails,
    paymentMethod,
    setPaymentMethod,
    amountPaid,
    setAmountPaid,
    changeReturned,
    checkout,
    loading: checkoutLoading,
    error
  } = useCart();

  const [successInvoice, setSuccessInvoice] = useState<string | null>(null);

  const handleCheckout = async () => {
    const invoiceId = await checkout();
    if (invoiceId) {
      setSuccessInvoice(invoiceId);
      // Banner sukses hilang setelah 5 detik
      setTimeout(() => setSuccessInvoice(null), 5000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Kolom Kiri: Katalog & Form Resep */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Banner Sukses Transaksi */}
        {successInvoice && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span>Checkout Kasir Berhasil! Nomor Invoice: </span>
              <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded text-emerald-950 font-bold">{successInvoice}</span>
            </div>
          </div>
        )}

        {/* Tipe Transaksi */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tipe Transaksi</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'umum' | 'resep')}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-emerald-500 text-slate-700"
            >
              <option value="umum">Penjualan Umum (Tanpa Resep)</option>
              <option value="resep">Penjualan Resep Dokter</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-center">
            <p className="text-xs text-slate-400 mt-5">
              * Logika database FEFO otomatis memotong stok dari batch kedaluwarsa terdekat yang aktif.
            </p>
          </div>
        </div>

        {/* Form Resep jika Tipe Transaksi = Resep */}
        {transactionType === 'resep' && (
          <RecipeForm
            details={prescriptionDetails}
            onChange={setPrescriptionDetails}
          />
        )}

        {/* Katalog Obat */}
        {medLoading ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <Catalog
            medicines={medicines}
            batches={batches}
            onItemClick={addToCart}
          />
        )}
      </div>

      {/* Kolom Kanan: Keranjang Belanja */}
      <div>
        <Cart
          items={cartItems}
          subtotal={subtotal}
          ppn={ppn}
          total={total}
          paymentMethod={paymentMethod}
          amountPaid={amountPaid}
          changeReturned={changeReturned}
          onRemove={removeFromCart}
          onUpdateQty={updateQuantity}
          onPaymentMethodChange={setPaymentMethod}
          onAmountPaidChange={setAmountPaid}
          onCheckout={handleCheckout}
          loading={checkoutLoading}
          error={error}
        />
      </div>
    </div>
  );
};
