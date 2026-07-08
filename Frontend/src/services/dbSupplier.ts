import { supabase, isMockMode } from './supabase';
import { mockDbService } from './mockData';

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: 'aktif' | 'utama' | 'nonaktif';
  created_at?: string;
}

export const dbSupplier = {
  // Mengambil daftar supplier terdaftar
  async getSuppliers(): Promise<Supplier[]> {
    if (isMockMode) {
      return mockDbService.getSuppliers();
    }
    const { data, error } = await supabase
      .from('supplier')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Menyimpan (tambah/edit) data master supplier
  async saveSupplier(supplier: Partial<Supplier> & { id: string }): Promise<Supplier> {
    if (isMockMode) {
      return mockDbService.saveSupplier(supplier);
    }
    const { data, error } = await supabase
      .from('supplier')
      .upsert(supplier)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Menghapus data master supplier
  async deleteSupplier(id: string): Promise<void> {
    if (isMockMode) {
      return mockDbService.deleteSupplier(id);
    }
    const { error } = await supabase
      .from('supplier')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
