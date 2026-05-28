-- Asignar una contraseña genérica encriptada a los usuarios antiguos
UPDATE public.users 
SET password_hash = extensions.crypt('Cambiame123!', extensions.gen_salt('bf')) 
WHERE password_hash IS NULL;