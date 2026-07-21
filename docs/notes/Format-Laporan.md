LAPORAN AKHIR PROJECT-BASED LEARNING (PBL)

RANCANG BANGUN SISTEM INFORMASI APOTEK BERBASIS WEB (APOTEKSIM) DENGAN ARSITEKTUR MODERN FULL-STACK DAN INTEGRASI SUPABASE

Diajukan untuk Memenuhi Persyaratan Kelulusan Mata Kuliah Project-Based Learning

Disusun Oleh Kelompok 4:

Nama Anggota

NIM

Peran Utama

Fahri Adis Al Hafni

202511420105

Fullstack Developer & DB Designer

Sahrul Mubarok

202511420107

Backend & Cloud Infrastructure

Ach Tohir

202511420048

Frontend UI/UX & QA Tester

[PLACEHOLDER LOGO UNIVERSITAS DR. SOETOMO]

(Rekomendasi ukuran logo: Lebar 6 cm, Tinggi 6 cm, diletakkan secara simetris di tengah)

PROGRAM STUDI TEKNIK INFORMATIKA

FAKULTAS TEKNIK

UNIVERSITAS DR. SOETOMO

SURABAYA

2026

\pagebreak

LEMBAR PENGESAHAN

Laporan Akhir Project-Based Learning (PBL) dengan judul "Rancang Bangun Sistem Informasi Apotek Berbasis Web (ApotekSim) dengan Arsitektur Modern Full-Stack dan Integrasi Supabase" ini telah diperiksa, disetujui, dan disahkan sebagai salah satu syarat akademis dalam menyelesaikan mata kuliah Project-Based Learning pada Program Studi Teknik Informatika, Fakultas Teknik, Universitas Dr. Soetomo Surabaya.

Surabaya, 12 Juli 2026

Menyetujui & Mengesahkan,

Jabatan

Nama & Tanda Tangan

Tanggal

Dosen Pengampu PBL

__________________________



NIDN.

_______________

Ketua Program Studi

__________________________



NIDN.

_______________

Dibuat Oleh Kelompok 4:

Jabatan

Nama Kelompok

Tanda Tangan

Ketua / Fullstack

Fahri Adis Al Hafni

_______________

Anggota / Backend

Sahrul Mubarok

_______________

Anggota / Frontend

Ach Tohir

_______________

\pagebreak

KATA PENGANTAR

Puji syukur kehadirat Allah SWT atas segala rahmat, hidayah, dan karunia-Nya, sehingga penulis dapat menyelesaikan Laporan Akhir Project-Based Learning (PBL) dengan judul "Rancang Bangun Sistem Informasi Apotek Berbasis Web (ApotekSim) dengan Arsitektur Modern Full-Stack dan Integrasi Supabase" dengan baik dan tepat pada waktunya.

Laporan ini disusun sebagai salah satu syarat akademis dalam menyelesaikan mata kuliah Project-Based Learning pada Program Studi Teknik Informatika, Fakultas Teknik, Universitas Dr. Soetomo Surabaya. Dalam proyek ini, penulis bersama tim merancang, membangun, dan menguji purwarupa sistem informasi manajemen apotek terintegrasi yang berfokus pada efisiensi transaksi, otomatisasi inventaris berbasis metode FEFO (First Expired, First Out), serta keamanan data transaksional yang andal.

Penulis menyadari bahwa keberhasilan penyusunan laporan dan proyek PBL ini tidak terlepas dari bimbingan, arahan, dan dukungan dari berbagai pihak. Oleh karena itu, pada kesempatan ini penulis menyampaikan rasa terima kasih yang sebesar-besarnya kepada:

Dekan Fakultas Teknik Universitas Dr. Soetomo, yang telah memfasilitasi sarana akademik pendukung selama pelaksanaan perkuliahan.

Ketua Program Studi Teknik Informatika, yang senantiasa mengarahkan kurikulum berbasis industri dan pembelajaran berbasis proyek yang relevan.

Dosen Pengampu Mata Kuliah Project-Based Learning, yang telah memberikan bimbingan teknis, saran metodologi, serta kritik konstruktif yang sangat berharga selama pengembangan sistem.

Rekan-rekan Kelompok 4, atas dedikasi, kolaborasi intensif, dan kerja keras yang tidak kenal lelah dalam merealisasikan aplikasi ini dari tahap analisis hingga deployment.

Orang Tua dan Keluarga, atas doa dan dorongan moral yang tak terputus sehingga penulis dapat menyelesaikan tanggung jawab akademis ini dengan lancar.

Penulis menyadari bahwa laporan ini masih jauh dari kesempurnaan. Oleh karena itu, kritik dan saran yang membangun sangat penulis harapkan demi perbaikan penelitian dan pengembangan perangkat lunak di masa yang akan datang. Akhir kata, semoga laporan ini dapat memberikan manfaat nyata bagi pembaca, institusi akademis, serta perkembangan ilmu pengetahuan di bidang teknologi informasi.

\pagebreak

DAFTAR ISI

BAB I: PENDAHULUAN

1.1 Latar Belakang Masalah

1.2 Rumusan Masalah

1.3 Batasan Masalah

1.4 Tujuan Proyek

1.5 Manfaat Proyek

BAB II: LANDASAN TEORI

2.1 Sistem Informasi Manajemen (SIM) Apotek

2.2 Manajemen Inventaris Metode FEFO (First Expired, First Out)

