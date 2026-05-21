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
        const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
        const isPermissionError = errorMessage === "No tienes permiso para realizar esta acción";
        return NextResponse.json(
            { error: errorMessage },
            { status: isPermissionError ? 403 : 500 }
        );
    }
}
