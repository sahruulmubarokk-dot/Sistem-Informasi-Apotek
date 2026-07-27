# Rencana Implementasi: Refactoring Prototipe ApotekSim ke Arsitektur Fullstack Modern

Dokumen ini berisi instruksi kerja formal (blueprint) untuk mentransformasikan prototipe HTML statis "ApotekSim" menjadi aplikasi web dinamis berskala produksi. Blueprint ini berfokus pada integrasi arsitektur frontend modern (React 18, Vite 5, TypeScript, Tailwind CSS) dengan Supabase sebagai Backend-as-a-Service (BaaS).

## Tinjauan Pengguna Diperlukan

> [!IMPORTANT]
> Kami telah membuat struktur folder dan seluruh file kode sumber (frontend & backend) secara utuh dan siap pakai (production-ready) di dalam repositori sehingga Anda dapat menjalankannya di lingkungan pengembangan Anda secara lokal dengan perintah `npm run dev`.

> [!NOTE]
> Kami telah mengimplementasikan model inventaris **FEFO (First Expired, First Out)** yang lengkap dengan ketentuan:
> 1. Total stok obat dikonsolidasikan secara dinamis menggunakan database trigger dari tabel batch yang aktif.
> 2. Transaksi penjualan kasir otomatis memotong stok obat dari batch yang memiliki tanggal kedaluwarsa terdekat (FEFO).
> 3. Proses transaksi aman dari double-booking dan inkonsistensi data dengan menggunakan Stored Procedure Remote Procedure Call (RPC) di sisi server database PostgreSQL.

---

## Rencana Perubahan Struktur Proyek

