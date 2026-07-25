# 🤖 ApotekSim - Sistem Informasi Apotek (AI-Driven Software Engineering)

<div align="center">

![ApotekSim Interactive Demo](docs/assets/demo_system.gif)

### **Tugas Kuliah Project-Based Learning (PBL) - Universitas Dr. Soetomo (UNITOMO)**
**Pembangunan Sistem Informasi Apotek Modern Berbasis AI Assistant, Multi-Batch FEFO, POS Kasir, & Database Row Level Security (RLS)**

[![AI Agent](https://img.shields.io/badge/AI_Agent-Gemini_%2B_Claude_Antigravity-8E44AD?style=for-the-badge&logo=google)](https://deepmind.google/)
[![AI Canvas](https://img.shields.io/badge/AI_Canvas-Gemini_Canvas-4285F4?style=for-the-badge&logo=google)](https://gemini.google.com/)
[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

[🖥️ Interactive UI Demo](docs/demo/index.html) • [📹 Putar Video MP4](https://raw.githubusercontent.com/sahruulmubarokk-dot/Sistem-Informasi-Apotek/main/docs/reports/vidio-demonstrasi.mp4) • [📜 Master Prompt Pipeline](docs/notes/history-promt.md) • [📄 Laporan (.docx)](docs/reports/laporan_akhir_pbl_apotek.docx) • [📕 Laporan (.pdf)](docs/reports/laporan_akhir_pbl_apotek.pdf) • [📊 Slide Presentasi (.pptx)](docs/reports/presentasi-proyek.pptx)

---

</div>

## 📌 Latar Belakang & Pembuktian AI-Driven Engineering

Proyek ini dibangun sebagai bagian dari **Tugas Kuliah Project-Based Learning (PBL)** di **Universitas Dr. Soetomo (UNITOMO) Surabaya**. 

Fokus utama dari proyek ini adalah **mengimplementasikan Metodologi Pengembangan Perangkat Lunak Berbasis Kecerdasan Buatan (AI-Driven Software Engineering & Prompt Engineering Pipeline)** untuk pembangunan aplikasi web fullstack, perancangan arsitektur basis data, prototipe antarmuka (UI), hingga otomatisasi diagram sistem. Tahapan pengkodean aplikasi dan diagram sistem dieksekusi melalui kolaborasi terstruktur dengan **AI Agent**.

### 🛠️ AI Tools & Teknologi Kecerdasan Buatan yang Digunakan:

| Tool AI / Engine | Tahapan Penggunaan | Peran & Kontribusi Utama dalam Proyek |
| :--- | :---: | :--- |
| 🔵 **Gemini Canvas** | **Prompt 1 - 4** | Eksperimentasi konsep arsitektur basis data, perencanaan workflow, pembuatan prototipe UI HTML statis (`index.html`), dan penyusunan blueprint migrasi dinamis (`prompt.md`). |
| 🤖 **Gemini + Claude (Antigravity Agent)** | **Prompt 5 - 6** | *Autonomous Agentic Coding* untuk refactoring Fullstack React + Supabase, pembuatan diagram Mermaid interaktif, dan pengujian integrasi sistem. |
| 🧜‍♂️ **Mermaid.js Engine** | **Prompt 6** | Menghasilkan diagram visual sistem (Diagram Konteks, DFD Level 0, & ERD) secara otomatis via sintaks deklaratif. |

---

## 📜 Metodologi & Workflow Pengembangan

Proyek ini memisahkan secara tegas antara **Fase Engineering Berbasis AI (Prompt Pipeline)** dan **Fase Penyusunan Berkas Akademik & QA**.

### 1️⃣ Fase 1: AI Prompt Engineering Pipeline (Prompt 1 – 6)
*Alur Perancangan Arsitektur, Prototipe, dan Pengkodean Otomatis Menggunakan AI Assistant*

```mermaid
flowchart LR
    subgraph Canvas ["🔵 Phase 1: Planning & Blueprint (Gemini Canvas)"]
        direction TB
        P1["PROMPT 1: Konsep DB & Fitur"] --> P2["PROMPT 2: Workflow & Tech Stack"]
        P2 --> P3["PROMPT 3: Prototipe UI HTML Statis"]
        P3 --> P4["PROMPT 4: Blueprint Transformasi Supabase (prompt.md)"]
    end

    subgraph Agent ["🤖 Phase 2: Autonomous Agentic Coding (Antigravity Agent)"]
        direction TB
        P5["PROMPT 5: Fullstack React + Supabase Engine"]
        P6["PROMPT 6: Diagram Mermaid DFD/ERD Interaktif"]
        P5 --> P6
    end

    Canvas -->|Handoff Blueprint| Agent
```

#### 📋 Matriks AI Prompt Engineering:

| Prompt | Fokus Development | Input & Prasyarat | Output yang Dihasilkan | Engine AI |
| :---: | :--- | :--- | :--- | :---: |
| **PROMPT 1** | **Arsitektur DB & Fitur** | Spesifikasi Bisnis Apotek | Schema 3 Tabel Utama & Blueprint Fitur Admin/Kasir | **Gemini Canvas** |
| **PROMPT 2** | **Workflow & Tech Stack** | Hasil Prompt 1 | Alur Bisnis Step-by-Step & Stack React + Supabase | **Gemini Canvas** |
| **PROMPT 3** | **UI Prototype HTML** | Hasil Prompt 1 & 2 | Single-file UI Prototype [`docs/demo/index.html`](docs/demo/index.html) | **Gemini Canvas** |
| **PROMPT 4** | **Blueprint Migration (`prompt.md`)** | File `index.html` | Dokumentasi Analisis Celah & SoC Guide (`prompt.md`) | **Gemini Canvas** |
| **PROMPT 5** | **Fullstack Execution** | `index.html` & `prompt.md` | Aplikasi Web Modern di [`Frontend/`](Frontend/) & [`Backend/`](Backend/) | **Gemini + Claude Antigravity** |
| **PROMPT 6** | **Diagram System Rendering** | Schema DB & Workflow | HTML Diagram Renderers di [`docs/diagrams_html/`](docs/diagrams_html/) | **Gemini + Claude Antigravity** |

---

### 2️⃣ Fase 2: Academic Documentation & Quality Assurance (Tahap 7 – 9)
*Alur Penyusunan Dokumentasi Akademik PBL, Slide Presentasi, dan Pengujian Akhir Repositori*

```mermaid
flowchart LR
    T7["TAHAP 7: Penyusunan Laporan Academic DOCX & PDF"] --> T8["TAHAP 8: Desain Slide Presentasi PPTX"]
    T8 --> T9["TAHAP 9: Restrukturisasi Repositori & Final QA"]
```

#### 📋 Matriks Tahapan Dokumentasi & QA:

| Tahap | Fokus Pekerjaan | Input & Prasyarat | Output Berkas Akademik | Pelaksana |
| :---: | :--- | :--- | :--- | :---: |
| **TAHAP 7** | **Penyusunan Laporan Academic** | Data Proyek & Screenshot | Laporan Akhir PBL [`docs/reports/laporan_akhir_pbl_apotek.docx`](docs/reports/laporan_akhir_pbl_apotek.docx) & [PDF](docs/reports/laporan_akhir_pbl_apotek.pdf) | **Tim Developer** |
| **TAHAP 8** | **Desain Slide Presentasi** | Metrik & Visual System | Slide Presentasi Modern 16:9 [`docs/reports/presentasi-proyek.pptx`](docs/reports/presentasi-proyek.pptx) | **Tim Developer** |
| **TAHAP 9** | **Restrukturisasi Repositori & QA** | Seluruh Berkas Proyek | Folder `docs/` Terorganisir, `.gitignore`, & `README.md` | **Tim Developer** |

> 💡 *Sintaks lengkap dan instruksi rinci dari setiap prompt dapat diakses di dokumen **[history-promt.md](docs/notes/history-promt.md)**.*

---

## ✨ Fitur Utama Sistem Informasi Apotek (ApotekSim)

- **📦 Manajemen Stok FEFO (*First Expired, First Out*)**: Pengeluaran obat otomatis memotong batch dengan tanggal kedaluwarsa paling dekat secara transaksional di database server untuk mencegah obat kadaluwarsa terdistribusi.
- **🛒 Point of Sales (POS) Kasir**: Fitur pencarian cepat obat, kalkulasi total harga otomatis, dan sistem proteksi modal skrining resep dokter untuk obat golongan Obat Keras (G).
- **📊 Dasbor Eksekutif & Peringatan Stok Minimum**: Visualisasi indikator warna real-time untuk pemantauan sisa stok, peringatan obat mendekati expired, dan grafik ringkasan transaksi bulanan.
- **🛡️ PostgreSQL Row Level Security (RLS)**: Penerapan kebijakan keamanan database di mana role Kasir hanya diberi hak akses baca (*SELECT*) dan pemotongan stok transaksional, sedangkan role Admin memiliki akses penuh mutasi data.

---

## 🖼️ Tampilan Antarmuka (UI Showcase)

<div align="center">

| Dasbor Utama Admin | Point of Sales (POS) Kasir |
| :---: | :---: |
| ![Dasbor Admin](docs/assets/ui_dashboard_admin.png) | ![POS Kasir](docs/assets/ui_pos_kasir.png) |

| Master Data Katalog Obat | Faktur Pembelian (Restock) |
| :---: | :---: |
| ![Katalog Obat](docs/assets/ui_katalog_obat.png) | ![Tabel Restock](docs/assets/ui_tabel_restock.png) |

</div>

---

## 📐 Diagram Sistem & Perancangan Basis Data

<div align="center">

| 1. Diagram Konteks |
| :---: |
| ![Diagram Konteks](docs/assets/diagram_konteks.png) |
| *Alur batas sistem dan interaksi antara entitas eksternal (Admin & Kasir) dengan ApotekSim.* |

<br/>

| 2. Data Flow Diagram (DFD Level 0) |
| :---: |
| ![DFD Level 0](docs/assets/dfd_level0.png) |
| *Peta aliran data komprehensif mencakup Pengadaan Obat, Stok Multi-Batch, POS Kasir, dan Laporan Eksekutif.* |

<br/>

| 3. Entity Relationship Diagram (ERD) |
| :---: |
| ![ERD Database](docs/assets/erd_database.png) |
| *Struktur relasi basis data PostgreSQL dinormalisasi (Tabel Supplier, Obat, Batch Detail, dan Transaksi).* |

</div>

---

## 📁 Struktur Repositori Terorganisir

Repositori ini telah dirapikan menggunakan standar struktur yang bersih dan modular:

```gfm
Sistem-Informasi-Apotek/
├── Frontend/                   # Aplikasi Web React + Vite + Tailwind CSS
│   ├── src/                    # Components, Pages, Hooks, & Supabase Client Services
│   ├── package.json            # NPM Dependencies
│   └── vite.config.ts          # Vite Configuration
├── Backend/                    # Backend Configuration & Database
│   └── supabase/               # SQL Schema, Migrations, & RLS Security Policies
├── docs/                       # Dokumentasi Terstruktur Proyek
│   ├── assets/                 # Screenshot UI & GIF Animasi (.png/.gif)
│   ├── reports/                # Laporan Akhir PBL (.docx & .pdf) & Presentasi (.pptx)
│   ├── diagrams_html/          # Renderer Diagram Mermaid.js (render_*.html)
│   ├── demo/                   # Standalone Interactive HTML Prototype (index.html)
│   └── notes/                  # Format Laporan & Master Prompt Pipeline
├── .gitignore                  # Aturan penanganan file sampel, env, & lock files
└── README.md                   # Dokumentasi Utama Repositori (File Ini)
```

---

## 🚀 Panduan Memulai & Reproduksi Proyek (Getting Started)

### **1. Prasyarat Sistem**
- **Node.js** v18+ dan `npm`
- Akun **Supabase** (untuk database cloud PostgreSQL)

---

### **2. Menjalankan Aplikasi Frontend (React + Vite)**

```bash
# Masuk ke direktori Frontend
cd Frontend

# Install seluruh dependensi
npm install

# Salin dan sesuaikan variabel lingkungan (.env)
cp .env.example .env
# Isikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY Anda

# Jalankan server pengembangan lokal
npm run dev
```
Buka browser pada alamat `http://localhost:5173`.

---

### **3. Menjalankan Prototipe Standalone via Browser (Tanpa Installation)**

Anda dapat menguji antarmuka prototipe UI tanpa perlu menjalankan server Node.js:
- Buka berkas **[`docs/demo/index.html`](docs/demo/index.html)** langsung melalui browser.

---

## 📑 Indeks Dokumentasi Proyek

- [📹 Video Demonstrasi Sistem (.mp4)](https://raw.githubusercontent.com/sahruulmubarokk-dot/Sistem-Informasi-Apotek/main/docs/reports/vidio-demonstrasi.mp4): Berkas video rekaman peragaan fitur 3 role (Admin, Apoteker, Kasir).
- [📜 Master Prompt Pipeline Guide](docs/notes/history-promt.md): Panduan urutan prompt 1-6 dan tahapan proyek hingga deployment.
- [📄 Laporan Akhir PBL (.docx)](docs/reports/laporan_akhir_pbl_apotek.docx): Dokumen formal akademik Word.
- [📕 Laporan Akhir PBL (.pdf)](docs/reports/laporan_akhir_pbl_apotek.pdf): Berkas PDF Laporan Akhir PBL siap cetak/kumpul.
- [📊 Slide Presentasi Proyek (.pptx)](docs/reports/presentasi-proyek.pptx): Presentation deck 16:9 berdesain profesional.

---

## 🎓 Identitas Tugas & Lisensi

- **Mata Kuliah**: Project-Based Learning (PBL) / Sistem Informasi
- **Institusi**: Universitas Dr. Soetomo (UNITOMO) Surabaya

<div align="center">

[![UNITOMO](docs/assets/UNITOMO.jpg)](https://unitomo.ac.id/)

<sub>Dikembangkan dengan Pendekatan AI-Driven Engineering • 2026</sub>

</div>
