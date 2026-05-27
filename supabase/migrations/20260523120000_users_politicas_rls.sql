-- Sin estas políticas, la anon/publishable key no ve filas (SELECT → []) y NextAuth devuelve AccessDenied.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_for_login" ON public.users;
CREATE POLICY "users_select_for_login"
ON public.users
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "users_write_for_backend" ON public.users;
CREATE POLICY "users_write_for_backend"
ON public.users
FOR INSERT, UPDATE, DELETE
TO anon, authenticated
USING (true)
WITH CHECK (true);
