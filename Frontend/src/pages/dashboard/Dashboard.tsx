import React, { useState, useEffect } from 'react';
import { useMedicine } from '../../hooks/useMedicine';
import { dbMedicine } from '../../services/dbMedicine';
import { dbSupplier, Supplier } from '../../services/dbSupplier';
import { dbTransaction } from '../../services/dbTransaction';
import { AnalyticsCards } from '../../components/dashboard/AnalyticsCards';
import { SKUTrend } from '../../components/dashboard/SKUTrend';
import { AuditLog } from '../../components/dashboard/AuditLog';
import { formatRupiah } from '../../utils/format';
import { useAuth } from '../../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const userRole = profile?.role || 'kasir';

  const canViewSupplier = userRole === 'admin';
  const canViewRestock = userRole === 'admin' || userRole === 'apoteker';
  const canManageMedicine = userRole === 'admin' || userRole === 'apoteker';
  const canManageSupplier = userRole === 'admin';

  const { medicines, batches, loading: medLoading, refreshData } = useMedicine();
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'medicine' | 'supplier' | 'restock'>('summary');
  
  // States
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forms
  const [medForm, setMedForm] = useState({ id: '', name: '', category: 'Analgesik / Antipiretik', price: 0, min_stock: 10 });
  const [supForm, setSupForm] = useState({ id: '', name: '', phone: '', address: '', status: 'aktif' as 'aktif' | 'utama' | 'nonaktif' });
  const [restockForm, setRestockForm] = useState({
    invoice_id: '',
    supplier_id: '',
    medicine_id: '',
    quantity: 100,
    purchase_price: 5000,
    batch_code: '',
    expiry_date: ''
  });

  const loadDashboardData = async () => {
    setLogsLoading(true);
    try {
      const [supData, logsData] = await Promise.all([
        dbSupplier.getSuppliers(),
        dbTransaction.getAuditLogs()
      ]);
      setSuppliers(supData);
      setAuditLogs(logsData);
      
      if (supData.length > 0) {
        setRestockForm(prev => ({ ...prev, supplier_id: supData[0].id }));
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage('Gagal memuat data administrasi.');
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleMedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medForm.id || !medForm.name || medForm.price <= 0) {
      setErrorMessage('Lengkapi semua input obat dengan benar.');
      return;
    }
    setActionLoading(true);
    setErrorMessage(null);
    try {
      await dbMedicine.saveMedicine(medForm);
      setSuccessMessage(`Obat ${medForm.name} berhasil disimpan.`);
      setMedForm({ id: '', name: '', category: 'Analgesik / Antipiretik', price: 0, min_stock: 10 });
      refreshData();
      loadDashboardData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan obat.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supForm.id || !supForm.name) {
      setErrorMessage('Lengkapi ID dan Nama Supplier.');
      return;
    }
    setActionLoading(true);
    setErrorMessage(null);
    try {
      await dbSupplier.saveSupplier(supForm);
      setSuccessMessage(`Supplier ${supForm.name} berhasil didaftarkan.`);
      setSupForm({ id: '', name: '', phone: '', address: '', status: 'aktif' });
      loadDashboardData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan supplier.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { invoice_id, supplier_id, medicine_id, quantity, purchase_price, batch_code, expiry_date } = restockForm;
    if (!invoice_id || !supplier_id || !medicine_id || !batch_code || !expiry_date) {
      setErrorMessage('Lengkapi seluruh form faktur restock.');
      return;
    }
    setActionLoading(true);
    setErrorMessage(null);
    try {
      await dbTransaction.restock({
        invoice_id,
        supplier_id,
        items: [{
          medicine_id,
          quantity,
          purchase_price,
          batch_code,
          expiry_date
        }]
      });
      setSuccessMessage(`Faktur Pembelian ${invoice_id} berhasil divalidasi. Stok bertambah.`);
      setRestockForm(prev => ({ ...prev, invoice_id: '', batch_code: '', expiry_date: '' }));
      refreshData();
      loadDashboardData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal melakukan transaksi restock.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMed = async (id: string) => {
    if (!window.confirm('Hapus obat ini dari database?')) return;
    try {
      await dbMedicine.deleteMedicine(id);
      setSuccessMessage('Obat berhasil dihapus.');
      refreshData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghapus obat.');
    }
  };

  const handleDeleteSup = async (id: string) => {
    if (!window.confirm('Hapus supplier ini dari database?')) return;
    try {
      await dbSupplier.deleteSupplier(id);
      setSuccessMessage('Supplier berhasil dihapus.');
      loadDashboardData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghapus supplier.');
    }
  };

  // Kalkulasi data analytics
  const todayRevenue = auditLogs.reduce((acc, log) => {
    const isToday = new Date(log.transaction_date).toDateString() === new Date().toDateString();
    return isToday ? acc + Number(log.total_payment) : acc;
  }, 0);

  const monthlyRestockCost = 0; // Dapat dikalkulasi dari tabel purchase_transaction jika diperlukan

  return (
    <div className="space-y-6">
      
      {/* Alert Notifikasi */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-sm font-semibold flex justify-between">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage(null)}>&times;</button>
        </div>
      )}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-sm font-semibold flex justify-between">
          <span>✓ {successMessage}</span>
          <button onClick={() => setSuccessMessage(null)}>&times;</button>
        </div>
      )}

      {/* Sub Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-xl shadow-xs gap-2">
        <button 
          onClick={() => setActiveSubTab('summary')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'summary' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          Ringkasan Eksekutif
        </button>
        <button 
          onClick={() => setActiveSubTab('medicine')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'medicine' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          Master Database Obat
        </button>
        {canViewSupplier && (
          <button 
            onClick={() => setActiveSubTab('supplier')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'supplier' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Master Database Supplier
          </button>
        )}
        {canViewRestock && (
          <button 
            onClick={() => setActiveSubTab('restock')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSubTab === 'restock' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Faktur Restock (Pembelian)
          </button>
        )}
      </div>

      {/* TAB CONTENT: RINGKASAN EKSEKUTIF */}
      {activeSubTab === 'summary' && (
        <div className="space-y-6">
          <AnalyticsCards 
            medicines={medicines}
            batches={batches}
            todayRevenue={todayRevenue}
            monthlyRestockCost={monthlyRestockCost}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SKUTrend medicines={medicines} />
            </div>
            <div>
              <AuditLog logs={auditLogs} loading={logsLoading} />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MASTER OBAT */}
      {activeSubTab === 'medicine' && (
        <div className="space-y-6">
          {/* Form Tambah Obat */}
          {canManageMedicine && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Entri Master Data Obat Baru
              </h3>
              <form onSubmit={handleMedSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">ID Obat</label>
                  <input 
                    type="text" 
                    placeholder="OBT-001"
                    value={medForm.id}
                    onChange={(e) => setMedForm(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Produk / Obat</label>
                  <input 
                    type="text" 
                    placeholder="Cefadroxil 500mg"
                    value={medForm.name}
                    onChange={(e) => setMedForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Golongan / Kategori</label>
                  <select 
                    value={medForm.category}
                    onChange={(e) => setMedForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-700 font-medium"
                  >
                    <option>Antibiotik (Obat Keras)</option>
                    <option>Analgesik / Antipiretik</option>
                    <option>Obat Bebas Terbatas</option>
                    <option>Narkotika / Psikotropika</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Harga Jual Standar (Rp)</label>
                  <input 
                    type="number" 
                    value={medForm.price || ''}
                    onChange={(e) => setMedForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-800"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Min. Stok Alert</label>
                    <input 
                      type="number" 
                      value={medForm.min_stock}
                      onChange={(e) => setMedForm(prev => ({ ...prev, min_stock: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-800"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={actionLoading}
                    className="w-1/2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-3 rounded-lg shadow-sm cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabel Obat */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Arsitektur Tabel Master: `Tabel_Obat`</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3">ID_Obat (PK)</th>
                    <th className="p-3">Nama Obat</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Harga Jual</th>
                    <th className="p-3 text-center">Batas Min</th>
                    <th className="p-3 text-center">Stok Terkonsolidasi</th>
                    {canManageMedicine && <th className="p-3 text-center">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {medLoading ? (
                    <tr>
                      <td colSpan={canManageMedicine ? 7 : 6} className="text-center p-5 text-slate-400">Loading data...</td>
                    </tr>
                  ) : medicines.length === 0 ? (
                    <tr>
                      <td colSpan={canManageMedicine ? 7 : 6} className="text-center p-5 text-slate-400">Belum ada data obat.</td>
                    </tr>
                  ) : (
                    medicines.map((med) => {
                      const isLowStock = med.stock_total <= med.min_stock;
                      return (
                        <tr key={med.id} className={isLowStock ? 'bg-rose-50/30' : ''}>
                          <td className="p-3 font-mono font-medium text-slate-600">{med.id}</td>
                          <td className="p-3 font-bold text-slate-900">{med.name}</td>
                          <td className="p-3">{med.category}</td>
                          <td className="p-3">{formatRupiah(med.price)}</td>
                          <td className="p-3 text-center">{med.min_stock}</td>
                          <td className={`p-3 text-center font-bold ${isLowStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {med.stock_total} Unit {isLowStock && '(Kritis)'}
                          </td>
                          {canManageMedicine && (
                            <td className="p-3 text-center space-x-2">
                              <button 
                                onClick={() => setMedForm(med as any)}
                                className="text-blue-600 hover:underline"
                              >Edit</button>
                              <button 
                                onClick={() => handleDeleteMed(med.id)}
                                className="text-rose-600 hover:underline"
                              >Hapus</button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MASTER SUPPLIER */}
      {activeSubTab === 'supplier' && (
        <div className="space-y-6">
          {/* Form Registrasi Supplier */}
          {canManageSupplier && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Registrasi Master Supplier Baru
              </h3>
              <form onSubmit={handleSupSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">ID Supplier</label>
                  <input 
                    type="text" 
                    placeholder="SPL-001"
                    value={supForm.id}
                    onChange={(e) => setSupForm(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Pemasok / Perusahaan</label>
                  <input 
                    type="text" 
                    placeholder="PT. Kimia Farma Trading"
                    value={supForm.name}
                    onChange={(e) => setSupForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Kontak Narahubung</label>
                  <input 
                    type="text" 
                    placeholder="0812-xxxx-xxxx"
                    value={supForm.phone}
                    onChange={(e) => setSupForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-800"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Status Kemitraan</label>
                    <select
                      value={supForm.status}
                      onChange={(e) => setSupForm(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-700 font-medium"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="utama">Utama / Prioritas</option>
                      <option value="nonaktif">Nonaktif</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={actionLoading}
                    className="w-1/2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-3 rounded-lg shadow-sm cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabel Supplier */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Arsitektur Tabel Master: `Tabel_Supplier`</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3">ID_Supplier (PK)</th>
                    <th className="p-3">Nama Perusahaan Pemasok</th>
                    <th className="p-3">Kontak Telp</th>
                    <th className="p-3">Status Hubungan</th>
                    {canManageSupplier && <th className="p-3 text-center">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {suppliers.length === 0 ? (
                    <tr>
                      <td colSpan={canManageSupplier ? 5 : 4} className="text-center p-5 text-slate-400">Belum ada data supplier.</td>
                    </tr>
                  ) : (
                    suppliers.map(sup => (
                      <tr key={sup.id}>
                        <td className="p-3 font-mono font-medium text-slate-600">{sup.id}</td>
                        <td className="p-3 font-bold text-slate-900">{sup.name}</td>
                        <td className="p-3">{sup.phone || '-'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            sup.status === 'utama' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : sup.status === 'aktif' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-slate-100 text-slate-800'
                          }`}>
                            {sup.status}
                          </span>
                        </td>
                        {canManageSupplier && (
                          <td className="p-3 text-center space-x-2">
                            <button 
                              onClick={() => setSupForm(sup)}
                              className="text-blue-600 hover:underline"
                            >Edit</button>
                            <button 
                              onClick={() => handleDeleteSup(sup.id)}
                              className="text-rose-600 hover:underline"
                            >Hapus</button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FAKTUR RESTOCK */}
      {activeSubTab === 'restock' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Dokumentasi Faktur Restock (`Pembelian_Obat`)
              </h3>
              <p className="text-xs text-slate-400">Proses ini akan mendaftarkan nomor faktur pemasok dan meregistrasikan kode batch obat baru.</p>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nomor Faktur Pemasok</label>
                  <input 
                    type="text" 
                    placeholder="FAK-MBS-99104"
                    value={restockForm.invoice_id}
                    onChange={(e) => setRestockForm(prev => ({ ...prev, invoice_id: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Pilih Supplier Pemasok</label>
                  <select 
                    value={restockForm.supplier_id}
                    onChange={(e) => setRestockForm(prev => ({ ...prev, supplier_id: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-700 font-medium"
                  >
                    {suppliers.map(sup => (
                      <option key={sup.id} value={sup.id}>{sup.name} ({sup.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Pilih Obat Master</label>
                  <select 
                    value={restockForm.medicine_id}
                    onChange={(e) => setRestockForm(prev => ({ ...prev, medicine_id: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 text-slate-700 font-medium"
                  >
                    <option value="">-- Pilih Obat --</option>
                    {medicines.map(med => (
                      <option key={med.id} value={med.id}>{med.name} ({med.id})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50 p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Jumlah Masuk (Qty)</label>
                  <input 
                    type="number" 
                    value={restockForm.quantity || ''}
                    onChange={(e) => setRestockForm(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Harga Beli Satuan (Rp)</label>
                  <input 
                    type="number" 
                    value={restockForm.purchase_price || ''}
                    onChange={(e) => setRestockForm(prev => ({ ...prev, purchase_price: Number(e.target.value) }))}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Kode Batch Baru</label>
                  <input 
                    type="text" 
                    placeholder="BCH-101"
                    value={restockForm.batch_code}
                    onChange={(e) => setRestockForm(prev => ({ ...prev, batch_code: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-emerald-500 text-slate-850 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tanggal Kedaluwarsa Batch</label>
                  <input 
                    type="date" 
                    value={restockForm.expiry_date}
                    onChange={(e) => setRestockForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-emerald-500 font-semibold text-rose-600"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-sm">
                  <span className="text-slate-500 font-medium">Total Pengeluaran Faktur:</span>
                  <span className="font-bold text-slate-900 ml-1">
                    {formatRupiah(restockForm.quantity * restockForm.purchase_price)}
                  </span>
                </div>
                <button 
                  type="submit" 
                  disabled={actionLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Validasi Faktur & Pengadaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
