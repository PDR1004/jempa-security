'use client'
import { useCallback } from 'react'

import { api } from '@/app/lib/api'
import { GetStudentsListResponse } from '@/application/query/GetStudentsListHandler'

const BASE_URL = '/api/student/list'

export const useStudentApi = () => {
    const getStudentsList = useCallback(async (): Promise<GetStudentsListResponse> => {
        return api.get<GetStudentsListResponse>(BASE_URL)
    }, [])

    const updateStudent = useCallback(async (data: any): Promise<any> => {
        return api.post('/api/student/update', data)
    }, [])

    const deleteStudent = useCallback(async (id: number): Promise<any> => {
        return api.post('/api/student/delete', { id })
    }, [])

    return {
        getStudentsList,
        updateStudent,
        deleteStudent
    }
}