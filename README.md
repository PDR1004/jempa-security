# Secure Campus IA 🎓🤖

Secure Campus IA es una aplicación web moderna construida con Next.js, diseñada para proporcionar una interfaz de chat segura e inteligente para consultas académicas y universitarias. Enfatiza un enfoque "mobile-first" (prioridad móvil) para brindar una experiencia similar a una aplicación nativa y presenta un diseño limpio impulsado por Tailwind CSS.

## 🚀 Resumen del Proyecto

Esta aplicación aprovecha la Inteligencia Artificial (IA) para ayudar a los usuarios con sus consultas académicas, al mismo tiempo que aplica sólidas medidas de seguridad a través del control de acceso basado en roles y una autenticación segura. La interfaz está diseñada para ser intuitiva y fácil de usar, imitando la experiencia de una aplicación de chat.

--- 

## ✨ Características

*   **Chat impulsado por IA:** Participa en conversaciones con un asistente de IA capaz de responder preguntas académicas y relacionadas con la universidad.
*   **Control de Acceso Basado en Roles (RBAC):** Acceso y permisos diferenciados según los roles de usuario (Estudiante, Profesor, Administrador).
*   **Autenticación Segura:** Autenticación OAuth/OIDC con Google a través de NextAuth.js, asegurando que solo los usuarios autorizados puedan acceder al sistema.
*   **Diseño Mobile-First:** Optimizado para dispositivos móviles, brindando una experiencia fluida sin necesidad de desplazamiento (scroll) global.
*   **Gestión de Variables de Entorno:** Manejo seguro de credenciales confidenciales a través de variables de entorno.
*   **Gestión de Datos en Tiempo Real:** Utiliza Zustand para una gestión eficiente del estado global, particularmente para el historial de conversaciones y los datos de los estudiantes.
*   **Manejo Seguro de Datos:** Implementa cifrado para datos confidenciales como el DNI (Documento Nacional de Identidad).
*   **Seguridad en la API:** Protege los endpoints de la API mediante verificaciones de autenticación y autorización.

--- 

## 🛠️ Tecnologías

*   **Frontend:** Next.js (App Router), React, Tailwind CSS
*   **Backend:** Next.js API Routes, Node.js
*   **Integración de IA:** Groq SDK
*   **Base de Datos:** Supabase
*   **Autenticación:** NextAuth.js (Auth.js)
*   **Gestión de Estado:** Zustand
*   **Lenguaje:** TypeScript

--- 

## 📋 Tabla de Contenidos

