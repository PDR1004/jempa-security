-- 1. Tipo ENUM para roles
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- 2. Tabla de usuarios registrados
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Seed: mismos usuarios que la app (ids fijos para compatibilidad con la UI)
INSERT INTO users (id, name, email, role, active) VALUES
(1, 'Pablo Racigh', 'pablodanielracigh@gmail.com', 'student', true),
(2, 'Mateo Nunez', 'mateenunez@gmail.com', 'student', true),
(3, 'Aaron Tournoud', 'atournoudfrcu@gmail.com', 'admin', true),
(4, 'Ezequiel Martino', 'ezee.martino23@gmail.com', 'teacher', true),
(5, 'Luis Fernandez', 'luis.fernandez@example.com', 'teacher', true),
(6, 'Juan Cruz', 'juanmartincruzrap@gmail.com', 'student', true),
(7, 'Diego Torres', 'pepito123utn@gmail.com', 'admin', true),
(8, 'Valentina Ruiz', 'valentina.ruiz@example.com', 'teacher', true),
(9, 'Pedro Sanchez', 'pedro.sanchez@example.com', 'teacher', true),
(10, 'Lucia Herrera', 'lucia.herrera@example.com', 'student', true),
(11, 'Miguel Castro', 'miguel.castro@example.com', 'student', true),
(12, 'Camila Ortiz', 'camila.ortiz@example.com', 'student', true),
(13, 'Jorge Diaz', 'jorge.diaz@example.com', 'student', true),
(14, 'Paula Morales', 'paula.morales@example.com', 'student', true),
(15, 'Andres Vega', 'andres.vega@example.com', 'student', true);

SELECT setval(
    pg_get_serial_sequence('users', 'id'),
    (SELECT COALESCE(MAX(id), 1) FROM users)
);
