# 📹 Panduan Rekam Layar Manual & Checklist Fitur (Durasi 5 - 10 Menit)

Dokumen ini berisi panduan praktis dan **Checklist Fitur Terstruktur** bagi Anda untuk merekam layar (*screen recording*) secara manual dari aplikasi web **ApotekSim**, mencakup 3 peran utama: **Administrator**, **Apoteker Supervisor**, dan **Kasir**.

---

## 🔑 1. Daftar Akun Login per Role

Gunakan akun login berikut saat merekam aplikasi (Aplikasi otomatis mengalihkan ke mode demo jika Supabase offline):

| Role / Peran | Email Login | Password | Keterangan Profil |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin@apoteksim.com` | `1234` | Profil Badge: **`ADM`** (Hak Akses Penuh) |
| 💊 **Apoteker Supervisor** | `apoteker@apoteksim.com` | `1212` | Profil Badge: **`APT`** (Pengawasan Medis & Resep) |
| 🛒 **Kasir** | `kasir@apoteksim.com` | `1304` | Profil Badge: **`KAS`** (POS & Transaksi Penjualan) |

---

## 🛠️ 2. Cara Rekam Layar Manual (Windows)

1. **Gunakan Shortcut Bawaan Windows (Paling Praktis)**:
   - Tekan **`Win + Alt + R`** untuk **Mulai** dan **Berhenti** merekam layar.
   - Hasil video MP4 tersimpan di folder `C:\Users\[Username]\Videos\Captures`.
2. **Atur Tampilan Browser**:
   - Buka `http://localhost:5173/` di browser Chrome/Edge.
   - Tekan tombol **`F11`** untuk tampilan layar penuh (*Full Screen*) agar video terlihat bersih dan rapi.
3. **Tips Tempo Perekaman (Agar Durasi Mencapai 5–10 Menit)**:
   - Gerakkan kursor secara perlahan dan tenang.
   - Berikan **jeda 3 – 5 detik** di setiap halaman/form agar penonton/dosen sempat mengamati elemen UI dan teks di layar.

---

## 📋 3. Checklist Fitur yang Wajib Ditampilkan Saat Rekam

---

### **📍 Skenario 1: ROLE ADMINISTRATOR (Estimasi Durasi: 2.5 Menit)**

- [ ] **1. Login Admin & Sorot Profil**:
  - Masukkan `admin@apoteksim.com` / `1234`.
  - Arahkan kursor ke badge profil pojok kiri bawah bertuliskan **`ADM` / Administrator**.
- [ ] **2. Dasbor Analytics & Metric Eksekutif**:
  - Buka menu **Ringkasan Eksekutif** / Dasbor.
  - Perlihatkan kartu statistik: **Total Penjualan**, **Jumlah Obat**, **Obat Expired**.
  - Tunjukkan **Grafik Penjualan Bulanan** dan **Tabel Obat Terlaris** (*Top Selling*).
- [ ] **3. Indikator Visual Warning Stok Minimum (Warna Merah)**:
  - Sorot indikator badge berwarna **MERAH** pada obat yang stoknya mencapai batas minimum (Alert Stok).
- [ ] **4. Master Data Obat**:
  - Buka menu **Master Data Obat**.
  - Klik tombol **+ Tambah Obat Baru** (tunjukkan modal/form input obat, harga jual, dan threshold batas minimum stok).
- [ ] **5. Master Data Supplier**:
  - Buka menu **Master Data Supplier**. Tunjukkan daftar vendor/supplier farmasi terdaftar.
- [ ] **6. Faktur Pembelian (Restock Multi-Batch)**:
  - Buka menu **Faktur Pembelian (Restock)**.
  - Simulasikan pencatatan faktur masuk: Tunjukkan kolom **Nomor Batch** dan **Tanggal Kedaluwarsa (*Expiry Date*)** yang menjadi dasar metode FEFO.
- [ ] **7. Logout Admin**: Klik ikon Logout di sudut kiri bawah.

---