2.3 Arsitektur Modern Full-Stack (Next.js & TypeScript)

2.4 Cloud Backend-as-a-Service (Supabase & PostgreSQL)

2.5 Object-Relational Mapping (ORM) & Desain Type-Safe

BAB III: ANALISIS DAN PERANCANGAN SISTEM

3.1 Analisis Kebutuhan Sistem (Functional & Non-Functional)

3.2 Analisis Permasalahan Sistem Tradisional vs Statis

3.3 Perancangan Arsitektur Basis Data Relasional (Data Schema)

3.4 Konsep Hubungan dan Kardinalitas Entitas (Entity Relationship)

3.5 Alur Kerja Bisnis Sistem (End-to-End System Workflow)

3.6 Perancangan Struktur Navigasi & Arsitektur Direktori Proyek

BAB IV: IMPLEMENTASI DAN PENGUJIAN

4.1 Deskripsi Lingkungan Implementasi (Development Stack)

4.2 Transformasi Komponen UI Statis ke Dynamic Framework

4.3 Penerapan Kebijakan Keamanan Row Level Security (RLS) Supabase

4.4 Skenario Pengujian Sistem (Black-Box Testing)

BAB V: PENUTUP

5.1 Kesimpulan

5.2 Saran Pengembangan Selanjutnya

DAFTAR PUSTAKA

\pagebreak

BAB I: PENDAHULUAN

1.1 Latar Belakang Masalah

Apotek merupakan salah satu pilar krusial dalam rantai pasok pelayanan kesehatan masyarakat. Operasional harian apotek menuntut ketelitian tinggi, mulai dari pelacakan ketersediaan obat, pengelolaan tanggal kedaluwarsa, pencatatan resep dokter secara legal, hingga pencatatan transaksi kasir harian (Point of Sales). Berdasarkan observasi lapangan pada sejumlah apotek skala menengah ke bawah, sebagian besar manajemen operasional masih mengandalkan pencatatan manual berbasis buku atau bantuan aplikasi lembar sebar (spreadsheet) lokal yang tidak terintegrasi.

Kondisi manajemen yang belum terdigitalisasi secara andal ini menimbulkan berbagai risiko operasional yang fatal, di antaranya:

Kerugian Finansial Akibat Obat Kedaluwarsa: Ketiadaan pencatatan berbasis batch berakibat pada penumpukan obat yang melewati masa kedaluwarsa tanpa terdeteksi sejak dini. Hal ini merugikan apotek karena obat tidak dapat diretur ke pemasok (supplier).

Kesalahan Manusia (Human Error) dalam Stok: Selisih antara pencatatan stok di atas kertas dengan kondisi fisik di gudang sering terjadi akibat proses transaksi kasir yang tidak langsung memotong jumlah inventaris secara real-time.

Pelanggaran Regulasi Obat Keras: Penjualan obat kategori keras, narkotika, atau psikotropika tanpa pengawasan data resep dokter yang tervalidasi dapat berujung pada sanksi administratif hingga pencabutan izin operasional apotek oleh otoritas kesehatan terkait.

Seiring perkembangan teknologi informasi, transformasi digital di ranah operasional apotek menjadi sebuah keharusan. Namun, banyak sistem manajemen apotek yang ada saat ini masih menggunakan arsitektur monolitik tradisional yang lambat, sulit dikembangkan, dan rentan terhadap serangan keamanan siber di sisi klien (client-side manipulation). Oleh karena itu, diperlukan sebuah solusi sistem informasi berbasis web modern yang responsif, mengutamakan validitas data transaksional, serta aman secara menyeluruh dari sisi klien hingga ke tingkat penyimpanan data di komputasi awan (cloud).

Melalui program Project-Based Learning (PBL) ini, Kelompok 4 merancang dan membangun ApotekSim, sebuah Sistem Informasi Apotek berbasis web yang menggunakan arsitektur modern full-stack menggunakan Next.js (TypeScript) di sisi antarmuka, didukung oleh infrastruktur Supabase (PostgreSQL) di sisi backend. Sistem ini dirancang untuk menyelesaikan masalah krusial di atas dengan mengutamakan manajemen batch obat terotomatisasi, sistem antrean FEFO, sinkronisasi data real-time, dan pengamanan akses berbasis peran (RBAC) yang ketat.

1.2 Rumusan Masalah

Berdasarkan latar belakang masalah yang telah diuraikan, rumusan masalah dalam proyek PBL ini adalah sebagai berikut:

Bagaimana merancang arsitektur basis data relasional yang ternormalisasi untuk sistem manajemen apotek yang melibatkan entitas Obat, Supplier, dan Pembelian?

Bagaimana mengimplementasikan sistem antrean pengeluaran barang berbasis First Expired, First Out (FEFO) secara otomatis pada saat proses transaksi kasir (Point of Sales) berlangsung?

Bagaimana membangun sistem informasi apotek dengan mematuhi prinsip Clean Code dan Separation of Concerns (SoC) menggunakan integrasi kerangka kerja Next.js dan Supabase?

Bagaimana mengamankan transaksi data finansial dan operasional apotek dari manipulasi siber sisi klien menggunakan kebijakan keamanan database yang kokoh?

1.3 Batasan Masalah

Agar penelitian dan pembangunan sistem ini berjalan secara terfokus dan optimal, batasan masalah yang ditetapkan adalah:

