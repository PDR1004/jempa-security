import { NextResponse } from "next/server";
import { validatePermission } from "@/app/lib/auth/authHelpers";
import { UpdateStudentHandler } from "@/application/command/UpdateStudentHandler";


export async function POST(req: Request) {
    try {
        // 1. Seguridad: Verificar permiso de edición
        await validatePermission("edit:students");

        // 2. Obtener datos del body
        const body = await req.json();
        const { id, name, email, active, detail, dni } = body;

        if (!id || !name || !email) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        // 3. Ejecutar comando
        const handler = new UpdateStudentHandler();
        const result = await handler.handle({
            id,
            name,
            email,
            active,
            detail,
            dni,
        });

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error("Error en API update student:", error);
        const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
        const isPermissionError = errorMessage === "No tienes permiso para realizar esta acción";
        return NextResponse.json(
            { error: errorMessage, message: errorMessage },
            { status: isPermissionError ? 403 : 500 }
        );
    }
}
