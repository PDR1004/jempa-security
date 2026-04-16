import { useCallback } from 'react'
import { useStudentsStore } from '@/app/store/students'
import { useStudentApi } from '@/app/lib/clients/useStudentApi'

export const useStudents = () => {
  
    const { setStudents } = useStudentsStore()
    const { getStudentsList, updateStudent: apiUpdateStudent, deleteStudent: apiDeleteStudent } = useStudentApi()

    const fetchStudents = useCallback(async () => {
        const response = await getStudentsList()
        setStudents(response.list)
    }, [getStudentsList, setStudents])

    const updateStudent = useCallback(async (student: any) => {
        await apiUpdateStudent(student)
        await fetchStudents() // Recargamos la lista tras la edición
    }, [apiUpdateStudent, fetchStudents])

    const removeStudent = useCallback(async (id: number) => {
        await apiDeleteStudent(id)
        await fetchStudents() // Recargamos la lista
    }, [apiDeleteStudent, fetchStudents])

    return {
        fetchStudents,
        updateStudent,
        removeStudent
    }
}