Fokus Operasional: Sistem mencakup pengelolaan data master obat, data master supplier, pencatatan transaksi pembelian (restock) berbasis batch, pencatatan transaksi kasir (POS), skrining resep dokter, dan dasbor laporan keuangan berupa grafik sederhana.

Teknologi Backend: Basis data dan layanan infrastruktur server sepenuhnya menggunakan ekosistem Supabase BaaS yang ditenagai oleh PostgreSQL.

Teknologi Frontend: Menggunakan Next.js/React.js dengan bahasa pemrograman TypeScript dan pustaka gaya Tailwind CSS serta komponen visual Shadcn/ui.

Konektivitas: Sistem diasumsikan berjalan dalam kondisi terhubung dengan jaringan internet (online-first system) agar sinkronisasi data real-time dapat berfungsi.

1.4 Tujuan Proyek

Adapun tujuan yang ingin dicapai melalui proyek pengembangan ApotekSim ini adalah:

Menghasilkan rancangan arsitektur basis data relasional yang skalabel dan ternormalisasi guna menghindari redundansi data obat, supplier, dan transaksi pembelian.

Mengembangkan antarmuka pengguna (user interface) kasir digital (POS) yang cepat, intuitif, dan responsif guna menekan waktu tunggu transaksi konsumen.

Mengotomatisasikan pelacakan tanggal kedaluwarsa serta batas minimum stok obat guna mempermudah proses pengambilan keputusan pengadaan obat kembali (reorder).

Mengimplementasikan kebijakan keamanan tingkat baris data (Row Level Security) pada Supabase guna memastikan hak akses data yang presisi antara Admin, Apoteker, dan Kasir.

1.5 Manfaat Proyek

Pembangunan proyek ApotekSim diharapkan memberikan manfaat bagi beberapa pihak berikut:

Bagi Pemilik dan Manajemen Apotek: Membantu mengoptimalkan efisiensi kerja staf, meminimalkan kerugian finansial akibat obat kedaluwarsa lewat sistem FEFO otomatis, serta menyajikan laporan keuangan dan stok secara transparan dan akurat.

Bagi Apoteker dan Staf Kasir: Mempermudah pekerjaan transaksi harian, mengeliminasi proses pengecekan fisik stok secara manual yang memakan waktu, serta menjaga kepatuhan hukum transaksi obat keras melalui form skrining resep digital.

Bagi Bidang Akademis dan Mahasiswa: Menjadi referensi ilmiah nyata mengenai penerapan arsitektur web modern full-stack (Serverless / Cloud-native) yang memanfaatkan kombinasi Next.js, TypeScript, dan Supabase untuk memecahkan kasus bisnis dunia nyata.

\pagebreak

BAB II: LANDASAN TEORI

2.1 Sistem Informasi Manajemen (SIM) Apotek

Sistem Informasi Manajemen (SIM) merupakan sebuah sistem terintegrasi manusia-mesin yang menyediakan informasi untuk mendukung kegiatan operasional, manajemen, dan fungsi pengambilan keputusan dalam suatu organisasi. Di dalam konteks apotek, SIM berfungsi mengintegrasikan seluruh alur informasi barang masuk (pengadaan), barang keluar (penjualan kasir), sirkulasi keuangan, serta dokumentasi administratif medis. SIM yang baik harus mampu menyajikan data yang konsisten dan akurat pada setiap titik operasional (touchpoint) guna menghindari terjadinya selisih data stok maupun kesalahan kalkulasi kasir.

2.2 Manajemen Inventaris Metode FEFO (First Expired, First Out)

Dalam industri farmasi dan medis, manajemen persediaan barang sangat sensitif terhadap faktor waktu. Metode FEFO (First Expired, First Out) menetapkan bahwa barang atau obat-obatan yang memiliki tanggal kedaluwarsa (expiry date) paling dekat harus dikeluarkan atau dijual terlebih dahulu, tanpa mempedulikan urutan kedatangan fisik obat tersebut di gudang penyimpanan.

Formulasi matematis alokasi stok berdasarkan antrean FEFO dapat dinyatakan sebagai berikut:

Misalkan suatu jenis obat $O$ memiliki beberapa batch persediaan $B = \{b_1, b_2, \dots, b_n\}$, di mana setiap batch $b_i$ memiliki kuantitas stok $q_i$ and tanggal kedaluwarsa $E(b_i)$. Himpunan batch diurutkan berdasarkan relasi:

$$E(b_1) \le E(b_2) \le \dots \le E(b_n)$$

Ketika terjadi permintaan transaksi penjualan sejumlah unit $Q$, sistem harus mengalokasikan pengurangan stok secara berurutan mulai dari $b_1$. Untuk setiap batch $b_i$ dalam urutan tersebut, jumlah pengurangan $d_i$ ditentukan oleh formula:

$$d_i = \min(Q_{\text{sisa}}, q_i)$$

Di mana $Q_{\text{sisa}}$ diperbarui pada setiap iterasi:

$$Q_{\text{sisa}}^{(i)} = Q_{\text{sisa}}^{(i-1)} - d_i \quad \text{dengan} \quad Q_{\text{sisa}}^{(0)} = Q$$

Proses ini terus berjalan hingga $Q_{\text{sisa}} = 0$. Jika $Q > \sum_{i=1}^{n} q_i$, sistem akan menolak transaksi karena jumlah stok total tidak mencukupi permintaan. Implementasi otomatisasi FEFO pada database mencegah apoteker salah mengambil obat berumur pendek dan mengoptimalkan sisa masa simpan produk di rak apotek.

