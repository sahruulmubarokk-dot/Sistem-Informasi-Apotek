import { Medicine, MedicineBatch } from './dbMedicine';
import { Supplier } from './dbSupplier';
import { CheckoutPayload, RestockPayload } from './dbTransaction';

// Helper untuk dispatch event realtime tiruan ke hooks
export const notifyMockUpdate = () => {
  window.dispatchEvent(new Event('mock-db-update'));
};

// 1. Data Pemasok (Supplier) Awal
const defaultSuppliers: Supplier[] = [
  {
    id: 'SPL-001',
    name: 'PT. Kalbe Farma Tbk',
    phone: '021-8983322',
    address: 'Kawasan Industri Delta Silicon, Cikarang, Bekasi',
    status: 'utama'
  },
  {
    id: 'SPL-002',
    name: 'PT. Kimia Farma Apotek',
    phone: '021-3844444',
    address: 'Jl. Veteran No. 9, Jakarta Pusat',
    status: 'aktif'
  },
  {
    id: 'SPL-003',
    name: 'PT. Penta Valent',
    phone: '021-58302000',
    address: 'Jl. Kedoya Raya No. 33, Jakarta Barat',
    status: 'aktif'
  }
];

// 2. Data Master Obat (Medicine) Awal
const defaultMedicines: Medicine[] = [
  {
    id: 'OBT-001',
    name: 'Paracetamol 500mg (Strip)',
    category: 'Analgesik / Antipiretik',
    price: 12500,
    min_stock: 30,
    stock_total: 130
  },
  {
    id: 'OBT-002',
    name: 'Amoxicillin 500mg (Strip)',
    category: 'Antibiotik',
    price: 24000,
    min_stock: 20,
    stock_total: 95
  },
  {
    id: 'OBT-003',
    name: 'Cetirizine 10mg (Strip)',
    category: 'Antihistamin',
    price: 15000,
    min_stock: 15,
    stock_total: 40
  },
  {
    id: 'OBT-004',
    name: 'Vitamin C 1000mg (Botol)',
    category: 'Vitamin & Suplemen',
    price: 48500,
    min_stock: 10,
    stock_total: 25
  },
  {
    id: 'OBT-005',
    name: 'Ibuprofen 400mg (Strip)',
    category: 'Analgesik / Antipiretik',
    price: 19500,
    min_stock: 25,
    stock_total: 0 // Kosong untuk skenario demo restock
  }
];

// Helper untuk format tanggal format YYYY-MM-DD relatif dari hari ini
const getFutureDate = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

// 3. Data Batch Obat (Medicine Batch) Awal dengan tgl kedaluwarsa FEFO
const defaultBatches = (): MedicineBatch[] => [
  // Paracetamol
  {
    id: 'bch-par-01',
    medicine_id: 'OBT-001',
    batch_code: 'BCH-PAR-A01',
    expiry_date: getFutureDate(10), // Expire sangat dekat (10 hari lagi) -> FEFO prioritas 1
    stock: 30,
    supplier_id: 'SPL-001'
  },
  {
    id: 'bch-par-02',
    medicine_id: 'OBT-001',
    batch_code: 'BCH-PAR-A02',
    expiry_date: getFutureDate(180), // Expire 6 bulan lagi -> FEFO prioritas 2
    stock: 100,
    supplier_id: 'SPL-002'
  },
  // Amoxicillin
  {
    id: 'bch-amx-01',
    medicine_id: 'OBT-002',
    batch_code: 'BCH-AMX-B01',
    expiry_date: getFutureDate(25), // Expire dekat -> FEFO prioritas 1
    stock: 35,
    supplier_id: 'SPL-001'
  },
  {
    id: 'bch-amx-02',
    medicine_id: 'OBT-002',
    batch_code: 'BCH-AMX-B02',
    expiry_date: getFutureDate(365), // Expire 1 tahun lagi -> FEFO prioritas 2
    stock: 60,
    supplier_id: 'SPL-003'
  },
  // Cetirizine
  {
    id: 'bch-cet-01',
    medicine_id: 'OBT-003',
    batch_code: 'BCH-CET-C01',
    expiry_date: getFutureDate(120),
    stock: 40,
    supplier_id: 'SPL-003'
  },
  // Vitamin C
  {
    id: 'bch-vit-01',
    medicine_id: 'OBT-004',
    batch_code: 'BCH-VIT-D01',
    expiry_date: getFutureDate(45),
    stock: 25,
    supplier_id: 'SPL-002'
  }
];

