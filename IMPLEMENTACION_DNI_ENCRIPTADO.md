# 🔐 Guía de Implementación - Encriptación del DNI en Supabase

## Resumen de Cambios

Se ha implementado un sistema de **encriptación simétrica (AES-256)** del DNI en Supabase usando `pgcrypto`. El DNI se encripta en la base de datos y se desencripta en el backend cuando es necesario.

---

## 📋 Pasos de Implementación

### Paso 1: Ejecutar la Migración en Supabase

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npx supabase db push
```

Esto ejecutará la migración `20260529000001_agregar_dni_encriptado_users.sql` que:
- ✅ Agrega la columna `dni_encrypted` (BYTEA) a la tabla `users`
- ✅ Crea la función RPC `update_user_dni_secure()` para encriptar al guardar
- ✅ Crea la función RPC `get_user_dni_secure()` para desencriptar al leer

Además, se creó la migración `20260529000002_migrar_dni_a_encriptado.sql`, que agrega una función helper para copiar los valores actuales del campo `dni` al nuevo campo `dni_encrypted` sin eliminar el valor original.

> Nota: la migración crea el helper, pero para ejecutar la copia de datos existentes necesitas llamar a la función con tu clave secreta una vez que la variable `DNI_ENCRYPTION_KEY` esté configurada.

### Paso 2: Configurar la Variable de Entorno

En tu archivo `.env.local` (o `.env` en desarrollo), agrega:

```env
DNI_ENCRYPTION_KEY=tu_clave_secreta_muy_fuerte_aqui_minimo_32_caracteres
```

**⚠️ IMPORTANTE en Producción:**
- Genera una clave criptográficamente segura (mínimo 32 caracteres)
- Usa herramientas como: `openssl rand -base64 32`
- Guarda la clave de forma segura (variables de entorno protegidas)
- NUNCA la publiques en repositorios

Ejemplo de clave segura:
```bash
openssl rand -base64 32
# Salida: aB4cD+eF/gH2iJ3kL4mN5oP6qR7sT8uV9wX0yZ1aB2c=
```

### Paso 3: Verificar el Funcionamiento

El flujo ahora es:

1. **Editar DNI**: 
   ```
   Cliente → API /api/student/update → Backend llama RPC update_user_dni_secure()
   → Supabase encripta y guarda dni_encrypted → ✅ Listo
   ```

2. **Ver DNI**:
   ```
   Cliente → API /api/student/{id}/dni → Backend llama RPC get_user_dni_secure()
   → Supabase desencripta y devuelve → Cliente muestra 5 segundos
   ```

---

## 🔧 Código Generado

### Migración SQL
- **Archivo**: `supabase/migrations/20260529000001_agregar_dni_encriptado_users.sql`
- **Cambios**: Agrega funciones RPC y columna `dni_encrypted`

### Backend TypeScript
- **Archivo**: `app/lib/auth/registeredUsers.ts`
  - Nueva función: `getDecryptedUserDni(id)` - obtiene DNI desencriptado
  - Modificada: `updateRegisteredUser()` - usa RPC para encriptar

- **Archivo**: `app/api/student/[studentId]/dni/route.ts`
  - Modificada: endpoint GET para desencriptar al responder

- **Archivo**: `envConfig.ts`
  - Validación de `DNI_ENCRYPTION_KEY` al iniciar

---

## 🔐 Cómo Funciona la Encriptación

### Al Guardar DNI (Editar Perfil)
```typescript
// 1. El frontend envía el DNI en texto plano
// 2. Backend recibe y llama la RPC:
await supabaseAdmin.rpc("update_user_dni_secure", {
  p_user_id: 123,
  p_dni: "12345678",
  p_encryption_key: process.env.DNI_ENCRYPTION_KEY
});

// 3. Supabase encripta en la BD:
UPDATE users SET dni_encrypted = pgp_sym_encrypt('12345678', 'clave_secreta')
```

### Al Leer DNI (Ver Perfil)
```typescript
// 1. Frontend pide ver DNI (con permisos)
// 2. Backend llama la RPC:
const dniDesencriptado = await supabaseAdmin.rpc("get_user_dni_secure", {
  p_user_id: 123,
  p_encryption_key: process.env.DNI_ENCRYPTION_KEY
});

// 3. Supabase desencripta:
SELECT pgp_sym_decrypt(dni_encrypted, 'clave_secreta')

// 4. Backend devuelve DNI desencriptado temporalmente (5 segundos)
```

---

## ⚠️ Consideraciones de Seguridad

| Aspecto | ✅ Implementado | 📝 Nota |
|--------|---|---|
| Encriptación en BD | Sí | AES-256 via pgcrypto |
| Clave secreta | Sí | En variables de entorno |
| Funciones RPC | Sí | Con `SECURITY DEFINER` |
| Validación de permisos | Sí | `validatePermission("view:student_dni")` |
| Lectura temporal (5s) | Sí | En frontend (DniViewer.tsx) |
| Auditoría de accesos | ⚠️ | Considerar PGAudit en producción |

---

## 🧪 Testing

### Verificar que la migración se aplicó:

```sql
-- En Supabase SQL Editor
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name LIKE 'dni%';

-- Debe mostrar:
-- | dni | text |
-- | dni_encrypted | bytea |
```

### Verificar que las funciones RPC existen:

```sql
-- En Supabase SQL Editor
SELECT proname FROM pg_proc WHERE proname LIKE '%dni_secure%';

-- Debe mostrar:
-- | update_user_dni_secure |
-- | get_user_dni_secure |
```

---

## 🚀 Próximos Pasos

1. **Migrar datos existentes** (si los hay):
   - Opción A: Que los usuarios re-editen su DNI
   - Opción B: Usar la función helper `migrate_user_dni_to_encrypted()` creada en la migración `20260529000002_migrar_dni_a_encriptado.sql`

   Ejemplo de ejecución con clave secreta:
   ```sql
   SELECT migrate_user_dni_to_encrypted('<tu_clave_secreta>');
   ```

2. **Producción**:
   - Generar clave fuerte con: `openssl rand -base64 32`
   - Guardar en Secrets Manager (AWS, Azure, etc.)
   - Actualizar `DNI_ENCRYPTION_KEY` en el servidor

3. **Auditoría** (recomendado):
   - Habilitar PGAudit en Supabase para registrar accesos a datos sensibles

---

## 📚 Referencias

- [pgcrypto - PostgreSQL Documentation](https://www.postgresql.org/docs/current/pgcrypto.html)
- [Supabase RPC Guide](https://supabase.com/docs/guides/database/functions)
- [SECURITY DEFINER Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)