2.3 Arsitektur Modern Full-Stack (Next.js & TypeScript)

Pengembangan web modern bergeser ke arah arsitektur terisolasi yang mengutamakan kecepatan render dan keamanan tipe data. Next.js sebagai kerangka kerja React tingkat lanjut (React Framework for the Web) mengintegrasikan kemampuan Server-Side Rendering (SSR) dan Static Site Generation (SSG) dengan Hydration di sisi klien. Pendekatan ini meminimalkan beban komputasi di browser kasir karena halaman analitik atau laporan keuangan yang rumit diproses terlebih dahulu di server sebelum dikirim dalam bentuk HTML statis siap saji.

Penggunaan bahasa TypeScript menambahkan lapisan keamanan statis (static type-safety) di atas JavaScript. Dengan TypeScript, definisi skema objek obat dan transaksi dikunci sejak tahap penulisan kode. Hal ini mencegah terjadinya runtime errors yang fatal, seperti kesalahan pengiriman data harga (bertipe string alih-alih number) ke database yang dapat mengacaukan perhitungan matematis total omset penjualan.

2.4 Cloud Backend-as-a-Service (Supabase & PostgreSQL)

Supabase merupakan platform Backend-as-a-Service (BaaS) sumber terbuka yang ditenagai oleh mesin basis data PostgreSQL. Berbeda dengan BaaS berbasis NoSQL (seperti Firebase), Supabase mendukung penuh integritas relasional, kepatuhan prinsip ACID (Atomicity, Consistency, Isolation, Durability), dan query SQL yang kompleks.

Pilar utama Supabase yang dimanfaatkan dalam pembangunan ApotekSim meliputi:

Supabase Auth: Layanan manajemen pengguna bawaan yang mengelola pendaftaran, login, autentikasi multi-faktor, dan pembuatan token akses JSON Web Token (JWT) yang aman.

Supabase Realtime: Layanan sinkronisasi data instan melalui koneksi WebSockets, memungkinkan perubahan data di tingkat database PostgreSQL langsung dipancarkan ke antarmuka kasir secara real-time.

PostgreSQL Row Level Security (RLS): Fitur mesin database Postgres yang memungkinkan pembuatan kebijakan (policies) keamanan kustom. RLS memastikan bahwa meskipun klien terhubung langsung ke database via SDK, klien hanya dapat melihat atau memodifikasi baris data yang diizinkan berdasarkan identitas JWT miliknya.

2.5 Object-Relational Mapping (ORM) & Desain Type-Safe

Untuk menjembatani perbedaan representasi data antara objek di dalam kode TypeScript dan relasi tabel di database PostgreSQL, digunakan teknologi Object-Relational Mapping (ORM) modern seperti Prisma atau Drizzle. ORM bertindak sebagai generator skema deklaratif. Pengembang hanya perlu menuliskan definisi tabel di satu tempat, kemudian ORM akan menerjemahkannya menjadi migrasi SQL resmi sekaligus menyediakan fungsi-fungsi akses basis data yang dilengkapi auto-complete cerdas pada teks editor. Hal ini mengeliminasi penulisan query SQL mentah yang rawan terhadap serangan SQL Injection.

\pagebreak

BAB III: ANALISIS DAN PERANCANGAN SISTEM

3.1 Analisis Kebutuhan Sistem (Functional & Non-Functional)

Analisis kebutuhan dilakukan untuk memetakan seluruh kapabilitas yang wajib dimiliki oleh ApotekSim agar dapat menjawab tantangan operasional apotek nyata.

A. Kebutuhan Fungsional (Functional Requirements)

Sistem Autentikasi & RBAC: Sistem harus mampu mengenali peran pengguna (Admin, Apoteker, Kasir) dan membatasi akses menu visual maupun izin mutasi database sesuai peran tersebut.

Manajemen Master Data (Obat & Supplier): Admin dapat melakukan operasi CRUD (Create, Read, Update, Delete) pada tabel Obat dan Supplier secara aman.

Dokumentasi Pengadaan (Restock): Sistem harus mampu merekam data transaksi pembelian dari supplier dengan menyertakan detail no faktur, tanggal, harga beli, kuantitas masuk, dan masa kedaluwarsa spesifik per batch produk.

Kasir Digital (Point of Sales): Kasir dapat memilih item belanja, menginput kuantitas, menyaring resep dokter untuk kategori obat keras, menghitung pajak PPN, dan memproses checkout yang langsung mengurangi stok batch secara otomatis berbasis antrean FEFO.

Notifikasi Alarm & Dasbor: Sistem harus menyajikan dasbor visual grafik penjualan serta memunculkan peringatan berwarna merah jika stok obat di bawah batas minimum (low stock alert) atau jika ada batch obat yang mendekati tanggal kedaluwarsa ($< 3$ bulan).

B. Kebutuhan Non-Fungsional (Non-Functional Requirements)

Keamanan Data: Enkripsi lalu lintas data wajib menggunakan protokol HTTPS. Database harus mengunci hak akses data menggunakan Row Level Security (RLS).

Performa Kecepatan: Waktu respon pencarian katalog obat dan eksekusi transaksi checkout kasir tidak boleh melebihi $2$ detik pada koneksi internet standar guna mencegah penumpukan antrean fisik konsumen.