// 4. Data Transaksi Penjualan Awal untuk Dasbor Grafis
const defaultTransactions = (): any[] => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const today = new Date();

  return [
    {
      id: 'INV-20260629-001',
      transaction_date: yesterday.toISOString(),
      type: 'umum',
      doctor_name: null,
      doctor_sip: null,
      patient_name: 'Budi Santoso',
      is_racikan: false,
      subtotal: 50000,
      ppn: 5000,
      total_payment: 55000,
      amount_paid: 60000,
      change_returned: 5000,
      payment_method: 'tunai',
      created_by: 'usr-kasir',
      profiles: { full_name: 'Kasir Demo' }
    },
    {
      id: 'INV-20260630-001',
      transaction_date: today.toISOString(),
      type: 'resep',
      doctor_name: 'Dr. Andi Pratama',
      doctor_sip: 'SIP/2025/11202',
      patient_name: 'Siti Rahma',
      is_racikan: true,
      subtotal: 96500,
      ppn: 9650,
      total_payment: 106150,
      amount_paid: 110000,
      change_returned: 3850,
      payment_method: 'qris',
      created_by: 'usr-apoteker',
      profiles: { full_name: 'Apoteker Demo' }
    }
  ];
};

// Inisialisasi Database Lokal ke LocalStorage
export const initMockDatabase = () => {
  if (!localStorage.getItem('mock_supplier')) {
    localStorage.setItem('mock_supplier', JSON.stringify(defaultSuppliers));
  }
  if (!localStorage.getItem('mock_medicine')) {
    localStorage.setItem('mock_medicine', JSON.stringify(defaultMedicines));
  }
  if (!localStorage.getItem('mock_batches')) {
    localStorage.setItem('mock_batches', JSON.stringify(defaultBatches()));
  }
  if (!localStorage.getItem('mock_transactions')) {
    localStorage.setItem('mock_transactions', JSON.stringify(defaultTransactions()));
  }
};

// Panggil inisialisasi segera agar data siap digunakan
initMockDatabase();

// Getter & Setter dari LocalStorage
export const getMockSuppliers = (): Supplier[] => JSON.parse(localStorage.getItem('mock_supplier') || '[]');
export const saveMockSuppliers = (data: Supplier[]) => {
  localStorage.setItem('mock_supplier', JSON.stringify(data));
  notifyMockUpdate();
};

export const getMockMedicines = (): Medicine[] => JSON.parse(localStorage.getItem('mock_medicine') || '[]');
export const saveMockMedicines = (data: Medicine[]) => {
  localStorage.setItem('mock_medicine', JSON.stringify(data));
  notifyMockUpdate();
};

export const getMockBatches = (): MedicineBatch[] => JSON.parse(localStorage.getItem('mock_batches') || '[]');
export const saveMockBatches = (data: MedicineBatch[]) => {
  localStorage.setItem('mock_batches', JSON.stringify(data));
  
  // Perbarui total stock di tabel obat utama saat batch berubah
  const meds = getMockMedicines();
  const updatedMeds = meds.map(med => {
    const total = data
      .filter(b => b.medicine_id === med.id && new Date(b.expiry_date) > new Date())
      .reduce((sum, b) => sum + b.stock, 0);
    return { ...med, stock_total: total };
  });
  localStorage.setItem('mock_medicine', JSON.stringify(updatedMeds));
  notifyMockUpdate();
};

