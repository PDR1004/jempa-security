-- 1. Asegurar que pgcrypto esté habilitada en el esquema de extensiones de Supabase
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Agregar la columna para el DNI encriptado (Debe ser tipo BYTEA para guardar datos binarios)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS dni_encrypted BYTEA;

-- 3. Función segura (RPC) para EDITAR el DNI de un usuario
-- Esta función recibe el ID del usuario, el DNI en texto plano y la clave secreta
CREATE OR REPLACE FUNCTION update_user_dni_secure(
    p_user_id INTEGER,
    p_dni TEXT,
    p_encryption_key TEXT
) RETURNS void AS $$
BEGIN
    UPDATE public.users
    SET dni_encrypted = extensions.pgp_sym_encrypt(p_dni, p_encryption_key)
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FUNCIÓN EXTRA: Helper para desencriptar el DNI cuando el servidor lo necesite consultar
CREATE OR REPLACE FUNCTION get_user_dni_secure(
    p_user_id INTEGER,
    p_encryption_key TEXT
) RETURNS TEXT AS $$
DECLARE
    v_dni TEXT;
BEGIN
    SELECT extensions.pgp_sym_decrypt(dni_encrypted, p_encryption_key)
    INTO v_dni
    FROM public.users
    WHERE id = p_user_id;
    
    RETURN v_dni;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Comentarios de documentación técnica para auditoría
COMMENT ON COLUMN public.users.dni_encrypted IS 'DNI del usuario encriptado simétricamente con AES-256 vía pgcrypto.';
COMMENT ON FUNCTION update_user_dni_secure IS 'Encapsula la encriptación del DNI en el motor de base de datos durante la edición.';
COMMENT ON FUNCTION get_user_dni_secure IS 'Desencripta el DNI del usuario para consultas en el servidor.';