Kepatuhan ACID: Setiap transaksi keuangan wajib dieksekusi secara atomik. Jika proses pemotongan stok gagal, maka catatan penjualan dan laporan keuangan tidak boleh tersimpan (rollback).

Skalabilitas: Struktur database harus dinormalisasi minimal hingga tingkat bentuk normal ketiga (3NF) agar sistem tetap responsif meski data transaksi bertambah hingga ratusan ribu baris.

3.2 Analisis Permasalahan Sistem Tradisional vs Statis

Dalam merancang sistem ini, tim mengidentifikasi jurang perbedaan fungsional yang lebar antara prototipe statis dengan sistem dinamis produksi:

Karakteristik

Prototipe HTML Statis

Sistem Dinamis Target (ApotekSim)

Penyimpanan State

Berada di memori browser (hilang saat refresh atau ganti tab).

Disimpan secara persisten di cloud database PostgreSQL Supabase.

Validasi Transaksi

Dilakukan di sisi klien menggunakan JavaScript biasa (mudah diretas).

Dieksekusi secara ketat di sisi server via database triggers & RPC.

Keamanan Data

Tanpa enkripsi sesi, tanpa login, semua orang bisa mengubah tampilan.

Autentikasi token JWT, proteksi rute middleware, dan proteksi database RLS.

Sinkronisasi Stok

Manual dan terisolasi pada satu browser saja.

Real-time dua arah memanfaatkan teknologi WebSockets Supabase.

3.3 Perancangan Arsitektur Basis Data Relasional (Data Schema)

Untuk menjamin skalabilitas dan integritas, arsitektur data dibagi menjadi tiga entitas utama yang dinormalisasi menjadi skema relasional berikut:

1. Tabel Master: Supplier

Tabel ini digunakan untuk mengidentifikasi mitra vendor pemasok obat ke apotek.

ID_Supplier (UUID, Primary Key, Auto-generate)

Nama_Supplier (VARCHAR(150), Not Null)

No_Telepon (VARCHAR(20), Not Null)

Alamat (TEXT, Not Null)

Created_At (TIMESTAMP, Default: Now())

2. Tabel Master: Obat

Tabel ini menyimpan profil utama produk obat tanpa informasi batch spesifik untuk menghindari redundansi data statis.

ID_Obat (UUID, Primary Key, Auto-generate)

Nama_Obat (VARCHAR(150), Not Null, Unique)

Kategori_Obat (VARCHAR(50), Not Null) -> e.g., Analgesik, Antibiotik, Vitamin

Harga_Jual (DECIMAL(12, 2), Not Null)

Batas_Minimum_Stok (INT, Default: 10)

Stok_Total (INT, Default: 0) -> Nilai terkonsolidasi dari seluruh batch aktif

Created_At (TIMESTAMP, Default: Now())

3. Tabel Transaksi Induk: Pembelian_Obat (Restock)

Mencatat dokumen pengadaan obat yang masuk dari supplier eksternal.

ID_Pembelian (UUID, Primary Key, Auto-generate)

No_Faktur (VARCHAR(100), Not Null, Unique)

ID_Supplier (UUID, Foreign Key merujuk ke Supplier.ID_Supplier, On Delete Restrict)

Tanggal_Pembelian (DATE, Default: Current_Date)

Total_Pengeluaran (DECIMAL(15, 2), Not Null)

Admin_Penginput (UUID, Foreign Key merujuk ke Supabase Auth Users)

4. Tabel Transaksi Detail (Bridge): Detail_Pembelian_Obat (Batch Inventory)

Karena satu faktur pembelian dapat memuat banyak item obat dan setiap item obat memiliki tanggal kedaluwarsa batch yang unik, maka relasi Many-to-Many antara Obat dan Pembelian_Obat dipecah melalui tabel detail ini. Tabel ini sekaligus bertindak sebagai tempat pencatatan batch inventaris fisik utama.

ID_Detail_Pembelian (UUID, Primary Key, Auto-generate)

ID_Pembelian (UUID, Foreign Key merujuk ke Pembelian_Obat.ID_Pembelian, On Delete Cascade)

ID_Obat (UUID, Foreign Key merujuk ke Obat.ID_Obat, On Delete Restrict)

Nomor_Batch (VARCHAR(50), Not Null)

Jumlah_Masuk (INT, Not Null, Validasi: > 0)

Stok_Sisa_Batch (INT, Not Null) -> Kuantitas yang berkurang saat kasir memproses POS

Harga_Beli_Satuan (DECIMAL(12, 2), Not Null)

Tanggal_Kedaluwarsa (DATE, Not Null) -> Acuan utama algoritma FEFO

3.4 Konsep Hubungan dan Kardinalitas Entitas (Entity Relationship)

Relasi antar tabel diatur menggunakan batasan integritas referensial yang ketat guna memastikan tidak ada data yatim piatu (orphan data):

+---------------+ 1         N +--------------------+
|   Supplier    |------------>|   Pembelian_Obat   |
+---------------+             +--------------------+
                                        | 1
                                        |
                                        | N
+---------------+ 1         N +--------------------+
|     Obat      |------------>|Detail_Pembelian_Obat|
+---------------+             +--------------------+


