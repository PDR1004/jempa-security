import { getServerAuthSession } from "@/auth";
import { NextResponse } from "next/server";
import {
  GetStudentsListHandler,
  GetStudentsListQuery,
} from "@/application/query/GetStudentsListHandler";

const getStudentsListQueryHandler = async (): Promise<NextResponse> => {
  try {
    // Step 1: Validate authentication
    const session = await getServerAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión para continuar." },
        { status: 401 },
      );
    }

    // Step 2: Validate role (only teacher and admin)
    const role = session.user.role ?? "student";
    const isAuthorizedRole = role === "teacher" || role === "admin";
    if (!isAuthorizedRole) {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a este recurso." },
        {
          status: 403,
          headers: { "x-user-role": role, "x-user-email": session.user.email },
        },
      );
    }

    // Step 3: Process authorized request
    const handler = new GetStudentsListHandler();
    const query: GetStudentsListQuery = {};
    const response = await handler.handle(query);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error procesando la solicitud de estudiantes:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar la solicitud" },
      { status: 500 },
    );
  }
};

export const GET = getStudentsListQueryHandler;
