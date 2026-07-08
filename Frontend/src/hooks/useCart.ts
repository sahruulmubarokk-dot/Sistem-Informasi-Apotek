import { useState } from 'react';
import { Medicine } from '../services/dbMedicine';
import { dbTransaction } from '../services/dbTransaction';

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface PrescriptionDetails {
  doctor_name: string;
  doctor_sip: string;
  patient_name: string;
  is_racikan: boolean;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [transactionType, setTransactionType] = useState<'umum' | 'resep'>('umum');
  const [paymentMethod, setPaymentMethod] = useState<'tunai' | 'debit' | 'qris'>('tunai');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prescriptionDetails, setPrescriptionDetails] = useState<PrescriptionDetails>({
    doctor_name: '',
    doctor_sip: '',
    patient_name: '',
    is_racikan: false,
  });

  // Tambah item ke keranjang kasir
  const addToCart = (medicine: Medicine) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        const newQty = existing.quantity + 1;
        // Jangan biarkan melebihi stok yang tersedia di database
        if (newQty > medicine.stock_total) return prev;
        return prev.map(item =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: newQty }
            : item
        );
      }
      if (medicine.stock_total <= 0) return prev;
      return [...prev, { medicine, quantity: 1 }];
    });
  };

  // Hapus item dari keranjang kasir
  const removeFromCart = (medicineId: string) => {
    setCartItems(prev => prev.filter(item => item.medicine.id !== medicineId));
  };

  // Ubah jumlah kuantitas item kasir secara manual
  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.medicine.id === medicineId) {
          const targetQty = Math.min(quantity, item.medicine.stock_total);
          return { ...item, quantity: targetQty };
        }
        return item;
      })
    );
  };

  // Mengosongkan keranjang setelah selesai transaksi
  const clearCart = () => {
    setCartItems([]);
    setAmountPaid(0);
    setPrescriptionDetails({
      doctor_name: '',
      doctor_sip: '',
      patient_name: '',
      is_racikan: false,
    });
    setError(null);
  };

  // Kalkulasi finansial real-time
  const subtotal = cartItems.reduce((acc, item) => acc + item.medicine.price * item.quantity, 0);
  const ppn = Math.round(subtotal * 0.11); // PPN Medis 11%
  const total = subtotal + ppn;
  const changeReturned = Math.max(0, amountPaid - total);

  // Proses checkout aman
  const checkout = async (): Promise<string | null> => {
    if (cartItems.length === 0) {
      setError('Keranjang belanja kosong.');
      return null;
    }
    if (transactionType === 'resep' && (!prescriptionDetails.doctor_name || !prescriptionDetails.patient_name)) {
      setError('Nama Dokter dan Nama Pasien wajib diisi untuk penjualan resep!');
      return null;
    }
    if (paymentMethod === 'tunai' && amountPaid < total) {
      setError('Uang pembayaran tunai kurang dari total tagihan.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const items = cartItems.map(item => ({
        medicine_id: item.medicine.id,
        quantity: item.quantity,
      }));

      // Memanggil layanan RPC checkout aman dari data corrupt / double booking
      const invoiceId = await dbTransaction.checkout({
        type: transactionType,
        doctor_name: transactionType === 'resep' ? prescriptionDetails.doctor_name : null,
        doctor_sip: transactionType === 'resep' ? prescriptionDetails.doctor_sip : null,
        patient_name: transactionType === 'resep' ? prescriptionDetails.patient_name : null,
        is_racikan: transactionType === 'resep' ? prescriptionDetails.is_racikan : false,
        items,
        payment_method: paymentMethod,
        amount_paid: paymentMethod === 'tunai' ? amountPaid : total,
      });

      clearCart();
      return invoiceId;
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Gagal memproses transaksi kasir.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
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
    loading,
    error,
    setError,
  };
};