Relasi Supplier ke Pembelian_Obat ($1:N$): Satu supplier dapat melakukan banyak kali pengiriman pasokan (transaksi pembelian). Namun, satu dokumen pembelian hanya boleh diterbitkan oleh satu supplier resmi. Integritas referensial diatur dengan batasan ON DELETE RESTRICT pada database, sehingga data supplier yang memiliki riwayat transaksi tidak dapat dihapus secara tidak sengaja dari sistem.

Relasi Obat ke Detail_Pembelian_Obat ($1:N$): Satu profil obat dapat muncul di berbagai batch detail pembelian dari waktu ke waktu. Satu baris detail pembelian (batch) hanya berasosiasi dengan satu jenis obat terdaftar. Relasi ini memisahkan entitas statis (nama obat, kategori) dengan data dinamis (stok per batch, tanggal kadaluwarsa batch).

3.5 Alur Kerja Bisnis Sistem (End-to-End System Workflow)

Alur operasional sistem informasi ApotekSim dirancang dengan diagram sekuensial logis berikut yang mencakup siklus hidup data:

[ ADMIN ]              [ SYSTEM DATABASE ]            [ KASIR ]
    │                            │                        │
    │ 1. Registrasi Supplier     │                        │
    ├───────────────────────────>│                        │
    │ 2. Katalogisasi Obat Baru  │                        │
    ├───────────────────────────>│                        │
    │ 3. Input Faktur Restock    │                        │
    ├───────────────────────────>│ (Simpan Batch & ED)    │
    │                            │                        │
    │                            │ 4. Tarik Katalog FEFO  │
    │                            │<───────────────────────┤
    │                            │                        │
    │                            │ 5. Validasi Transaksi  │
    │                            │<───────────────────────┤
    │                            │ (Cek Stok & Potong ED) │
    │                            │                        │
    │                            │ 6. Update Real-time    │
    │                            │───────────────────────>│ (Struk Cetak)
    │                            │                        │


Inisialisasi Data Master: Administrator mendaftarkan supplier baru, menginput katalog obat tanpa stok awal, serta mengatur parameter batas minimum stok aman di dalam database.

Pencatatan Masuk (Supply Chain): Administrator menerima pasokan obat, menginput data transaksi ke formulir Pembelian Obat dengan memasukkan kuantitas, harga beli, nomor batch baru, dan tanggal kedaluwarsa spesifik. Sistem secara otomatis menjalankan database trigger untuk mengkalkulasi dan memperbarui kolom Stok_Total pada tabel Obat.

Persiapan Kasir: Staf kasir membuka halaman Point of Sales (POS). Sistem secara otomatis menarik katalog obat terlaris yang hanya menampilkan batch-batch obat aktif yang belum kedaluwarsa dan diurutkan berdasarkan tanggal kedaluwarsa terdekat (FEFO sorting order).

Validasi Keranjang Belanja: Kasir memindai produk atau memilih manual dari katalog. Saat kasir menentukan jumlah beli, sistem backend melakukan pengecekan ganda (double check validation). Jika stok mencukupi, item masuk ke keranjang belanja kasir. Jika kategori transaksi diubah ke "Resep Dokter", sistem secara wajib memunculkan formulir input data Dokter (Nama, No SIP) dan nama Pasien.

Eksekusi Pembayaran: Kasir memilih metode pembayaran (Tunai/EDC/QRIS) dan menekan tombol checkout.

Mutasi Data di Sisi Server (Atomic Transaction):

Sistem backend mengeksekusi transaksi tingkat database.

Mengurangi nilai Stok_Sisa_Batch pada tabel Detail_Pembelian_Obat menggunakan algoritma FEFO secara sekuensial.

Memperbarui kolom Stok_Total di tabel Obat.

Jika sukses, merekam baris riwayat penjualan, mencetak struk belanja fisik, dan mengirimkan sinyal perubahan stok real-time ke browser kasir lainnya melalui koneksi WebSockets.

Jika stok obat terkonsolidasi jatuh di bawah batas minimum yang ditentukan, sistem secara otomatis menerbitkan notifikasi berwarna merah di dasbor admin untuk memicu proses reorder obat ke supplier.

3.6 Perancangan Struktur Navigasi & Arsitektur Direktori Proyek

ApotekSim dikembangkan dengan prinsip modularitas tinggi menggunakan struktur folder yang memisahkan tanggung jawab kode secara tegas (Separation of Concerns).

Berikut adalah skema visualisasi direktori proyek:

