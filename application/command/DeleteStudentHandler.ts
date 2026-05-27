import {
  deleteRegisteredUser,
  findRegisteredUserById,
} from "@/app/lib/auth/registeredUsers";

export class DeleteStudentHandler {
  async handle(command: DeleteStudentCommand): Promise<DeleteStudentResponse> {
    const user = await findRegisteredUserById(command.id);

    if (!user) {
      throw new Error("Estudiante no encontrado");
    }

    await deleteRegisteredUser(command.id);

    return {
      success: true,
      message: "Estudiante eliminado correctamente",
    };
  }
}

export interface DeleteStudentCommand {
  id: number;
}

export interface DeleteStudentResponse {
  success: boolean;
  message: string;
}
