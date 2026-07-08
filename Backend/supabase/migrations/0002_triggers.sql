-- 0002_triggers.sql
-- Trigger Database untuk Sinkronisasi Otomatis

-- 1. Fungsi Sinkronisasi Total Stok Obat Berdasarkan Batch Aktif (Belum Kedaluwarsa)
CREATE OR REPLACE FUNCTION public.fn_sync_medicine_stock()
RETURNS TRIGGER AS $$
DECLARE
    v_medicine_id TEXT;
BEGIN
    -- Menentukan ID Obat berdasarkan jenis operasi DML
    IF TG_OP = 'DELETE' THEN
        v_medicine_id := OLD.medicine_id;
    ELSE
        v_medicine_id := NEW.medicine_id;
    END IF;

    -- Hitung total stok dari seluruh batch aktif obat tersebut
    UPDATE public.medicine
    SET stock_total = COALESCE((
        SELECT SUM(stock)
        FROM public.medicine_batch
        WHERE medicine_id = v_medicine_id
          AND expiry_date > CURRENT_DATE
    ), 0)
    WHERE id = v_medicine_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Sinkronisasi Stok
CREATE OR REPLACE TRIGGER trg_sync_medicine_stock
AFTER INSERT OR UPDATE OR DELETE ON public.medicine_batch
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_medicine_stock();


-- 2. Fungsi Otomatis Pembuatan Profil Pengguna dari Auth Supabase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'kasir')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Pendaftaran User
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