/
├── /frontend                    # Seluruh kode aplikasi antarmuka pengguna
│   ├── /public                  # Aset statis seperti logo, favicon, dan gambar
│   └── /src                     # Berkas sumber kode frontend
│       ├── /components          # Komponen UI modular yang dapat digunakan kembali
│       │   ├── /ui              # Komponen atomik dasar (tombol, input, dropdown, dialog)
│       │   ├── /pos             # Komponen khusus halaman kasir (keranjang, form resep, katalog)
│       │   └── /dashboard       # Komponen khusus dasbor admin (kartu analitik, diagram tren)
│       ├── /pages               # Representasi halaman rute aplikasi (Routing)
│       │   ├── /auth            # Halaman login dan manajemen kata sandi
│       │   ├── /pos             # Halaman operasional transaksi kasir
│       │   └── /dashboard       # Sub-halaman untuk ringkasan eksekutif dan manajemen master
│       ├── /hooks               # Custom hooks React/Vue untuk mengelola state lokal & logika
│       │   ├── useAuth.ts       # Hook untuk mengelola session dan role pengguna saat ini
│       │   ├── useCart.ts       # Hook untuk mengelola item belanja kasir dan hitungan harga
│       │   └── useMedicine.ts   # Hook untuk mengelola sinkronisasi realtime katalog obat
│       ├── /services            # Abstraksi pemanggilan API dan query Supabase SDK
│       │   ├── supabase.ts      # Inisialisasi Supabase client singleton dengan env variables
│       │   ├── dbMedicine.ts    # Layanan query khusus tabel Obat dan relasi Batch
│       │   ├── dbSupplier.ts    # Layanan query khusus tabel Supplier dan data kontak
│       │   └── dbTransaction.ts # Layanan eksekusi transaksi checkout dan pembuatan invoice
│       ├── /context             # Penyimpanan state global aplikasi (Session, Tema, Notifikasi)
│       └── /utils               # Fungsi utilitas (format mata uang Rupiah, kalkulator tanggal)
│
└── /backend                     # Seluruh konfigurasi database, skema, dan kebijakan keamanan
    └── /supabase
        ├── /migrations          # Berkas migrasi database SQL (version-controlled)
        │   ├── 0001_init.sql    # Migrasi awal pembuatan tabel Obat, Supplier, dan Pembelian
        │   ├── 0002_triggers.sql# Pembuatan fungsi otomatis (e.g., update total stok terkonsolidasi)
        │   └── 0003_rpcs.sql    # Fungsi transaksi server-side untuk checkout aman (FEFO)
        ├── /policies            # Definisi aturan Row Level Security (RLS) per tabel
        └── config.toml          # Konfigurasi proyek lokal Supabase CLI


\pagebreak

BAB IV: IMPLEMENTASI DAN PENGUJIAN

4.1 Deskripsi Lingkungan Implementasi (Development Stack)

Implementasi fisik sistem dilakukan pada lingkungan pengembangan dengan spesifikasi teknis sebagai berikut:

Sisi Klien (Frontend): Next.js 14 (App Router) menggunakan runtime Node.js v20.x, diprogram menggunakan TypeScript. Gaya komponen visual dibangun menggunakan Tailwind CSS v4 dan pustaka UI Shadcn/ui berbasis Radix Primitives.

Sisi Backend & Cloud Service: Supabase Cloud Platform. Database PostgreSQL v15 host lokal yang dikelola oleh Supabase CLI untuk mengotomatisasi migrasi.

Alat Pengembang: Visual Studio Code sebagai editor utama, Git dan GitHub untuk kontrol versi dan kolaborasi repositori, serta Postman untuk uji coba ketahanan API endpoint.

4.2 Transformasi Komponen UI Statis ke Dynamic Framework

Prototipe HTML statis yang telah dikembangkan diuji fungsionalitas visualnya, kemudian ditransformasikan menjadi komponen dinamis yang reaktif.

Isolasi State Keranjang Belanja: File HTML statis yang menyimpan data keranjang dalam memori lokal sementara dipindahkan ke dalam React State di dalam custom hook useCart.ts.

Dinamisasi Komponen POS: Skrining resep dokter yang sebelumnya disembunyikan menggunakan manipulasi DOM vanilla-JS diubah menjadi conditional rendering reaktif Next.js berbasis state transactionType == 'resep'.

Dinamisasi Katalog & Real-Time Sync: Data statis katalog obat diganti dengan fetching data asinkron dari Supabase melalui fungsi di dbMedicine.ts. Listener WebSockets dipasang untuk memantau perubahan database sehingga stok yang tampil di layar kasir selalu akurat.

4.3 Penerapan Kebijakan Keamanan Row Level Security (RLS) Supabase

Untuk mengamankan database dari bypass akses sisi klien, diimplementasikan kebijakan Row Level Security (RLS) di PostgreSQL. RLS bekerja dengan memverifikasi token JWT pengguna pada setiap request.

Berikut adalah kebijakan konseptual keamanan akses tabel database yang diterapkan:

-- Kebijakan Akses untuk Tabel Obat
ALTER TABLE Tabel_Obat ENABLE ROW LEVEL SECURITY;

-- 1. Kebijakan Membaca Data: Diperuntukkan bagi semua staff terautentikasi (Kasir, Apoteker, Admin)
CREATE POLICY "Semua staf terautentikasi dapat melihat katalog obat"
ON Tabel_Obat FOR SELECT
TO authenticated
USING (true);

-- 2. Kebijakan Modifikasi Data: Hanya boleh dilakukan oleh Administrator
CREATE POLICY "Hanya administrator yang boleh melakukan mutasi data obat"
ON Tabel_Obat FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');


Dengan kebijakan di atas, apabila akun yang memiliki peran kasir mencoba mengirimkan request modifikasi data obat (seperti menurunkan harga jual atau menghapus baris obat) melalui terminal konsol atau modifikasi javascript lokal, backend PostgreSQL Supabase secara otomatis akan menolak request tersebut dan melempar status error 403 Forbidden.

4.4 Skenario Pengujian Sistem (Black-Box Testing)

Pengujian perangkat lunak dilakukan menggunakan metode Black-Box Testing guna memastikan fungsionalitas antarmuka dan konsistensi data transaksional berjalan sesuai dengan kebutuhan sistem yang telah didefinisikan.

ID Uji

Fitur / Skenario Pengujian

Langkah Pengujian

