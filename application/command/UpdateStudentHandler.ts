import { findRegisteredUserByEmail, getRegisteredUsers } from "@/app/lib/auth/registeredUsers";

export class UpdateStudentHandler {
    async handle(command: UpdateStudentCommand): Promise<UpdateStudentResponse> {
        const users = getRegisteredUsers();
        const userIndex = users.findIndex((u) => u.id === command.id);

        if (userIndex === -1) {
            throw new Error("Estudiante no encontrado");
        }

        // Actualizamos en memoria (vuelve al estado original si el servidor reinicia)
        const user = users[userIndex];
        user.name = command.name;
        user.email = command.email;
        user.active = command.active;

        return {
            success: true,
            student: {
                id: user.id,
                name: user.name,
                email: user.email,
                active: user.active,
            },
        };
    }
}

export interface UpdateStudentCommand {
    id: number;
    name: string;
    email: string;
    active: boolean;
}

export interface UpdateStudentResponse {
    success: boolean;
    student: {
        id: number;
        name: string;
        email: string;
        active: boolean;
    };
}
