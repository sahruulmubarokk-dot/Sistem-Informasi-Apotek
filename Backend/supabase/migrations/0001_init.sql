-- 0001_init.sql
-- Inisialisasi Skema Database ApotekSim

-- 1. Tabel Profil Pengguna (Menghubungkan Auth.Users dengan Role Sistem)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'apoteker', 'kasir')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Master Supplier
CREATE TABLE public.supplier (
    id TEXT PRIMARY KEY, -- e.g., SPL-001, SPL-002
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'utama', 'nonaktif')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Master Obat
CREATE TABLE public.medicine (
    id TEXT PRIMARY KEY, -- e.g., OBT-001, OBT-002
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    min_stock INTEGER DEFAULT 10 CHECK (min_stock >= 0),
    stock_total INTEGER DEFAULT 0 CHECK (stock_total >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Batch Obat (Detail Persediaan per Tanggal Kedaluwarsa - FEFO)
CREATE TABLE public.medicine_batch (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id TEXT REFERENCES public.medicine(id) ON DELETE CASCADE NOT NULL,
    batch_code TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    stock INTEGER NOT NULL CHECK (stock >= 0),
    supplier_id TEXT REFERENCES public.supplier(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel Transaksi Penjualan (POS)
CREATE TABLE public.sales_transaction (
    id TEXT PRIMARY KEY, -- e.g., INV-20260630-001
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT NOT NULL CHECK (type IN ('umum', 'resep')),
    doctor_name TEXT,
    doctor_sip TEXT,
    patient_name TEXT,
    is_racikan BOOLEAN DEFAULT FALSE,
    subtotal NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    ppn NUMERIC(12,2) NOT NULL CHECK (ppn >= 0),
    total_payment NUMERIC(12,2) NOT NULL CHECK (total_payment >= 0),
    amount_paid NUMERIC(12,2) NOT NULL CHECK (amount_paid >= 0),
    change_returned NUMERIC(12,2) NOT NULL CHECK (change_returned >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('tunai', 'debit', 'qris')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 6. Tabel Detail Item Penjualan
CREATE TABLE public.sales_transaction_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT REFERENCES public.sales_transaction(id) ON DELETE CASCADE NOT NULL,
    medicine_id TEXT REFERENCES public.medicine(id) NOT NULL,
    batch_id UUID REFERENCES public.medicine_batch(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    total NUMERIC(12,2) NOT NULL CHECK (total >= 0)
);

-- 7. Tabel Transaksi Pembelian (Restock)
CREATE TABLE public.purchase_transaction (
    id TEXT PRIMARY KEY, -- e.g., FAK-MBS-99104
    supplier_id TEXT REFERENCES public.supplier(id) ON DELETE RESTRICT NOT NULL,
    transaction_date DATE DEFAULT CURRENT_DATE,
    total_cost NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total_cost >= 0),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 8. Tabel Detail Item Pembelian
CREATE TABLE public.purchase_transaction_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id TEXT REFERENCES public.purchase_transaction(id) ON DELETE CASCADE NOT NULL,
    medicine_id TEXT REFERENCES public.medicine(id) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    purchase_price NUMERIC(12,2) NOT NULL CHECK (purchase_price >= 0),
    batch_code TEXT NOT NULL,
    expiry_date DATE NOT NULL
);

-- =========================================================================
-- KEBIJAKAN KEAMANAN (ROW LEVEL SECURITY - RLS)
-- =========================================================================

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_batch ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_transaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_transaction_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_transaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_transaction_item ENABLE ROW LEVEL SECURITY;

-- 1. Kebijakan Tabel public.profiles
CREATE POLICY "Pengguna dapat membaca semua profil"
    ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Pengguna dapat memperbarui profil sendiri"
    ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admin dapat melakukan apa saja pada profil"
    ON public.profiles FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 2. Kebijakan Tabel public.supplier
CREATE POLICY "Pengguna terautentikasi dapat membaca data supplier"
    ON public.supplier FOR SELECT TO authenticated USING (true);

CREATE POLICY "Hanya Admin yang dapat mengelola data supplier"
    ON public.supplier FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 3. Kebijakan Tabel public.medicine
CREATE POLICY "Pengguna terautentikasi dapat membaca data obat"
    ON public.medicine FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin dan Apoteker dapat mengelola data obat"
    ON public.medicine FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'apoteker')));

-- 4. Kebijakan Tabel public.medicine_batch
CREATE POLICY "Pengguna terautentikasi dapat membaca batch obat"
    ON public.medicine_batch FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin dan Apoteker dapat mengelola batch obat"
    ON public.medicine_batch FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'apoteker')));

-- 5. Kebijakan Tabel public.sales_transaction
CREATE POLICY "Pengguna terautentikasi dapat melihat transaksi penjualan"
    ON public.sales_transaction FOR SELECT TO authenticated USING (true);

CREATE POLICY "Pengguna terautentikasi dapat membuat transaksi penjualan"
    ON public.sales_transaction FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Hanya Admin yang dapat mengubah/menghapus transaksi penjualan"
    ON public.sales_transaction FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 6. Kebijakan Tabel public.sales_transaction_item
CREATE POLICY "Pengguna terautentikasi dapat melihat detail penjualan"
    ON public.sales_transaction_item FOR SELECT TO authenticated USING (true);

CREATE POLICY "Pengguna terautentikasi dapat membuat detail penjualan"
    ON public.sales_transaction_item FOR INSERT TO authenticated WITH CHECK (true);

-- 7. Kebijakan Tabel public.purchase_transaction & public.purchase_transaction_item
CREATE POLICY "Pengguna terautentikasi dapat melihat transaksi restock"
    ON public.purchase_transaction FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin dan Apoteker dapat membuat transaksi restock"
    ON public.purchase_transaction FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'apoteker'))
    );

CREATE POLICY "Pengguna terautentikasi dapat melihat detail restock"
    ON public.purchase_transaction_item FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin dan Apoteker dapat membuat detail restock"
    ON public.purchase_transaction_item FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'apoteker'))
    );
