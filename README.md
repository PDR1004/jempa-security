# Secure Campus IA 🎓🤖

Secure Campus IA is a modern web application built with Next.js, designed to provide a secure and intelligent chat interface for academic and university-related queries. It emphasizes a mobile-first approach for a native app-like experience and features a clean design powered by Tailwind CSS.

## 🚀 Project Overview

This application leverages AI to assist users with academic inquiries, while enforcing robust security measures through role-based access control and secure authentication. The interface is designed to be intuitive and user-friendly, mimicking a chat application experience.

--- 

## ✨ Features

*   **AI-Powered Chat:** Engage in conversations with an AI assistant capable of answering academic and university-related questions.
*   **Role-Based Access Control (RBAC):** Differentiated access and permissions based on user roles (Student, Teacher, Admin).
*   **Secure Authentication:** OAuth/OIDC authentication with Google via NextAuth.js, ensuring only authorized users can access the system.
*   **Mobile-First Design:** Optimized for mobile devices, providing a seamless experience without global scrolling.
*   **Environment Variable Management:** Secure handling of sensitive credentials through environment variables.
*   **Real-time Data Management:** Utilizes Zustand for efficient global state management, particularly for conversation history and student data.
*   **Secure Data Handling:** Implements encryption for sensitive data like DNI (National Identity Document).
*   **API Security:** Protects API endpoints with authentication and authorization checks.

--- 

## 🛠️ Tech Stack

*   **Frontend:** Next.js (App Router), React, Tailwind CSS
*   **Backend:** Next.js API Routes, Node.js
*   **AI Integration:** Groq SDK
*   **Database:** Supabase
*   **Authentication:** NextAuth.js (Auth.js)
*   **State Management:** Zustand
*   **Language:** TypeScript

--- 

## 📋 Table of Contents

*   [Project Overview](#-project-overview)
*   [Features](#-features)
*   [Tech Stack](#-tech-stack)
*   [Installation](#-installation)
*   [Usage](#-usage)
*   [Project Structure](#-project-structure)
*   [API Reference](#-api-reference)
*   [Contributing](#-contributing)
*   [License](#-license)
*   [Important Links](#-important-links)
*   [Footer](#-footer)

--- 

## 🚀 Installation

### Prerequisites

*   Node.js (v18 or higher recommended)

### Steps

1.  **Set up environment variables:**
    Copy the `.env.example` file to `.env.local` and fill in the following:
    *   `GROQ_API_KEY`: Your Groq API key.
    *   `AUTH_SECRET`: A strong secret for NextAuth.js (use a secure one in production).
    *   `AUTH_GOOGLE_ID`: Google OAuth Client ID.
    *   `AUTH_GOOGLE_SECRET`: Google OAuth Client Secret.
    *   `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
    *   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase public key.
    *   `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for server-side operations).
    *   `NEXTAUTH_URL`: The URL of your application (e.g., `http://localhost:3000`).
    *   `DNI_ENCRYPTION_KEY`: A strong encryption key for DNI data.

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the application:**
    Navigate to `http://localhost:3000` in your browser.

--- 

## 💡 Usage

### Authentication

*   Access the application via `http://localhost:3000`.
*   You will be directed to the login page (`/login`).
*   Click on **"Continue with Google"** to authenticate using your institutional Google account.
*   Only email addresses registered and marked as `active: true` in the Supabase `users` table will be granted access.

### AI Chat

*   After logging in, navigate to the **/chat** page.
*   Type your academic or university-related questions in the input field and press Enter or click the send button.
*   The AI assistant will respond based on its system prompt, which confines it to academic topics.
*   The chat history is managed using Zustand and persisted locally.

### Student Management (For Teachers and Admins)

*   Users with `teacher` or `admin` roles can access the **/students** page.
*   **View Students:** See a list of all students, their emails, and their status.
*   **Edit Students:** Modify student details, including name, email, active status, details, and DNI (for authorized roles).
*   **View Student DNI:** Admins can view a student's DNI after a brief reveal (temporarily shown).
*   **Delete Students:** Admins can delete student records.

### Role-Based Permissions

*   **Students:** Can use the AI chat and view academic data.
*   **Teachers:** Can use the AI chat, view academic data, and manage the student list.
*   **Admins:** Have full access, including managing students, viewing DNIs, and accessing all features.

--- 

## 📁 Project Structure

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

## 📚 API Reference

### Chat API

*   **`POST /api/chat`**
    *   Sends a message to the AI assistant.
    *   Requires authentication.
    *   **Request Body:** `{ "message": "string" }`
    *   **Response:** `{ "message": "string" }`

### Student Management API

*   **`GET /api/student/list`**
    *   Retrieves a list of all students.
    *   Requires `teacher` or `admin` role.
    *   **Response:** `{ "list": [Student] }`

*   **`POST /api/student/update`**
    *   Updates an existing student's details.
    *   Requires `teacher` or `admin` role.
    *   **Request Body:** `Student` object.

*   **`POST /api/student/delete`**
    *   Deletes a student record by ID.
    *   Requires `admin` role.
    *   **Request Body:** `{ "id": number }`

*   **`GET /api/student/:studentId/dni`**
    *   Retrieves the decrypted DNI for a specific student.
    *   Requires `admin` role (`view:student_dni` permission).
    *   **Response:** `{ "dni": "string" }`

--- 

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

--- 

## 📄 License

This project is open source, but no specific license was found in the repository. Please refer to the project's license file if available, or contact the maintainers for clarification.

--- 

## 🔗 Important Links

*   **Repository:** [jempa-security](https://github.com/PDR1004/jempa-security)

--- 

## 🌐 Footer

© 2026 Secure Campus IA. All rights reserved.

This project is maintained by [PDR1004](https://github.com/PDR1004).

Feel free to **star** ⭐, **fork** 🍴, and **contribute** to this project!


---
**<p align="center">Generated by [ReadmeCodeGen](https://www.readmecodegen.com/)</p>**