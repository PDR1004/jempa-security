-- Agregar la columna para la contraseña de forma segura
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;