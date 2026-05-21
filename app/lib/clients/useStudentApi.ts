'use client'
import { useCallback } from 'react'

import { api } from '@/app/lib/api'
import { GetStudentsListResponse } from '@/application/query/GetStudentsListHandler'
import { Student } from '@/app/store/students'

const BASE_URL = '/api/student/list'

export const useStudentApi = () => {
    const getStudentsList = useCallback(async (): Promise<GetStudentsListResponse> => {
        return api.get<GetStudentsListResponse>(BASE_URL)
    }, [])

    const updateStudent = useCallback(async (data: Student) => {
        return api.post('/api/student/update', data)
    }, [])

    const deleteStudent = useCallback(async (id: number) => {
        return api.post('/api/student/delete', { id })
    }, [])

    return {
        getStudentsList,
        updateStudent,
        deleteStudent
    }
}