*   [Resumen del Proyecto](#-resumen-del-proyecto)
*   [Características](#-características)
*   [Tecnologías](#-tecnologías)
*   [Instalación](#-instalación)
*   [Uso](#-uso)
*   [Estructura del Proyecto](#-estructura-del-proyecto)
*   [Referencia de la API](#-referencia-de-la-api)
*   [Contribución](#-contribución)
*   [Licencia](#-licencia)
*   [Enlaces Importantes](#-enlaces-importantes)
*   [Pie de página](#-pie-de-página)

--- 

## 🚀 Instalación

### Prerrequisitos

*   Node.js (Se recomienda v18 o superior)

### Pasos

1.  **Configurar variables de entorno:**
    Copia el archivo `.env.example` a `.env.local` y completa lo siguiente:
    *   `GROQ_API_KEY`: Tu clave API de Groq.
    *   `AUTH_SECRET`: Un secreto robusto para NextAuth.js (usa uno seguro en producción).
    *   `AUTH_GOOGLE_ID`: Client ID de Google OAuth.
    *   `AUTH_GOOGLE_SECRET`: Client Secret de Google OAuth.
    *   `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto de Supabase.
    *   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Clave pública de Supabase.
    *   `SUPABASE_SERVICE_ROLE_KEY`: Clave de rol de servicio de Supabase (para operaciones del lado del servidor).
    *   `NEXTAUTH_URL`: La URL de tu aplicación (ej. `http://localhost:3000`).
    *   `DNI_ENCRYPTION_KEY`: Una clave de cifrado robusta para los datos del DNI.

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Abrir la aplicación:**
    Navega a `http://localhost:3000` en tu navegador.

--- 

## 💡 Uso

### Autenticación

*   Accede a la aplicación a través de `http://localhost:3000`.
*   Serás redirigido a la página de inicio de sesión (`/login`).
*   Haz clic en **"Continuar con Google"** para autenticarte usando tu cuenta institucional de Google.
*   Solo se concederá acceso a las direcciones de correo electrónico registradas y marcadas como `active: true` en la tabla `users` de Supabase.

### Chat de IA

*   Después de iniciar sesión, navega a la página **/chat**.
*   Escribe tus preguntas académicas o relacionadas con la universidad en el campo de entrada y presiona Enter o haz clic en el botón de enviar.
*   El asistente de IA responderá basándose en su prompt de sistema, el cual lo restringe a temas académicos.
*   El historial del chat se gestiona mediante Zustand y se guarda localmente.

### Gestión de Estudiantes (Para Profesores y Administradores)

*   Los usuarios con roles de `teacher` (profesor) o `admin` (administrador) pueden acceder a la página **/students**.
*   **Ver Estudiantes:** Ve una lista de todos los estudiantes, sus correos electrónicos y su estado.
*   **Editar Estudiantes:** Modifica los detalles del estudiante, incluyendo nombre, correo electrónico, estado activo, detalles y DNI (para roles autorizados).
*   **Ver DNI del Estudiante:** Los administradores pueden ver el DNI de un estudiante después de una breve revelación (se muestra temporalmente).
*   **Eliminar Estudiantes:** Los administradores pueden eliminar registros de estudiantes.

### Permisos Basados en Roles

*   **Estudiantes (Students):** Pueden usar el chat de IA y ver datos académicos.
*   **Profesores (Teachers):** Pueden usar el chat de IA, ver datos académicos y gestionar la lista de estudiantes.
*   **Administradores (Admins):** Tienen acceso completo, incluyendo la gestión de estudiantes, visualización de DNIs y acceso a todas las características.

--- 

## 📁 Estructura del Proyecto

```
secure-campus-ia/
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts
│   │   │   ├── student/
│   │   │   │   ├── [studentId]/
│   │   │   │   │   └── dni/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── delete/
│   │   │   │   │     └── route.ts
│   │   │   │   ├── list/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── update/
│   │   │   │   │     └── route.ts
│   │   ├── components/
│   │   ├── store/
│   │   │   ├── conversation/
│   │   │   │     ├── index.ts
│   │   │   │     └── types.ts
│   │   │   └── students/
│   │   │       ├── index.ts
│   │   │       ├── types.ts
│   │   ├── providers.tsx
│   │   ├── Header.tsx
│   │   ├── chat/
│   │   │     └── page.tsx
│   │   ├── icon.tsx
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │     ├── LoginContent.tsx
│   │   │     └── page.tsx
│   │   ├── page.tsx
│   │   ├── students/
│   │   │     ├── client.tsx
│   │   │     ├── DniViewer.tsx
│   │   │     ├── StudentDetailEditor.tsx
│   │   │     └── page.tsx
│   │   ├── utils/
│   │   │     └── sanitize.ts
│   ├── auth.ts
│   ├── envConfig.ts
│   ├── hooks/
│   │   ├── useConversation.ts
│   │   └── useStudents.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth/
│   │   │   ├── authHelpers.ts
│   │   │   ├── permissions.ts
│   │   │   ├── registeredUsers.ts
│   │   │   └── roleResolver.ts
│   │   ├── clients/
│   │   │   ├── useChatApi.ts
│   │   │   └── useStudentApi.ts
│   │   ├── security/
│   │   │     └── systemPrompt.ts
│   │   └── supabase/
│   │       └── server.ts
│   ├── application/
│   │   ├── command/
│   │   │   ├── AddMessageHandler.ts
│   │   │   ├── DeleteStudentHandler.ts
│   │   │   └── UpdateStudentHandler.ts
│   │   └── query/
│   │       └── GetStudentsListHandler.ts
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 20260523000941_crear_usuarios_registrados.sql
│   │   ├── 20260528184213_fix_politicas_rls.sql
│   │   ├── 20260528190000_add_student_detail.sql
│   │   ├── 20260528200000_add_student_dni.sql
│   │   ├── 20260528200415_add_student_password.sql
│   │   ├── 20260528201148_implementar_crypto_audit.sql
│   │   ├── 20260528204222_asignar_passwords_nulos.sql
│   │   ├── 20260529000001_agregar_dni_encriptado_users.sql
│   │   └── 20260529000002_migrar_dni_a_encriptado.sql
├── types/
│   └── next-auth.d.ts
└── middleware.ts
```

--- 

## 📚 Referencia de la API

### API de Chat

*   **`POST /api/chat`**
    *   Envía un mensaje al asistente de IA.
    *   Requiere autenticación.
    *   **Cuerpo de la Petición (Request Body):** `{ "message": "string" }`
    *   **Respuesta (Response):** `{ "message": "string" }`

### API de Gestión de Estudiantes

*   **`GET /api/student/list`**
    *   Obtiene una lista de todos los estudiantes.
    *   Requiere rol de `teacher` o `admin`.
    *   **Respuesta (Response):** `{ "list": [Student] }`

*   **`POST /api/student/update`**
    *   Actualiza los detalles de un estudiante existente.
    *   Requiere rol de `teacher` o `admin`.
    *   **Cuerpo de la Petición (Request Body):** Objeto `Student`.

*   **`POST /api/student/delete`**
    *   Elimina el registro de un estudiante por su ID.
    *   Requiere rol de `admin`.
    *   **Cuerpo de la Petición (Request Body):** `{ "id": number }`

*   **`GET /api/student/:studentId/dni`**
    *   Obtiene el DNI descifrado de un estudiante en específico.
    *   Requiere rol de `admin` (permiso `view:student_dni`).
    *   **Respuesta (Response):** `{ "dni": "string" }`

--- 

## 🤝 Contribución

¡Las contribuciones son bienvenidas! No dudes en enviar un Pull Request o abrir un Issue.

1.  Haz un Fork del repositorio.
2.  Crea una nueva rama (`git checkout -b feature/tu-nombre-de-caracteristica`).
3.  Realiza tus cambios.
4.  Haz commit de tus cambios (`git commit -m 'Añadir alguna caracteristica'`).
5.  Haz push a tu rama (`git push origin feature/tu-nombre-de-caracteristica`).
6.  Abre un Pull Request.

--- 

## 📄 Licencia

Este proyecto es de código abierto, pero no se encontró ninguna licencia específica en el repositorio. Por favor, consulta el archivo de licencia del proyecto si está disponible, o contacta a los mantenedores para mayor aclaración.

--- 

## 🔗 Enlaces Importantes

*   **Repositorio:** [jempa-security](https://github.com/PDR1004/jempa-security)

--- 

## 🌐 Pie de página

© 2026 Secure Campus IA. Todos los derechos reservados.

Este proyecto es mantenido por [PDR1004](https://github.com/PDR1004).

¡No dudes en dejar una **estrella** ⭐, hacer un **fork** 🍴, y **contribuir** a este proyecto!

---
**<p align="center">Generado por [ReadmeCodeGen](https://www.readmecodegen.com/)</p>**
