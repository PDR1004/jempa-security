import { NextRequest, NextResponse } from "next/server";
import {
  AddMessageHandler,
  AddMessageCommand,
} from "@/application/command/AddMessageHandler";
import { requireAuth, requireRole } from "@/app/lib/auth/authHelpers";

const addMessageCommandHandler = async (
  request: NextRequest,
): Promise<NextResponse> => {
  try {
    // 1. Validar sesión
    const authResult = await requireAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { session } = authResult;

    // 2. Validar que el rol tenga permiso para enviar mensajes de chat
    const canSendChat = requireRole(session.role, [
      "student",
      "teacher",
      "admin",
    ]);
    if (!canSendChat) {
      return NextResponse.json(
        { error: "Tu rol no tiene permiso para usar el chat." },
        { status: 403 },
      );
    }

    // 3. Procesar el mensaje de IA
    const handler = new AddMessageHandler();
    const command: AddMessageCommand = await request.json();
    const response = await handler.handle(command);

    // 4. Devolver respuesta con headers de auditoría
    return NextResponse.json(response, {
      headers: {
        "x-user-role": session.role,
        "x-user-email": session.email,
      },
    });
  } catch (error) {
    console.error("Error procesando el mensaje:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar la solicitud" },
      { status: 500 },
    );
  }
};

export const POST = addMessageCommandHandler;
