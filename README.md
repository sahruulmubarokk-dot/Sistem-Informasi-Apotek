# 💊 ApotekSim - Sistem Informasi Apotek Modern

<div align="center">

![ApotekSim Banner](docs/assets/ui_dashboard_admin.png)

### **Sistem Manajemen Apotek Berbasis Multi-Batch FEFO, Point of Sales (POS), & Database Row Level Security**

[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Python Generator](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[🖥️ Interactive Demo](docs/demo/index.html) • [📄 Dokumen Laporan (.docx)](docs/reports/laporan_akhir_pbl_apotek.docx) • [📊 Slide Presentasi (.pptx)](docs/reports/presentasi-proyek.pptx) • [📐 Diagram DFD & ERD](docs/diagrams_html/)

---

</div>

## 📌 Tentang Proyek

**ApotekSim** adalah purwarupa Sistem Informasi Apotek yang dirancang untuk mengatasi permasalahan efisiensi operasional apotek modern, seperti potensi obat kedaluwarsa akibat manajemen stok manual, risiko kesalahan pemotongan barang (*human error*), serta kendala sinkronisasi data antar kasir dan bagian gudang.

Sistem ini dikembangkan sebagai bagian dari **Project-Based Learning (PBL)** Universitas Dr. Soetomo (UNITOMO) Surabaya dengan menerapkan arsitektur *Full-Stack Web* berbasis **React (Vite)** dan backend cloud **Supabase (PostgreSQL)**.

---

## ✨ Fitur Unggulan

- **📦 Otomatisasi Stok FEFO (*First Expired, First Out*)**: Pemotongan stok otomatis memprioritaskan obat dengan tanggal kedaluwarsa paling dekat secara transaksional di database server.
- **🛒 Point of Sales (POS) Kasir**: Antarmuka kasir yang cepat dengan pencarian resep, fitur kalkulasi otomatis, dan proteksi wajib isi formulir skrining resep untuk kategori Obat Keras (G).
- **📊 Ringkasan Eksekutif & Stock Alert**: Dashboard interaktif yang menampilkan *real-time metrics* penjualan, obat terlaris, serta indikator visual merah jika stok mencapai ambang batas minimum.
- **🛡️ Database Row Level Security (RLS)**: Penguncian hak akses mutasi data (`INSERT`/`UPDATE`/`DELETE`) khusus role **Admin**, sementara role **Kasir** hanya diberikan akses baca (*SELECT*) dan pemotongan stok transaksional via token JWT.
- **📑 Automation Generators**: Script Python bawaan untuk membuat berkas Laporan Akhir PBL berkriteria akademik kaku (`.docx`) dan Slide Presentasi berdesain modern (`.pptx`) secara otomatis.

---

## 🖼️ Tampilan Antarmuka (UI Showcase)

<div align="center">

| Dasbor Utama Admin | Point of Sales (POS) Kasir |
| :---: | :---: |
| ![Dasbor Admin](docs/assets/ui_dashboard_admin.png) | ![POS Kasir](docs/assets/ui_pos_kasir.png) |

| Katalog Master Data Obat | Faktur Pembelian / Restock |
| :---: | :---: |
| ![Katalog Obat](docs/assets/ui_katalog_obat.png) | ![Tabel Restock](docs/assets/ui_tabel_restock.png) |

</div>

---

## 📐 Perancangan Struktur Sistem

Proyek ini dilengkapi dengan pemodelan sistem komprehensif yang memisahkan entitas, alur data, dan struktur relasi database:

<div align="center">

### **1. Diagram Konteks**
![Diagram Konteks](docs/assets/diagram_konteks.png)
*Alur interaksi entitas eksternal (Admin & Kasir) dengan batas sistem ApotekSim.*

### **2. DFD Level 0**
![DFD Level 0](docs/assets/dfd_level0.png)
*Rincian proses pengadaan, mutasi stok multi-batch, transaksi kasir, dan laporan.*

### **3. Entity Relationship Diagram (ERD)**
![ERD Database](docs/assets/erd_database.png)
*Struktur relasi basis data PostgreSQL yang telah dinormalisasi (Supplier, Obat, Batch, Transaksi).*

</div>

> 💡 *Ingin melihat versi interaktif dengan Mermaid.js? Buka berkas HTML di direktori [`docs/diagrams_html/`](docs/diagrams_html/).*

---

## 📁 Struktur Repositori

```gfm
Sistem-Informasi-Apotek/
├── Frontend/                   # Aplikasi Frontend React + Vite + Tailwind CSS
│   ├── src/                    # Source code komponen, halaman, & fungsi API Supabase
│   ├── package.json            # Dependensi proyek frontend
│   └── vite.config.ts          # Konfigurasi Vite builder
├── Backend/                    # Konfigurasi Backend & Database
│   └── supabase/               # Schema SQL, migrasi, dan kebijakan RLS
├── docs/                       # Seluruh Aset & Dokumentasi Terorganisir
│   ├── assets/                 # Screenshot UI & Diagram Sistem (.png/.jpg)
│   ├── reports/                # Laporan Akademik (.docx) & Slide Presentasi (.pptx)
│   ├── generators/             # Script Python Pembuat Laporan & PPTX Otomatis
│   ├── diagrams_html/          # Renderer HTML Diagram (Mermaid JS)
│   ├── demo/                   # Prototype UI Standalone Interaktif (index.html)
│   └── notes/                  # Format Laporan & Prompt Notes (.md)
├── .gitignore                  # Aturan penanganan file sampel & cache
└── README.md                   # Dokumentasi Utama Repositori
```

---

## 🚀 Panduan Memulai (Getting Started)

### **1. Prasyarat**
- **Node.js** v18+ dan `npm`
- **Python** 3.10+ (opsional, untuk menjalankan generator laporan)
- Akun **Supabase** (untuk koneksi database cloud)

---

### **2. Jalankan Frontend (React + Vite)**

```bash
# Masuk ke folder Frontend
cd Frontend

# Install dependensi
npm install

# Konfigurasi environment variabel
cp .env.example .env
# Isikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di berkas .env

# Jalankan server pengembangan
npm run dev
```

Buka browser di `http://localhost:5173`.

---

### **3. Uji Prototype Interaktif Direct Browser**

Anda juga dapat membuka prototype UI tanpa perlu menginstall Node.js melalui berkas HTML standalone:
- Buka [`docs/demo/index.html`](docs/demo/index.html) langsung di browser favorit Anda.

---

### **4. Jalankan Python Document Generators**

Untuk meng-generate ulang laporan akademik `.docx` atau slide presentasi `.pptx`:

```bash
# Install library pendukung
pip install python-docx python-pptx pillow

# Generate Laporan Akademik (.docx)
python docs/generators/generate_report.py

# Generate Slide Presentasi (.pptx)
python docs/generators/generate_pptx.py
```
*Hasil file otomatis tersimpan di folder [`docs/reports/`](docs/reports/).*

---

## 📑 Indeks Dokumentasi

- **[📄 Laporan Akhir PBL (.docx)](docs/reports/laporan_akhir_pbl_apotek.docx)**: Dokumen lengkap sesuai margin 4-3-3-3cm & format akademik kaku.
- **[📊 Slide Presentasi Proyek (.pptx)](docs/reports/presentasi-proyek.pptx)**: Presentasi 16:9 dengan desain visual modern dan diagram terintegrasi.
- **[⚙️ Report Generator Script](docs/generators/generate_report.py)**: Kode Python pengolah dokumen laporan `python-docx`.
- **[🎨 PPTX Generator Script](docs/generators/generate_pptx.py)**: Kode Python pengolah slide presentasi `python-pptx`.
- **[📋 Panduan Format Laporan](docs/notes/Format-Laporan.md)**: Acuan struktur penulisan laporan akhir.

---

## 🤝 Kontributor

Dibuat untuk **Tugas PBL Sistem Informasi Apotek** - Universitas Dr. Soetomo (UNITOMO).

[![UNITOMO](docs/assets/UNITOMO.jpg)](https://unitomo.ac.id/)

---

<div align="center">
  <sub>Built with ❤️ using React, Supabase & Tailwind CSS</sub>
</div>