### **📍 Skenario 2: ROLE APOTEKER SUPERVISOR (Estimasi Durasi: 2 Menit)**

- [ ] **1. Login Apoteker & Sorot Profil**:
  - Masukkan `apoteker@apoteksim.com` / `1212`.
  - Arahkan kursor ke badge profil **`APT` / Apoteker Supervisor**.
- [ ] **2. Filter & Pengawasan Obat Keras (G)**:
  - Buka katalog obat pada POS / Master Data.
  - Filter obat kategori **Obat Keras (G)** (seperti *Amoxicillin 500mg* atau *Ciprofloxacin*).
- [ ] **3. Modul Skrining Resep Dokter**:
  - Tambahkan obat keras ke dalam transaksi.
  - Tunjukkan bahwa sistem mengunci tombol bayar dan memunculkan modal **Wajib Skrining Resep Dokter**.
  - Tunjukkan form isian medis: **Nama Dokter**, **Nomor SIP Dokter**, dan **Nama Pasien**.
- [ ] **4. Pengawasan Kedaluwarsa Obat**:
  - Tunjukkan fitur peninjauan masa simpan batch obat sebelum didistribusikan.
- [ ] **5. Logout Apoteker**: Klik ikon Logout.

---

### **📍 Skenario 3: ROLE KASIR & DEMO FEFO (Estimasi Durasi: 2.5 Menit)**

- [ ] **1. Login Kasir & Sorot Profil**:
  - Masukkan `kasir@apoteksim.com` / `1304`.
  - Arahkan kursor ke badge profil **`KAS` / Kasir**.
- [ ] **2. Transaksi Point of Sales (POS)**:
  - Klik beberapa kartu obat untuk dimasukkan ke keranjang belanja (misal: *Paracetamol 500mg*).
- [ ] **3. Pembuktian Otomatisasi Stok FEFO (*First Expired, First Out*)**:
  - Sorot rincian batch di keranjang: Jelaskan bahwa sistem otomatis memotong stok dari **Batch A** (kadaluwarsa terdekat) terlebih dahulu sebelum memotong **Batch B**.
- [ ] **4. Pembayaran & Kalkulasi Kembalian**:
  - Masukkan nominal pembayaran uang tunai (misal: `50.000`).
  - Tunjukkan kalkulasi otomatis sisa kembalian di layar.
- [ ] **5. Cetak Struk Penjualan Official**:
  - Klik tombol **Bayar Transaksi** & tampilkan pop-up **Struk / Invoice Penjualan Kasir**.
- [ ] **6. Uji Keamanan Database Row Level Security (RLS)**:
  - Tunjukkan bahwa menu mutasi/hapus data master tidak dapat diakses oleh akun Kasir karena dibatasi oleh RLS PostgreSQL Supabase.
- [ ] **7. Logout Kasir**: Klik ikon Logout.

---

## 📊 Summary Rincian Alur Rekam Layar (Total: ~7 Menit)

```gfm
00:00 - 00:30  | Pembukaan (Tampilkan Dasbor Utama & Logo UNITOMO)
00:30 - 03:00  | Skenario 1: Role Administrator (Analytics, Master Obat/Supplier, Restock Batch)
03:00 - 05:00  | Skenario 2: Role Apoteker Supervisor (Filter Obat Keras & Skrining Resep Dokter)
05:00 - 07:00  | Skenario 3: Role Kasir (POS, Simulasi FEFO Multi-Batch, Payment, & Struk)
07:00 - 07:30  | Penutup (Tunjukkan Berkas docs/reports/ Laporan .docx & PPTX)
```

---

## ✅ Checklist Sebelum Mengunggah Video:
- [ ] Durasi video berada di rentang **5 hingga 10 menit**.
- [ ] Resolusi video jernih (minimal 720p / 1080p Full HD).
- [ ] Ketiga role (Admin, Apoteker, Kasir) tertampil secara lengkap.
- [ ] Fitur FEFO, Skrining Resep, Warning Stok Minimum, dan Struk Penjualan berhasil didemonstrasikan.
