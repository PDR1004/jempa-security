import { getRegisteredUsers } from "@/app/lib/auth/registeredUsers";

export class DeleteStudentHandler {
    async handle(command: DeleteStudentCommand): Promise<DeleteStudentResponse> {
        const users = getRegisteredUsers();
        const userIndex = users.findIndex((u) => u.id === command.id);

        if (userIndex === -1) {
            throw new Error("Estudiante no encontrado");
        }

        // Eliminación física en memoria
        users.splice(userIndex, 1);

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
