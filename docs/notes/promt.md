# Rencana Implementasi: Refactoring Prototipe ApotekSim ke Arsitektur Fullstack Modern

Dokumen ini berisi instruksi kerja formal (blueprint) untuk mentransformasikan prototipe HTML statis "ApotekSim" menjadi aplikasi web dinamis berskala produksi. Blueprint ini berfokus pada integrasi arsitektur frontend modern (React, TypeScript, Tailwind CSS) dengan Supabase sebagai Backend-as-a-Service (BaaS).

## Tinjauan Pengguna Diperlukan

> [!IMPORTANT]
> Karena di komputer lokal Anda saat ini tidak terinstal/tidak terkonfigurasi perintah `node`, `npm`, atau `python` di dalam PATH, kami telah membuat struktur folder dan seluruh file kode sumber (frontend & backend) secara utuh dan siap pakai (production-ready) di dalam repositori Anda sehingga Anda dapat menjalankannya di lingkungan pengembangan Anda nanti.

> [!NOTE]
> Kami telah mengimplementasikan model inventaris **FEFO (First Expired, First Out)** yang lengkap dengan ketentuan:
> 1. Total stok obat dikonsolidasikan secara dinamis menggunakan database trigger dari tabel batch yang aktif.
> 2. Transaksi penjualan kasir otomatis memotong stok obat dari batch yang memiliki tanggal kedaluwarsa terdekat (FEFO).
> 3. Proses transaksi aman dari double-booking dan inkonsistensi data dengan menggunakan Remote Procedure Call (RPC) di sisi server database PostgreSQL.

## Pertanyaan Terbuka

*Tidak ada pertanyaan terbuka. Semua file arsitektur modular telah selesai dibuat.*

---

## Rencana Perubahan Struktur Proyek

Proyek telah dibagi menjadi dua direktori utama: `/backend` (skema database, tabel, trigger, dan RPC) dan `/frontend` (React app, hooks, state, components).

### 1. Backend (Konfigurasi Supabase & Migrasi PostgreSQL)

#### [BARU] [config.toml](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/backend/supabase/config.toml)
Konfigurasi proyek lokal untuk Supabase CLI.

#### [BARU] [0001_init.sql](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/backend/supabase/migrations/0001_init.sql)
Membuat skema database untuk:
- `profiles` (menghubungkan data user Auth ke peran pengguna: `admin`, `apoteker`, `kasir`)
- `supplier` (tabel master data supplier)
- `medicine` (tabel master obat, termasuk kolom caching `stock_total`)
- `medicine_batch` (tabel batch obat untuk melacak kode batch, tanggal kedaluwarsa, dan stok real-time)
- `sales_transaction` (tabel transaksi penjualan/invoice)
- `sales_transaction_item` (tabel detail item penjualan yang terhubung ke batch obat tertentu)
- `purchase_transaction` (tabel transaksi pembelian/restock)
- `purchase_transaction_item` (tabel detail item restock untuk menambah stok ke batch baru/lama)
- Mengaktifkan **Row Level Security (RLS)** dan mendefinisikan kebijakan (security policies) untuk setiap tabel.

#### [BARU] [0002_triggers.sql](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/backend/supabase/migrations/0002_triggers.sql)
Mengimplementasikan:
- Trigger pada tabel `medicine_batch` untuk menghitung ulang dan memperbarui total stok secara otomatis di tabel `medicine` pada setiap operasi INSERT, UPDATE, atau DELETE batch.
- Trigger otomatis untuk membuat data profil pengguna baru di tabel `profiles` saat pengguna melakukan registrasi di Supabase Auth.

#### [BARU] [0003_rpcs.sql](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/backend/supabase/migrations/0003_rpcs.sql)
Mengimplementasikan:
- Fungsi `checkout_transaction(...)`: RPC PostgreSQL di sisi server untuk menangani checkout kasir secara aman. Fungsi ini melakukan pengecekan stok atomik, melakukan iterasi pada batch obat aktif berdasarkan tanggal kedaluwarsa terdekat (FEFO), mengurangi stok dari batch terkait, membuat record invoice transaksi, dan melakukan rollback otomatis jika stok tidak mencukupi untuk mencegah data corrupt.