Hasil yang Diharapkan

Status Kelayakan

TC-01

Autentikasi & Proteksi Akses

Mengakses halaman dasbor admin dengan akun kasir.

Sistem menolak akses dan mengalihkan pengguna kembali ke halaman POS kasir (Access Denied).

BERHASIL (PASSED)

TC-02

Entri Master Data Obat

Admin mengisi form obat baru dengan harga negatif ($-\text{Rp } 5.000$).

Sistem menampilkan pesan validasi error "Harga tidak boleh kurang dari atau sama dengan nol" dan menolak simpan.

BERHASIL (PASSED)

TC-03

Transaksi Kasir (Umum)

Memasukkan obat Paracetamol ke keranjang kasir sejumlah $5$ strip dan menekan bayar.

Transaksi sukses, struk tercetak, stok obat terpotong tepat sejumlah $5$ unit di database.

BERHASIL (PASSED)

TC-04

Transaksi Kasir (Resep)

Mengubah tipe transaksi ke resep namun mengosongkan nama dokter dan nomor SIP.

Sistem mengunci tombol bayar dan memunculkan notifikasi "Data resep dokter wajib diisi untuk kategori ini".

BERHASIL (PASSED)

TC-05

Otomatisasi Antrean FEFO

Melakukan transaksi pembelian obat Amoxicillin yang memiliki dua batch aktif: Batch A (ED: Des 2026, Stok: 10) and Batch B (ED: Mar 2027, Stok: 20). Kasir menjual sejumlah $12$ strip.

Sistem otomatis memotong habis stok Batch A sejumlah $10$ unit, kemudian memotong sisa $2$ unit dari Batch B. Sisa stok Batch B menjadi $18$.

BERHASIL (PASSED)

TC-06

Notifikasi Stok Minimum

Menjual Metformin hingga total stok terkonsolidasi tersisa $4$ strip (di bawah batas minimum yaitu $10$).

Dasbor Admin langsung memunculkan indikator warna merah berkedip sebagai sinyal peringatan Low Stock.

BERHASIL (PASSED)

\pagebreak

BAB V: PENUTUP

5.1 Kesimpulan

Berdasarkan seluruh tahapan analisis, perancangan, implementasi, dan pengujian yang telah dilaksanakan pada proyek Project-Based Learning ini, dapat ditarik beberapa kesimpulan sebagai berikut:

Purwarupa Sistem Informasi Apotek (ApotekSim) berhasil dibangun dengan mengimplementasikan arsitektur modern full-stack menggunakan kerangka kerja Next.js dan didukung penuh oleh layanan Cloud Backend-as-a-Service dari Supabase (PostgreSQL).

Perancangan basis data relasional yang dinormalisasi berhasil memisahkan data master statis dengan data mutasi transaksional yang dinamis, sehingga meminimalkan redundansi data dan meningkatkan kecepatan eksekusi query.

Otomatisasi pengeluaran barang berbasis metode FEFO (First Expired, First Out) berhasil diterapkan secara aman di tingkat database menggunakan fungsionalitas transaksi atomic server-side, sehingga memutus mata rantai human error apoteker dalam mendistribusikan obat yang mendekati kadaluwarsa.

Kebijakan keamanan tingkat baris data (Row Level Security) Supabase terbukti andal dalam menyaring hak akses mutasi database berdasarkan token autentikasi (JWT) pengguna, sehingga mencegah bypass keamanan dari sisi klien.

5.2 Saran Pengembangan Selanjutnya

Meskipun sistem ApotekSim ini telah berjalan dengan sangat baik dan memenuhi seluruh kebutuhan fungsional inti, tim penulis menyarankan beberapa poin pengembangan fitur di masa mendatang agar sistem ini menjadi lebih sempurna dan siap bersaing di pasar industri:

Implementasi Kemampuan Offline-First (PWA): Menambahkan kapabilitas Progressive Web App (PWA) dan sinkronisasi local-storage database (seperti RxDB atau Dexie.js) agar kasir tetap dapat melayani transaksi penjualan meskipun koneksi jaringan internet utama apotek terputus tiba-tiba.

Integrasi API Interaksi Obat: Mengintegrasikan sistem kasir dengan database medis eksternal (API MIMS/FDA) untuk mendeteksi potensi bahaya interaksi obat secara otomatis saat apoteker menginput resep kombinasi obat keras ke dalam sistem.

Sistem Prediksi Pengadaan Berbasis AI: Menambahkan modul analitik prediktif menggunakan algoritma Machine Learning sederhana guna memproyeksikan tren penjualan produk obat tertentu di masa mendatang berdasarkan data historis transaksi tahunan apotek.

\pagebreak

DAFTAR PUSTAKA

Connoly, T., & Begg, C. (2015). Database Systems: A Practical Approach to Design, Implementation, and Management (6th ed.). Boston: Pearson Education.

Fowler, M. (2018). Refactoring: Improving the Design of Existing Code (2nd ed.). Boston: Addison-Wesley.

Pressman, R. S., & Maxim, B. R. (2020). Software Engineering: A Practitioner's Approach (9th ed.). New York: McGraw-Hill Education.

Supabase. (2026). Supabase Documentation: Database Policies and Row Level Security. Diakses dari https://supabase.com/docs.

Vercel. (2026). Next.js Documentation: Server Actions and Client Components. Diakses dari https://nextjs.org/docs.