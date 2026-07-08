import { supabase, isMockMode } from './supabase';
import { mockDbService } from './mockData';

export interface CheckoutItem {
  medicine_id: string;
  quantity: number;
}

export interface CheckoutPayload {
  type: 'umum' | 'resep';
  doctor_name: string | null;
  doctor_sip: string | null;
  patient_name: string | null;
  is_racikan: boolean;
  items: CheckoutItem[];
  payment_method: 'tunai' | 'debit' | 'qris';
  amount_paid: number;
}

export interface RestockItem {
  medicine_id: string;
  quantity: number;
  purchase_price: number;
  batch_code: string;
  expiry_date: string;
}

export interface RestockPayload {
  invoice_id: string;
  supplier_id: string;
  items: RestockItem[];
}

export const dbTransaction = {
  // Eksekusi checkout penjualan melalui RPC database aman (FEFO & anti-double booking)
  async checkout(payload: CheckoutPayload): Promise<string> {
    if (isMockMode) {
      return mockDbService.checkout(payload);
    }
    const { data, error } = await supabase.rpc('checkout_transaction', {
      p_type: payload.type,
      p_doctor_name: payload.doctor_name || null,
      p_doctor_sip: payload.doctor_sip || null,
      p_patient_name: payload.patient_name || null,
      p_is_racikan: payload.is_racikan,
      p_items: payload.items,
      p_payment_method: payload.payment_method,
      p_amount_paid: payload.amount_paid
    });

    if (error) throw error;
    return data as string; // Mengembalikan nomor invoice (e.g., INV-20260630-001)
  },

  // Eksekusi transaksi pembelian (restock) obat dari supplier via RPC database
  async restock(payload: RestockPayload): Promise<string> {
    if (isMockMode) {
      return mockDbService.restock(payload);
    }
    const { data, error } = await supabase.rpc('restock_transaction', {
      p_invoice_id: payload.invoice_id,
      p_supplier_id: payload.supplier_id,
      p_items: payload.items
    });

    if (error) throw error;
    return data as string;
  },

  // Mengambil daftar riwayat penjualan untuk admin dashboard
  async getSalesHistory(limit = 100): Promise<any[]> {
    if (isMockMode) {
      return mockDbService.getSalesHistory(limit);
    }
    const { data, error } = await supabase
      .from('sales_transaction')
      .select('*, profiles:created_by (full_name)')
      .order('transaction_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Mengambil daftar audit trail log keamanan secara real-time
  async getAuditLogs(limit = 50): Promise<any[]> {
    if (isMockMode) {
      return mockDbService.getAuditLogs(limit);
    }
    const { data, error } = await supabase
      .from('sales_transaction')
      .select('id, transaction_date, type, total_payment, profiles:created_by (full_name)')
      .order('transaction_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};