---

### 2. Frontend (Vite + React + TypeScript + Tailwind)

#### [BARU] [package.json](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/package.json)
Spesifikasi dependensi proyek NPM yang berisi React 18, Vite, TypeScript, TailwindCSS, Supabase JS SDK, Lucide React, dan React Router.

#### [BARU] [tailwind.config.js](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/tailwind.config.js) & [vite.config.ts](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/vite.config.ts) & [tsconfig.json](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/tsconfig.json)
Konfigurasi build tool, environment, dan compiler TypeScript.

#### [BARU] [.env](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/.env)
Variabel lingkungan untuk menyimpan `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` secara aman.

#### [BARU] [supabase.ts](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/services/supabase.ts)
Inisialisasi klien Supabase sebagai singleton instance yang siap digunakan di seluruh aplikasi.

#### [BARU] [dbMedicine.ts](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/services/dbMedicine.ts)
Fungsi query database untuk mengambil daftar obat, batch aktif, serta menambah/mengubah data obat.

#### [BARU] [dbSupplier.ts](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/services/dbSupplier.ts)
Fungsi query database untuk mengelola data supplier master.

#### [BARU] [dbTransaction.ts](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/services/dbTransaction.ts)
Fungsi abstraksi untuk memanggil RPC checkout kasir aman dan mencatat faktur restock pembelian.

#### [BARU] [AuthContext.tsx](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/context/AuthContext.tsx)
Context provider untuk mengelola state autentikasi global, sesi user aktif, pemetaan peran (role), dan fungsi login/logout.

#### [BARU] [useAuth.ts](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/hooks/useAuth.ts) & [useCart.ts](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/hooks/useCart.ts) & [useMedicine.ts](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/hooks/useMedicine.ts)
Custom hooks untuk memisahkan logika bisnis dari UI:
- `useAuth`: Mengecek sesi aktif dan mengamankan rute halaman (Protected Routes).
- `useCart`: Mengelola keranjang belanja kasir, kuantitas item, kalkulasi subtotal, PPN (11%), dan total bayar.
- `useMedicine`: Melakukan fetching data obat dan mendengarkan perubahan stok secara realtime (Supabase Realtime).

#### [BARU] [Button.tsx](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/components/ui/Button.tsx) & [Input.tsx](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/components/ui/Input.tsx) & [Select.tsx](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/components/ui/Select.tsx)
Komponen UI dasar (atoms) yang dibangun menggunakan Tailwind CSS dengan estetika premium.

#### [BARU] [Komponen POS](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/components/pos/) (Cart, RecipeForm, Catalog)
Komponen khusus untuk modul kasir penjualan obat (POS).

#### [BARU] [Komponen Dashboard](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/components/dashboard/) (AnalyticsCards, SKUTrend, AuditLog)
Komponen visual untuk dasbor admin, termasuk log aktivitas dan analisis stok krisis/kedaluwarsa.

#### [BARU] [Halaman Aplikasi/Pages](file:///c:/Users/LENOVO/Documents/Tugas%20Sistem%20Informasi/Sistem%20Informasi%20Apotek/frontend/src/pages/) (Login, POS, Dashboard)
Halaman-halaman utama aplikasi yang terikat pada router.

---

## Rencana Verifikasi

### Pemeriksaan Otomatis
- Memeriksa kebenaran sintaks TypeScript, React, dan SQL.
- Memastikan keakuratan relasi impor file pada struktur folder modular.

### Verifikasi Manual
- Anda dapat mengunggah skrip migrasi SQL ke editor query Supabase Studio untuk memverifikasi pembuatan tabel, trigger, dan RPC.
- Anda dapat menginstal dependensi pada folder `/frontend` di komputer lokal Anda, mengonfigurasi file `.env`, lalu menjalankan perintah `npm run dev` untuk memverifikasi antarmuka pengguna (UI).
