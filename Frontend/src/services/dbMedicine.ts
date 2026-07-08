import { supabase, isMockMode } from './supabase';
import { mockDbService } from './mockData';

export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  min_stock: number;
  stock_total: number;
  created_at?: string;
}

export interface MedicineBatch {
  id: string;
  medicine_id: string;
  batch_code: string;
  expiry_date: string;
  stock: number;
  supplier_id?: string;
  created_at?: string;
}

export const dbMedicine = {
  // Mengambil semua data obat terdaftar
  async getMedicines(): Promise<Medicine[]> {
    if (isMockMode) {
      return mockDbService.getMedicines();
    }
    const { data, error } = await supabase
      .from('medicine')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Mengambil semua batch obat aktif (belum kedaluwarsa)
  async getActiveBatches(): Promise<MedicineBatch[]> {
    if (isMockMode) {
      return mockDbService.getActiveBatches();
    }
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('medicine_batch')
      .select('*')
      .gt('expiry_date', today)
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Menyimpan (tambah/edit) data master obat
  async saveMedicine(medicine: Partial<Medicine> & { id: string }): Promise<Medicine> {
    if (isMockMode) {
      return mockDbService.saveMedicine(medicine);
    }
    const { data, error } = await supabase
      .from('medicine')
      .upsert(medicine)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Menghapus data master obat
  async deleteMedicine(id: string): Promise<void> {
    if (isMockMode) {
      return mockDbService.deleteMedicine(id);
    }
    const { error } = await supabase
      .from('medicine')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
