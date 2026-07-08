import { useEffect, useState } from 'react';
import { dbMedicine, Medicine, MedicineBatch } from '../services/dbMedicine';
import { supabase, isMockMode } from '../services/supabase';

export const useMedicine = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<MedicineBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mengambil data obat dan batch ter-update
  const fetchData = async () => {
    try {
      setError(null);
      const [medsData, batchesData] = await Promise.all([
        dbMedicine.getMedicines(),
        dbMedicine.getActiveBatches(),
      ]);
      setMedicines(medsData);
      setBatches(batchesData);
    } catch (e: any) {
      console.error('Error fetching inventory data:', e);
      setError(e.message || 'Gagal memuat data persediaan obat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (isMockMode) {
      const handleMockUpdate = () => {
        fetchData();
      };
      window.addEventListener('mock-db-update', handleMockUpdate);
      return () => {
        window.removeEventListener('mock-db-update', handleMockUpdate);
      };
    }

    // Menerapkan fitur Supabase Realtime untuk memantau perubahan tabel obat dan batch secara instan
    const realtimeChannel = supabase
      .channel('realtime-inventory-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medicine' },
        () => {
          fetchData(); // Muat ulang data saat ada entri/edit obat baru
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medicine_batch' },
        () => {
          fetchData(); // Muat ulang data saat stok batch berubah (misal: setelah checkout/restock)
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, []);

  return {
    medicines,
    batches,
    loading,
    error,
    refreshData: fetchData,
  };
};
