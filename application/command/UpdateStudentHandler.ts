import {
  findRegisteredUserById,
  updateRegisteredUser,
} from "@/app/lib/auth/registeredUsers";

export class UpdateStudentHandler {
  async handle(command: UpdateStudentCommand): Promise<UpdateStudentResponse> {
    const user = await findRegisteredUserById(command.id);

    if (!user) {
      throw new Error("Estudiante no encontrado");
    }

    const updated = await updateRegisteredUser(command.id, {
      name: command.name,
      email: command.email,
      active: command.active,
      detail: command.detail,
      dni: command.dni,
    });

    return {
      success: true,
      student: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        active: updated.active,
        detail: updated.detail,
        dni: updated.dni,
      },
    };
  }
}

export interface UpdateStudentCommand {
  id: number;
  name: string;
  email: string;
  active: boolean;
  detail?: string;
  dni?: string;
}

export interface UpdateStudentResponse {
  success: boolean;
  student: {
    id: number;
    name: string;
    email: string;
    active: boolean;
    detail?: string;
    dni?: string;
  };
}
