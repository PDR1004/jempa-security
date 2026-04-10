# Secure Campus IA 🎓🤖

Bienvenido al repositorio de **Secure Campus IA**. Este proyecto es una aplicación web moderna desarrollada con Next.js que implementa una interfaz de chat con Inteligencia Artificial.

Está diseñada con un enfoque _mobile-first_ para que se sienta como una aplicación nativa (sin scroll global, solo en el área de mensajes) y cuenta con un diseño limpio utilizando Tailwind CSS.

---

## 🚀 Cómo empezar (Guía rápida)

### Requisitos previos

Asegúrate de tener instalado en tu computadora:

- Node.js (Se recomienda la versión 18 o superior).

### Instalación y ejecución

1. **Crea tu archivo de variables de entorno.** Copia `.env.example` a `.env.local` y completa:
   - `GROQ_API_KEY`
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `ADMIN_EMAILS`
   - `TEACHER_EMAILS`

2. **Instala las dependencias** del proyecto. Abre tu terminal en la carpeta raíz del proyecto y ejecuta:

   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo** localmente:

   ```bash
   npm run dev
   ```

4. **Abre la aplicación:** Ve a tu navegador y entra a http://localhost:3000. ¡Deberías ver la interfaz del chat!

### Seguridad inicial del chat

- La API key de Groq se lee desde `GROQ_API_KEY` y no está escrita en el código.
- El chat incluye un system prompt académico que limita la IA a temas universitarios.
- Si falta `GROQ_API_KEY`, la aplicación falla al arrancar para evitar ejecuciones inseguras.

### Autenticación OAuth/OIDC (NextAuth/Auth.js)

- Se integró Auth.js con proveedor Google (OIDC).
- Endpoint de autenticación: `/api/auth/[...nextauth]`.
- Sesión con estrategia JWT y rol calculado por email (`student`, `teacher`, `admin`).
- La vista de login está disponible en `/login`.

### Autorización por Rol (RBAC - Role-Based Access Control)

#### Punto 3a: Protección de API

- El endpoint `/api/chat` valida sesión y rol antes de llamar Groq.
- El endpoint `/api/student/list` solo permite `teacher` y `admin`.
- Retorna **401 (Unauthorized)** si no hay sesión, **403 (Forbidden)** si el rol no tiene permisos.
- Incluye headers de auditoría: `x-user-role` y `x-user-email`.

#### Punto 3b: Protección de Rutas con Middleware

- Archivo `middleware.ts` en la raíz valida sesión antes de acceder a `/students`.
- Los `student` son redirigidos a `/` automáticamente.
- Los no autenticados son redirigidos a `/login`.
- El Header oculta el enlace a "Estudiantes" para usuarios sin permisos.

#### Punto 3c: Protección a Nivel de Componente

- La página `/students` separa lógica de servidor (validación) de cliente (UI).
- Componente servidor `StudentsPage` rechaza acceso antes de renderizar.
- Componente cliente `StudentsPageClient` solo renderiza para usuarios autorizados.

**Matriz de Permisos:**
| Acción | Student | Teacher | Admin |
|--------|---------|---------|-------|
| POST /api/chat | ✅ | ✅ | ✅ |
| GET /api/student/list | ❌ | ✅ | ✅ |
| Acceso a /students | ❌ | ✅ | ✅ |
| Ver linkin "Estudiantes" | ❌ | ✅ | ✅ |

---

## 🛠️ Tecnologías Principales

- **Next.js (App Router):** El framework de React que usamos tanto para el frontend como para las rutas de API (backend ligero).
- **React:** Para construir la interfaz de usuario.
- **Tailwind CSS:** Para los estilos rápidos, responsivos y el soporte de "Modo Oscuro".
- **Zustand:** Para manejar el estado global de la aplicación (como guardar el historial de la conversación).

---

## 📂 Estructura clave para estudiantes

Si vas a modificar el código, estos son los archivos y carpetas más importantes que debes conocer:

- 🖥️ `app/page.tsx`: Es la pantalla principal. Aquí está el diseño del chat (el _Header_, el área de mensajes y el _Input_ para escribir).
- ⚙️ `app/api/chat/route.ts`: Es el "Backend" de nuestro chat. Esta ruta recibe los mensajes del usuario y es donde deberás conectar la lógica para que la Inteligencia Artificial devuelva una respuesta.
- 🧠 `app/store/conversation.ts`: Aquí se guarda la memoria de la conversación actual utilizando Zustand.
- 🪝 `app/hooks/useConversation.ts`: Contiene la lógica que conecta la interfaz gráfica (frontend) con la ruta de la API (backend).

> **Tip para el equipo:** Si necesitan modificar cómo se ven los mensajes, revisen `app/page.tsx`. Si necesitan cambiar qué responde la IA, revisen `app/api/chat/route.ts`.
