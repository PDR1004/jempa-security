import { NextResponse } from "next/server";
import { validatePermission } from "@/app/lib/auth/authHelpers";
import { findRegisteredUserById } from "@/app/lib/auth/registeredUsers";

export async function GET(
  req: Request,
  context: { params: Promise<{ studentId: string }> },
) {
  try {
    await validatePermission("view:student_dni");

    const { studentId } = await context.params;
    const studentIdNumber = Number(studentId);
    if (Number.isNaN(studentId)) {
      return NextResponse.json(
        { error: "ID de estudiante inválido" },
        { status: 400 },
      );
    }

    const student = await findRegisteredUserById(studentIdNumber);
    if (!student || student.role !== "student") {
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ dni: student.dni ?? null });
  } catch (error: unknown) {
    console.error("Error en API DNI estudiante:", error);
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    const isPermissionError = message === "No tienes permiso para realizar esta acción";
    return NextResponse.json(
      { error: message },
      { status: isPermissionError ? 403 : 500 },
    );
  }
}
