import { NextResponse } from "next/server";
import { validatePermission } from "@/app/lib/auth/authHelpers";
import { UpdateStudentHandler } from "@/application/command/UpdateStudentHandler";


export async function POST(req: Request) {
    try {
        // 1. Seguridad: Verificar permiso de edición
        await validatePermission("edit:students");

        // 2. Obtener datos del body
        const body = await req.json();
        const { id, name, email, active } = body;

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
        });

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error("Error en API update student:", error);
        return NextResponse.json(
            { error: error.message || "Error interno del servidor" },
            { status: error.message === "No tienes permiso para realizar esta acción" ? 403 : 500 }
        );
    }
}
