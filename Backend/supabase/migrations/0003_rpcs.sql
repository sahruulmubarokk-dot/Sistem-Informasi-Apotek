-- 0003_rpcs.sql
-- RPC PostgreSQL untuk Transaksi Multi-Tabel Aman (ACID)

-- 1. RPC Checkout Penjualan Kasir (Sistem Antrean FEFO Otomatis)
CREATE OR REPLACE FUNCTION public.checkout_transaction(
    p_type TEXT,
    p_doctor_name TEXT,
    p_doctor_sip TEXT,
    p_patient_name TEXT,
    p_is_racikan BOOLEAN,
    p_items JSONB, -- Format: [{"medicine_id": "OBT-001", "quantity": 5}]
    p_payment_method TEXT,
    p_amount_paid NUMERIC
) RETURNS TEXT AS $$
DECLARE
    v_transaction_id TEXT;
    v_date_str TEXT;
    v_count INTEGER;
    v_item JSONB;
    v_medicine_id TEXT;
    v_qty_requested INTEGER;
    v_qty_remaining INTEGER;
    v_batch RECORD;
    v_subtotal NUMERIC(12,2) := 0;
    v_ppn NUMERIC(12,2) := 0;
    v_total_payment NUMERIC(12,2) := 0;
    v_change NUMERIC(12,2) := 0;
    v_price NUMERIC(12,2);
    v_deducted_qty INTEGER;
    v_item_total NUMERIC(12,2);
    v_cashier_id UUID;
BEGIN
    -- Mengambil ID Kasir yang saat ini terautentikasi
    v_cashier_id := auth.uid();

    -- Generate ID Invoice Unik (Format: INV-YYYYMMDD-001)
    v_date_str := to_char(CURRENT_DATE, 'YYYYMMDD');
    SELECT COALESCE(COUNT(*), 0) + 1 INTO v_count
    FROM public.sales_transaction
    WHERE id LIKE 'INV-' || v_date_str || '-%';
    
    v_transaction_id := 'INV-' || v_date_str || '-' || lpad(v_count::text, 3, '0');

    -- Insert record transaksi awal dengan nominal 0 (diperbarui setelah perhitungan selesai)
    INSERT INTO public.sales_transaction (
        id, type, doctor_name, doctor_sip, patient_name, is_racikan, 
        subtotal, ppn, total_payment, amount_paid, change_returned, 
        payment_method, created_by
    ) VALUES (
        v_transaction_id, p_type, p_doctor_name, p_doctor_sip, p_patient_name, p_is_racikan,
        0, 0, 0, p_amount_paid, 0, p_payment_method, v_cashier_id
    );

    -- Loop data item keranjang belanja
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_medicine_id := v_item->>'medicine_id';
        v_qty_requested := (v_item->>'quantity')::INTEGER;
        v_qty_remaining := v_qty_requested;

        -- Dapatkan harga obat dari tabel master
        SELECT price INTO v_price FROM public.medicine WHERE id = v_medicine_id;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Obat dengan ID % tidak terdaftar di sistem', v_medicine_id;
        END IF;

        -- Validasi ketersediaan total stok obat (dari seluruh batch aktif)
        IF COALESCE((
            SELECT SUM(stock)
            FROM public.medicine_batch
            WHERE medicine_id = v_medicine_id
              AND expiry_date > CURRENT_DATE
        ), 0) < v_qty_requested THEN
            RAISE EXCEPTION 'Gagal checkout: Stok obat % tidak mencukupi kebutuhan transaksi.', 
                (SELECT name FROM public.medicine WHERE id = v_medicine_id);
        END IF;

        -- Ambil batch obat aktif diurutkan berdasarkan tanggal kedaluwarsa terdekat (FEFO)
        FOR v_batch IN 
            SELECT id, stock 
            FROM public.medicine_batch 
            WHERE medicine_id = v_medicine_id
              AND expiry_date > CURRENT_DATE
              AND stock > 0
            ORDER BY expiry_date ASC
        LOOP
            EXIT WHEN v_qty_remaining = 0;

            IF v_batch.stock >= v_qty_remaining THEN
                -- Kuantitas batch saat ini mencukupi untuk memenuhi sisa permintaan
                v_deducted_qty := v_qty_remaining;
                
                UPDATE public.medicine_batch
                SET stock = stock - v_deducted_qty
                WHERE id = v_batch.id;

                v_item_total := v_deducted_qty * v_price;
                v_subtotal := v_subtotal + v_item_total;

                INSERT INTO public.sales_transaction_item (
                    transaction_id, medicine_id, batch_id, quantity, price, total
                ) VALUES (
                    v_transaction_id, v_medicine_id, v_batch.id, v_deducted_qty, v_price, v_item_total
                );

                v_qty_remaining := 0;
            ELSE
                -- Kuantitas batch saat ini kurang, ambil semua stok dan lanjut ke batch berikutnya
                v_deducted_qty := v_batch.stock;
                
                UPDATE public.medicine_batch
                SET stock = 0
                WHERE id = v_batch.id;

                v_item_total := v_deducted_qty * v_price;
                v_subtotal := v_subtotal + v_item_total;

                INSERT INTO public.sales_transaction_item (
                    transaction_id, medicine_id, batch_id, quantity, price, total
                ) VALUES (
                    v_transaction_id, v_medicine_id, v_batch.id, v_deducted_qty, v_price, v_item_total
                );

                v_qty_remaining := v_qty_remaining - v_deducted_qty;
            END IF;
        END LOOP;

        -- Validasi akhir pengurasan stok
        IF v_qty_remaining > 0 THEN
            RAISE EXCEPTION 'Kegagalan sistem alokasi FEFO untuk obat ID %', v_medicine_id;
        END IF;
    END LOOP;

    -- Kalkulasi Pajak PPN (11%) & Total Bayar
    v_ppn := ROUND(v_subtotal * 0.11, 2);
    v_total_payment := v_subtotal + v_ppn;
    v_change := p_amount_paid - v_total_payment;

    -- Validasi nominal uang pembayaran
    IF v_change < 0 THEN
        RAISE EXCEPTION 'Uang pembayaran tidak mencukupi (Kekurangan: Rp %)', ABS(v_change);
    END IF;

    -- Perbarui informasi finansial transaksi utama
    UPDATE public.sales_transaction
    SET subtotal = v_subtotal,
        ppn = v_ppn,
        total_payment = v_total_payment,
        change_returned = v_change
    WHERE id = v_transaction_id;

    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. RPC Transaksi Pembelian / Pengadaan Obat Baru (Restock)
