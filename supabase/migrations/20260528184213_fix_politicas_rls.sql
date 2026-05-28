-- 1. Asegurarnos de que RLS esté activo
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. ELIMINAR las políticas peligrosas que permitían acceso público
DROP POLICY IF EXISTS "users_select_for_login" ON public.users;
DROP POLICY IF EXISTS "users_write_for_backend" ON public.users;

-- 3. CREAR la política definitiva y segura
-- Nadie en el frontend (anon) ni usuarios comunes pueden interactuar con la tabla directamente.
-- Solo el servidor backend (Service Role) tiene acceso total.
CREATE POLICY "Acceso exclusivo para el Backend" 
ON public.users 
FOR ALL 
USING (auth.role() = 'service_role');