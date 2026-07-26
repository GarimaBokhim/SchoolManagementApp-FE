import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationResponse } from '@/types/IPaginationResponse'
import { IExamResult, IExamUpdateResult, IMarkSheet } from '../types/IExamResults'

const ExamResultEndPoints = {
  getAllExamResults: '/api/Academics/all-examResult',
  createExamResults: '/api/Academics/AddExamResult',
  removeExamResults: '/api/Academics/DeleteExamResult',
  updateExamResults: '/api/Academics/UpdateExamResult',
  getExamResultsById: '/api/Academics/ExamResult',
  generateMarkSheet: '/api/Academics/MarkSheet',
  filterExamResultByDate: '/api/Academics/FilterExamResult',
  AttendenceCount: '/api/Student/AttendanceCount',
}

const queryKey = 'ExamResults'
const filteredExamResultQuery = 'FilteredExamResults'

type ExamResultRequest = {
  examId: string
  studentId: string
  remarks?: string
  marksObtained: {
    subjectId: string
    prMarksObtaineds: number
    thMarksObtaineds: number
    fullMarks: number
  }[]
}

export const useAddExamResult = () => {
  const queryClient = useQueryClient()
  return useMutation<IExamResult, Error, ExamResultRequest>({
    mutationFn: async (data: ExamResultRequest): Promise<IExamResult> => {
      const transformedData = {
        examId: data.examId,
        studentId: data.studentId,
        remarks: data.remarks,
        marksObtained: data.marksObtained.map(item => ({
          subjectId: item.subjectId,
          prMarksObtaineds: item.prMarksObtaineds,
          thMarksObtaineds: item.thMarksObtaineds,
          fullMarks: item.fullMarks
        }))
      }

      console.log('Add ExamResult', transformedData)
      const response = await api.post(
        ExamResultEndPoints.createExamResults,
        transformedData
      )

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      queryClient.invalidateQueries({ queryKey: [filteredExamResultQuery] })
    },
    onError: (error) => {
      console.error('Error adding ExamResult:', error)
    },
  })
}

export const useRemoveExamResult = () => {
  const queryClient = useQueryClient()
  return useMutation<IExamResult, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IExamResult> => {
      if (!Id) {
        throw new Error('Id is required to remove a ExamResult')
      }
      const response = await api.delete(
        `${ExamResultEndPoints.removeExamResults}/${Id}`
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      queryClient.invalidateQueries({ queryKey: [filteredExamResultQuery] })
    },
  })
}

export const useEditExamResult = () => {
  const queryClient = useQueryClient()
  return useMutation<
    IExamResult,
    Error,
    { id: string | unknown; data: ExamResultRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IExamResult> => {
      if (!id) {
        throw new Error('Id is required to edit ExamResult')
      }

      const transformedData = {
        examId: data.examId,
        studentId: data.studentId,
        remarks: data.remarks,
        marksObtained: data.marksObtained.map(item => ({
          subjectId: item.subjectId,
          prMarksObtaineds: item.prMarksObtaineds,
          thMarksObtaineds: item.thMarksObtaineds,
          fullMarks: item.fullMarks
        }))
      }

      const response = await api.patch(
        `${ExamResultEndPoints.updateExamResults}/${id}`,
        transformedData
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filteredExamResultQuery] })
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })
}

export const useGetExamResultById = (ExamResultId: string) => {
  return useQuery({
    queryKey: [queryKey, ExamResultId],
    queryFn: async (): Promise<IExamUpdateResult> => {
      if (!ExamResultId) {
        throw new Error('Id is required to get a ExamResult')
      }
      const response = await api.get<IExamUpdateResult>(
        `${ExamResultEndPoints.getExamResultsById}/${ExamResultId}`
      )

      const raw = response.data
      return {
        ...raw,
        marksObtained: (raw.marksObtained ?? []).map((item: any) => ({
          subjectId: item.subjectId,
          practicalMarks: item.practicalMarks ?? item.prMarksObtaineds ?? 0,
          theoreticalMarks: item.theoreticalMarks ?? item.thMarksObtaineds ?? 0,
          fullMarks: item.fullMarks ?? 0,
        })),
      }
    },
    enabled: !!ExamResultId,
    staleTime: 0,
    retry: false,
  })
}

export const useGetAllExamResults = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${ExamResultEndPoints.getAllExamResults}${params}`
        : `${ExamResultEndPoints.getAllExamResults}`
      const response = await api.get<IPaginationResponse<IExamResult>>(url)
      return (
        response.data ?? {
          data: [],
          PageIndex: 0,
          isPagination: 1,
          pageSize: 10,
        }
      )
    },
  })
}

export const useFilterExamResultByDate = (params?: string) => {
  return useQuery({
    queryKey: [filteredExamResultQuery, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${ExamResultEndPoints.filterExamResultByDate}${params}`
        : ExamResultEndPoints.filterExamResultByDate
      const response = await api.get<IPaginationResponse<IExamResult>>(url)
      return response.data
    },
    staleTime: 0,
    retry: false,
  })
}

export const useGenerateMarkSheet = (studentId: string, examId: string) => {
  return useQuery({
    queryKey: [queryKey, studentId],
    queryFn: async (): Promise<IMarkSheet> => {
      if (!studentId) {
        throw new Error('Id is required to get a IssuedCertificate')
      }
      const response = await api.get<IMarkSheet>(
        `${ExamResultEndPoints.generateMarkSheet}?studentId=${studentId}&examId=${examId}`
      )
      return response.data
    },
    enabled: !!studentId,
    staleTime: 0,
    retry: false,
  })
}