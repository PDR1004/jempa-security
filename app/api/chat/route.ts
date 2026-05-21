import { NextRequest, NextResponse } from "next/server";
import {
  AddMessageHandler,
  AddMessageCommand,
} from "@/application/command/AddMessageHandler";
import { requireAuth, requireRole } from "@/app/lib/auth/authHelpers";
import { detectInjection } from "@/app/utils/sanitize";

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

    // 3. Validar la entrada del mensaje
    const command: AddMessageCommand = await request.json();

    if (!command?.message || typeof command.message !== "string") {
      return NextResponse.json(
        { error: "Input inválido" },
        { status: 400 },
      );
    }

    if (command.message.length > 500) {
      return NextResponse.json(
        { error: "Consulta demasiado larga" },
        { status: 400 },
      );
    }

    if (detectInjection(command.message)) {
      console.warn("Intento sospechoso de inyección detectado", {
        route: "/api/chat",
        user: session.email,
        role: session.role,
        message: command.message,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: "Consulta no permitida" },
        { status: 400 },
      );
    }

    // 4. Procesar el mensaje de IA
    const handler = new AddMessageHandler();
    const response = await handler.handle(command);

    // 5. Devolver respuesta con headers de auditoría
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
