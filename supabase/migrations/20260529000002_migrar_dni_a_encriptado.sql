-- 1. Asegurar que pgcrypto esté habilitada en el esquema de extensiones de Supabase
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Asegurar que la columna de DNI encriptado exista
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS dni_encrypted BYTEA;

-- 3. Función helper para migrar los DNIs existentes a la columna encriptada
CREATE OR REPLACE FUNCTION migrate_user_dni_to_encrypted(
    p_encryption_key TEXT
) RETURNS void AS $$
BEGIN
    UPDATE public.users
    SET dni_encrypted = extensions.pgp_sym_encrypt(dni, p_encryption_key)
    WHERE dni IS NOT NULL
      AND dni <> ''
      AND dni_encrypted IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION migrate_user_dni_to_encrypted IS 'Copia los DNIs existentes desde el campo dni al campo dni_encrypted usando pgp_sym_encrypt, preservando el campo dni original.';

-- 4. Uso manual: ejecutar después de desplegar la migración con la clave secreta del servidor
-- SELECT migrate_user_dni_to_encrypted('<tu_clave_secreta>');
