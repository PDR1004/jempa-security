const HARDCODED_LIST = [
    { id: 1, name: 'Pablo Racigh', email: 'pablodanielracigh@gmail.com', active: true },
    { id: 2, name: 'Mateo Nuñez', email: 'mateenunez@gmail.com', active: true },
    { id: 3, name: 'Aaron Tournoud ', email: 'carlos.lopez@example.com', active: true },
    { id: 4, name: 'Ezequiel Martino', email: 'ana.martinez@example.com', active: true },
    { id: 5, name: 'Luis Fernández', email: 'luis.fernandez@example.com', active: true },
    { id: 6, name: 'Sofía Ramírez', email: 'sofia.ramirez@example.com', active: true },
    { id: 7, name: 'Diego Torres', email: 'diego.torres@example.com', active: true },
    { id: 8, name: 'Valentina Ruiz', email: 'valentina.ruiz@example.com', active: true },
    { id: 9, name: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', active: true },
    { id: 10, name: 'Lucía Herrera', email: 'lucia.herrera@example.com', active: true },
    { id: 11, name: 'Miguel Castro', email: 'miguel.castro@example.com', active: true },
    { id: 12, name: 'Camila Ortiz', email: 'camila.ortiz@example.com', active: true },
    { id: 13, name: 'Jorge Díaz', email: 'jorge.diaz@example.com', active: true },
    { id: 14, name: 'Paula Morales', email: 'paula.morales@example.com', active: true },
    { id: 15, name: 'Andrés Vega', email: 'andres.vega@example.com', active: true },
];

export class GetStudentsListHandler {

    async handle(command: GetStudentsListQuery): Promise<GetStudentsListResponse> {
        const response = HARDCODED_LIST.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email,
            active: student.active,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)) // orden alfabetico

        return { list: response }
    }
}

export interface GetStudentsListQuery {
}

export interface GetStudentsListResponse {
    list: Student[]
}

export interface Student {
    id: number
    name: string
    email: string
    active: boolean
}