Proyek telah dibagi menjadi dua direktori utama: [`Backend/`](file:///d:/Sistem-Informasi-Apotek/Backend) (skema database, tabel, trigger, RLS, dan RPC) dan [`Frontend/`](file:///d:/Sistem-Informasi-Apotek/Frontend) (React app, custom hooks, services, state management, UI components).

### 1. Backend (Konfigurasi Supabase & Migrasi PostgreSQL)

#### [BARU] [config.toml](file:///d:/Sistem-Informasi-Apotek/Backend/supabase/config.toml)
Konfigurasi proyek lokal untuk Supabase CLI.

#### [BARU] [0001_init.sql](file:///d:/Sistem-Informasi-Apotek/Backend/supabase/migrations/0001_init.sql)
Membuat skema database untuk:
- `profiles` (menghubungkan data user Auth ke peran pengguna: `admin`, `apoteker`, `kasir`)
- `supplier` (tabel master data supplier)
- `medicine` (tabel master obat, termasuk kolom caching `stock_total`)
- `medicine_batch` (tabel batch obat untuk melacak kode batch, tanggal kedaluwarsa, dan stok real-time)
- `sales_transaction` (tabel transaksi penjualan/invoice)
- `sales_transaction_item` (tabel detail item penjualan yang terhubung ke batch obat tertentu)
- `purchase_transaction` (tabel transaksi pembelian/restock)
- `purchase_transaction_item` (tabel detail item restock untuk menambah stok ke batch baru/lama)
- Mengaktifkan **Row Level Security (RLS)** dan mendefinisikan kebijakan (*security policies*) untuk setiap tabel.

#### [BARU] [0002_triggers.sql](file:///d:/Sistem-Informasi-Apotek/Backend/supabase/migrations/0002_triggers.sql)
Mengimplementasikan:
- Trigger pada tabel `medicine_batch` untuk menghitung ulang dan memperbarui total stok secara otomatis di tabel `medicine` pada setiap operasi INSERT, UPDATE, atau DELETE batch.
- Trigger otomatis untuk membuat data profil pengguna baru di tabel `profiles` saat pengguna melakukan registrasi di Supabase Auth.

#### [BARU] [0003_rpcs.sql](file:///d:/Sistem-Informasi-Apotek/Backend/supabase/migrations/0003_rpcs.sql)
Mengimplementasikan:
- Fungsi `process_fefo_sale(...)`: RPC PostgreSQL di sisi server untuk menangani checkout kasir secara aman. Fungsi ini melakukan pengecekan stok atomik, melakukan iterasi pada batch obat aktif berdasarkan tanggal kedaluwarsa terdekat (FEFO), mengurangi stok dari batch terkait, membuat record invoice transaksi, dan melakukan rollback otomatis jika stok tidak mencukupi untuk mencegah data corrupt.

---

### 2. Frontend (Vite + React 18 + TypeScript + Tailwind CSS)

#### [BARU] [package.json](file:///d:/Sistem-Informasi-Apotek/Frontend/package.json)
Spesifikasi dependensi proyek NPM yang berisi React 18, Vite 5, TypeScript 5.2, Tailwind CSS 3.4, Supabase JS SDK, Lucide React, dan React Router DOM 6.

#### [BARU] [vite.config.ts](file:///d:/Sistem-Informasi-Apotek/Frontend/vite.config.ts) & [tsconfig.json](file:///d:/Sistem-Informasi-Apotek/Frontend/tsconfig.json)
Konfigurasi build tool Vite, environment settings, dan compiler TypeScript.

#### [BARU] [.env.example](file:///d:/Sistem-Informasi-Apotek/Frontend/.env.example)
Template variabel lingkungan untuk menyimpan `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` secara aman.

#### [BARU] [supabase.ts](file:///d:/Sistem-Informasi-Apotek/Frontend/src/services/supabase.ts)
Inisialisasi klien Supabase sebagai singleton instance yang siap digunakan di seluruh aplikasi.

#### [BARU] [dbMedicine.ts](file:///d:/Sistem-Informasi-Apotek/Frontend/src/services/dbMedicine.ts)
Fungsi query database untuk mengambil daftar obat, batch aktif, serta menambah/mengubah data obat.

#### [BARU] [dbSupplier.ts](file:///d:/Sistem-Informasi-Apotek/Frontend/src/services/dbSupplier.ts)
Fungsi query database untuk mengelola data supplier master.

#### [BARU] [dbTransaction.ts](file:///d:/Sistem-Informasi-Apotek/Frontend/src/services/dbTransaction.ts)
Fungsi abstraksi untuk memanggil RPC checkout kasir aman dan mencatat faktur restock pembelian.

#### [BARU] [AuthContext.tsx](file:///d:/Sistem-Informasi-Apotek/Frontend/src/context/AuthContext.tsx)
Context provider untuk mengelola state autentikasi global, sesi user aktif, pemetaan peran (*role*), dan fungsi login/logout.

#### [BARU] [useAuth.ts](file:///d:/Sistem-Informasi-Apotek/Frontend/src/hooks/useAuth.ts) & [useCart.ts](file:///d:/Sistem-Informasi-Apotek/Frontend/src/hooks/useCart.ts) & [useMedicine.ts](file:///d:/Sistem-Informasi-Apotek/Frontend/src/hooks/useMedicine.ts)
Custom hooks untuk memisahkan logika bisnis dari UI:
- `useAuth`: Mengecek sesi aktif dan mengamankan rute halaman (*Protected Routes*).
- `useCart`: Mengelola keranjang belanja kasir, kuantitas item, kalkulasi subtotal, PPN (11%), dan total bayar.
- `useMedicine`: Melakukan fetching data obat dan mendengarkan perubahan stok secara realtime (*Supabase Realtime*).

#### [BARU] [Button.tsx](file:///d:/Sistem-Informasi-Apotek/Frontend/src/components/ui/Button.tsx) & [Input.tsx](file:///d:/Sistem-Informasi-Apotek/Frontend/src/components/ui/Input.tsx) & [Select.tsx](file:///d:/Sistem-Informasi-Apotek/Frontend/src/components/ui/Select.tsx)
Komponen UI dasar (atoms) yang dibangun menggunakan Tailwind CSS dengan estetika premium.

#### [BARU] [Komponen POS](file:///d:/Sistem-Informasi-Apotek/Frontend/src/components/pos/) (Cart, RecipeForm, Catalog)
Komponen khusus untuk modul kasir penjualan obat (POS).

#### [BARU] [Komponen Dashboard](file:///d:/Sistem-Informasi-Apotek/Frontend/src/components/dashboard/) (AnalyticsCards, SKUTrend, AuditLog)
Komponen visual untuk dasbor admin, termasuk log aktivitas dan analisis stok krisis/kedaluwarsa.

#### [BARU] [Halaman Aplikasi/Pages](file:///d:/Sistem-Informasi-Apotek/Frontend/src/pages/) (Login, POS, Dashboard)
Halaman-halaman utama aplikasi yang terikat pada router.

---

## Rencana Verifikasi

### Pemeriksaan Otomatis
- Memeriksa kebenaran sintaks TypeScript, React, dan SQL.
- Memastikan keakuratan relasi impor file pada struktur folder modular.

### Verifikasi Manual
- Anda dapat mengunggah skrip migrasi SQL ke editor query Supabase Studio untuk memverifikasi pembuatan tabel, trigger, dan RPC.
- Anda dapat menginstal dependensi pada folder `Frontend/` di komputer lokal Anda, mengonfigurasi file `.env`, lalu menjalankan perintah `npm run dev` untuk memverifikasi antarmuka pengguna (UI).
