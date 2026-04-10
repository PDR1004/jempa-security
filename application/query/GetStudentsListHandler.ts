import { getRegisteredUsers } from "@/app/lib/auth/registeredUsers";

export class GetStudentsListHandler {
  async handle(
    command: GetStudentsListQuery,
  ): Promise<GetStudentsListResponse> {
    const response = getRegisteredUsers()
      .filter((user) => user.role === "student")
      .map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        active: student.active,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // orden alfabetico

    return { list: response };
  }
}

export interface GetStudentsListQuery {}

export interface GetStudentsListResponse {
  list: Student[];
}

export interface Student {
  id: number;
  name: string;
  email: string;
  active: boolean;
}