CREATE OR REPLACE FUNCTION public.restock_transaction(
    p_invoice_id TEXT,
    p_supplier_id TEXT,
    p_items JSONB -- Format: [{"medicine_id": "OBT-001", "quantity": 100, "purchase_price": 6000, "batch_code": "BCH-100", "expiry_date": "2028-12-01"}]
) RETURNS TEXT AS $$
DECLARE
    v_item JSONB;
    v_medicine_id TEXT;
    v_qty INTEGER;
    v_price NUMERIC(12,2);
    v_batch_code TEXT;
    v_expiry_date DATE;
    v_total_cost NUMERIC(12,2) := 0;
    v_user_id UUID;
    v_batch_id UUID;
BEGIN
    v_user_id := auth.uid();

    -- Validasi hak akses (Hanya Admin dan Apoteker yang boleh melakukan restock)
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = v_user_id AND role IN ('admin', 'apoteker')
    ) THEN
        RAISE EXCEPTION 'Akses ditolak: Hanya Admin dan Apoteker yang dapat melakukan restock obat.';
    END IF;

    -- Tambah pencatatan faktur pembelian utama
    INSERT INTO public.purchase_transaction (id, supplier_id, total_cost, created_by)
    VALUES (p_invoice_id, p_supplier_id, 0, v_user_id);

    -- Loop data item faktur masuk
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_medicine_id := v_item->>'medicine_id';
        v_qty := (v_item->>'quantity')::INTEGER;
        v_price := (v_item->>'purchase_price')::NUMERIC;
        v_batch_code := v_item->>'batch_code';
        v_expiry_date := (v_item->>'expiry_date')::DATE;

        -- Masukkan record item pengadaan detail
        INSERT INTO public.purchase_transaction_item (
            purchase_id, medicine_id, quantity, purchase_price, batch_code, expiry_date
        ) VALUES (
            p_invoice_id, v_medicine_id, v_qty, v_price, v_batch_code, v_expiry_date
        );

        -- Lacak / Update entri batch obat
        SELECT id INTO v_batch_id 
        FROM public.medicine_batch
        WHERE medicine_id = v_medicine_id AND batch_code = v_batch_code;

        -- Jika batch sudah ada, akumulasikan stok. Jika baru, buat record baru.
        IF FOUND THEN
            UPDATE public.medicine_batch
            SET stock = stock + v_qty,
                expiry_date = v_expiry_date
            WHERE id = v_batch_id;
        ELSE
            INSERT INTO public.medicine_batch (medicine_id, batch_code, expiry_date, stock, supplier_id)
            VALUES (v_medicine_id, v_batch_code, v_expiry_date, v_qty, p_supplier_id);
        END IF;

        v_total_cost := v_total_cost + (v_qty * v_price);
    END LOOP;

    -- Perbarui total pengeluaran faktur pembelian
    UPDATE public.purchase_transaction
    SET total_cost = v_total_cost
    WHERE id = p_invoice_id;

    RETURN p_invoice_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
