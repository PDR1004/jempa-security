-- 1. Habilitar las extensiones de seguridad
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgaudit;

-- 2. Configurar la auditoría forense (PGAudit)
-- PostgreSQL registrará automáticamente en sus logs internos cada SELECT/INSERT/UPDATE/DELETE/DDL
ALTER DATABASE postgres SET pgaudit.log = 'read, write, ddl, role';
ALTER DATABASE postgres SET pgaudit.log_catalog = 'off';
ALTER DATABASE postgres SET pgaudit.log_parameter = 'off';

-- 3. Función segura para REGISTRAR usuarios  (Encripta la contraseña al vuelo)
CREATE OR REPLACE FUNCTION register_user_secure(
    p_name TEXT, 
    p_email TEXT, 
    p_detail TEXT, 
    p_dni TEXT, 
    p_password TEXT, 
    p_role user_role DEFAULT 'student'
) RETURNS void AS $$
BEGIN
    INSERT INTO public.users (
        name, 
        email, 
        detail, 
        dni, 
        password_hash, 
        role
    )
    VALUES (
        p_name,
        p_email,
        p_detail,
        -- Encriptamos el DNI y la Contraseña usando Blowfish nativo
        crypt(p_dni, gen_salt('bf')),
        crypt(p_password, gen_salt('bf')),
        p_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Función segura para VERIFICAR el login (Compara hashes sin sacar los datos de la BD)
CREATE OR REPLACE FUNCTION verify_user_login(
    p_email TEXT,
    p_password TEXT
) RETURNS TABLE (email TEXT, role user_role, active BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT u.email, u.role, u.active
    FROM public.users u
    WHERE u.email = p_email
    -- La magia de pgcrypto: usa el propio hash guardado para extraer el salt y comparar
    AND u.password_hash = crypt(p_password, u.password_hash)
    AND u.active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;