export const getMockTransactions = (): any[] => JSON.parse(localStorage.getItem('mock_transactions') || '[]');
export const saveMockTransactions = (data: any[]) => {
  localStorage.setItem('mock_transactions', JSON.stringify(data));
  notifyMockUpdate();
};

// Helper untuk memvalidasi peran pengguna di Mock Mode
const checkRole = (allowedRoles: ('admin' | 'apoteker' | 'kasir')[]) => {
  const activeUserStr = localStorage.getItem('mock_user');
  const profile = activeUserStr ? JSON.parse(activeUserStr).profile : null;
  if (!profile || !allowedRoles.includes(profile.role)) {
    throw new Error('Akses ditolak: Anda tidak memiliki wewenang untuk melakukan tindakan ini.');
  }
};

// Implementasi Operasi Database dalam Mock Mode
export const mockDbService = {
  // --- MEDICINE ---
  async getMedicines(): Promise<Medicine[]> {
    return getMockMedicines();
  },

  async getActiveBatches(): Promise<MedicineBatch[]> {
    const todayStr = new Date().toISOString().split('T')[0];
    return getMockBatches().filter(b => b.expiry_date > todayStr);
  },

  async saveMedicine(medicine: Partial<Medicine> & { id: string }): Promise<Medicine> {
    checkRole(['admin', 'apoteker']);
    const meds = getMockMedicines();
    const idx = meds.findIndex(m => m.id === medicine.id);
    let updated: Medicine;
    
    if (idx >= 0) {
      updated = { ...meds[idx], ...medicine } as Medicine;
      meds[idx] = updated;
    } else {
      updated = {
        ...medicine,
        stock_total: medicine.stock_total || 0,
        created_at: new Date().toISOString()
      } as Medicine;
      meds.push(updated);
    }
    
    saveMockMedicines(meds);
    return updated;
  },

  async deleteMedicine(id: string): Promise<void> {
    checkRole(['admin', 'apoteker']);
    const meds = getMockMedicines().filter(m => m.id !== id);
    const batches = getMockBatches().filter(b => b.medicine_id !== id);
    
    saveMockMedicines(meds);
    saveMockBatches(batches);
  },

  // --- SUPPLIER ---
  async getSuppliers(): Promise<Supplier[]> {
    return getMockSuppliers();
  },

  async saveSupplier(supplier: Partial<Supplier> & { id: string }): Promise<Supplier> {
    checkRole(['admin']);
    const sups = getMockSuppliers();
    const idx = sups.findIndex(s => s.id === supplier.id);
    let updated: Supplier;
    
    if (idx >= 0) {
      updated = { ...sups[idx], ...supplier } as Supplier;
      sups[idx] = updated;
    } else {
      updated = {
        ...supplier,
        created_at: new Date().toISOString()
      } as Supplier;
      sups.push(updated);
    }
    
    saveMockSuppliers(sups);
    return updated;
  },

  async deleteSupplier(id: string): Promise<void> {
    checkRole(['admin']);
    const sups = getMockSuppliers().filter(s => s.id !== id);
    saveMockSuppliers(sups);
  },

  // --- TRANSACTION (ACID CHECKOUT & RESTOCK LOGIC) ---
  async checkout(payload: CheckoutPayload): Promise<string> {
    const medicines = getMockMedicines();
    const batches = getMockBatches();
    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date();

    // 1. Generate Invoice ID
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const txs = getMockTransactions();
    const dayCount = txs.filter(t => t.id.startsWith(`INV-${dateStr}-`)).length + 1;
    const invoiceId = `INV-${dateStr}-${String(dayCount).padStart(3, '0')}`;

    let calculatedSubtotal = 0;
    const transactionItems: any[] = [];

    // 2. Loop Items in Cart
    for (const item of payload.items) {
      const med = medicines.find(m => m.id === item.medicine_id);
      if (!med) {
        throw new Error(`Obat dengan ID ${item.medicine_id} tidak terdaftar.`);
      }

      // Hitung total stok aktif obat ini
      const activeBatches = batches
        .filter(b => b.medicine_id === item.medicine_id && b.expiry_date > todayStr && b.stock > 0)
        .sort((a, b) => a.expiry_date.localeCompare(b.expiry_date)); // FEFO (Ascending)

      const totalAvailable = activeBatches.reduce((s, b) => s + b.stock, 0);
      if (totalAvailable < item.quantity) {
        throw new Error(`Stok obat ${med.name} tidak mencukupi kebutuhan transaksi.`);
      }

      let qtyRemaining = item.quantity;
      for (const batch of activeBatches) {
        if (qtyRemaining <= 0) break;

        const deduct = Math.min(batch.stock, qtyRemaining);
        batch.stock -= deduct;
        qtyRemaining -= deduct;

        calculatedSubtotal += deduct * med.price;
        transactionItems.push({
          medicine_id: med.id,
          batch_id: batch.id,
          quantity: deduct,
          price: med.price,
          total: deduct * med.price
        });
      }
    }

    // 3. Calculate Taxes & Totals
    const ppn = calculatedSubtotal * 0.1;
    const totalPayment = calculatedSubtotal + ppn;
    const changeReturned = payload.amount_paid - totalPayment;

    if (changeReturned < 0) {
      throw new Error(`Jumlah bayar Rp ${payload.amount_paid} kurang dari total belanja Rp ${totalPayment}`);
    }

    // Get current login profile
    const activeUserStr = localStorage.getItem('mock_user');
    const profile = activeUserStr ? JSON.parse(activeUserStr).profile : { full_name: 'Kasir Demo' };

    // 4. Save Transaction
    const newTx = {
      id: invoiceId,
      transaction_date: today.toISOString(),
      type: payload.type,
      doctor_name: payload.doctor_name,
      doctor_sip: payload.doctor_sip,
      patient_name: payload.patient_name,
      is_racikan: payload.is_racikan,
      subtotal: calculatedSubtotal,
      ppn: ppn,
      total_payment: totalPayment,
      amount_paid: payload.amount_paid,
      change_returned: changeReturned,
      payment_method: payload.payment_method,
      created_by: profile.id || 'usr-demo',
      profiles: { full_name: profile.full_name }
    };

    txs.unshift(newTx); // Tambahkan ke baris pertama

    // Commit changes to LocalStorage
    saveMockBatches(batches);
    saveMockTransactions(txs);

    return invoiceId;
  },

  async restock(payload: RestockPayload): Promise<string> {
    checkRole(['admin', 'apoteker']);
    const medicines = getMockMedicines();
    const batches = getMockBatches();

    for (const item of payload.items) {
      const med = medicines.find(m => m.id === item.medicine_id);
      if (!med) {
        throw new Error(`Obat dengan ID ${item.medicine_id} tidak terdaftar.`);
      }

      // Check if batch code already exists for this medicine
      const existingBatch = batches.find(
        b => b.medicine_id === item.medicine_id && b.batch_code === item.batch_code
      );

      if (existingBatch) {
        // Tambahkan stok ke batch yang sama
        existingBatch.stock += item.quantity;
      } else {
        // Buat batch baru (FEFO)
        batches.push({
          id: `bch-${Math.random().toString(36).substr(2, 9)}`,
          medicine_id: item.medicine_id,
          batch_code: item.batch_code,
          expiry_date: item.expiry_date,
          stock: item.quantity,
          supplier_id: payload.supplier_id
        });
      }
    }

    // Commit changes to LocalStorage
    saveMockBatches(batches);

    return payload.invoice_id;
  },

  async getSalesHistory(limit = 100): Promise<any[]> {
    return getMockTransactions().slice(0, limit);
  },

  async getAuditLogs(limit = 50): Promise<any[]> {
    return getMockTransactions().slice(0, limit);
  }
};
