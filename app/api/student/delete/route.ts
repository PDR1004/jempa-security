import { NextResponse } from "next/server";
import { validatePermission } from "@/app/lib/auth/authHelpers";
import { DeleteStudentHandler } from "@/application/command/DeleteStudentHandler";

export async function POST(req: Request) {
    try {
        // 1. Seguridad: Verificar permiso de eliminación
        await validatePermission("delete:students");

        // 2. Obtener datos del body
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { error: "El ID del estudiante es obligatorio" },
                { status: 400 }
            );
        }

        // 3. Ejecutar comando
        const handler = new DeleteStudentHandler();
        const result = await handler.handle({ id });

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error("Error en API delete student:", error);
        return NextResponse.json(
            { error: error.message || "Error interno del servidor" },
            { status: error.message === "No tienes permiso para realizar esta acción" ? 403 : 500 }
        );
    }
}
