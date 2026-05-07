import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationResponse } from '@/types/IPaginationResponse'
import { AddConsultancyClassPayload, AddTrainingRegistrationPayload, ConsultancyClass, TrainingRegistration } from '../types/IClass'
import { Toast } from '@/components/Toast/toast'


export const ClassEndPoints = {
  filterClasses: '/api/Enrolments/FilterConsultancyClasss',
  addClass: '/api/Enrolments/AddConsultancyClass',
  allClasses: '/api/Enrolments/AllConsultancyClasss',
  filterRegistrations: '/api/Enrolments/FilterTrainingRegistration',
  addRegistration: '/api/Enrolments/AddTrainingRegistration',
}

export const classQueryKey = 'ConsultancyClasses'
export const registrationQueryKey = 'TrainingRegistrations'

// ── Consultancy Classes ──────────────────────────────────────────

export const useGetAllConsultancyClasses = (queryParams?: string) => {
  return useQuery({
    queryKey: [classQueryKey, queryParams],
    queryFn: async () => {
      const paramObj: Record<string, string> = {}
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ''))
        parsed.forEach((value, key) => { paramObj[key] = value })
      }
      const response = await api.get<IPaginationResponse<ConsultancyClass>>(
        ClassEndPoints.filterClasses,
        { params: paramObj }
      )
      return response.data ?? {
        Items: [], TotalItems: 0, PageIndex: 1,
        pageSize: 10, TotalPages: 1, FirstPage: 1, LastPage: 1,
      }
    },
  })
}

export const useAddConsultancyClass = () => {
  const queryClient = useQueryClient()
  return useMutation<ConsultancyClass, Error, AddConsultancyClassPayload>({
    mutationFn: async (payload) => {
      const response = await api.post(ClassEndPoints.addClass, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classQueryKey] })
    },
  })
}

export const useGetAllClassesDropdown = () => {
  return useQuery({
    queryKey: ['AllConsultancyClassesDropdown'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<{ id: string; name: string }>>(
        ClassEndPoints.allClasses
      )
      return response.data?.Items ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ── Training Registrations ───────────────────────────────────────

export const useGetAllTrainingRegistrations = (queryParams?: string) => {
  return useQuery({
    queryKey: [registrationQueryKey, queryParams],
    queryFn: async () => {
      const paramObj: Record<string, string> = {}
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ''))
        parsed.forEach((value, key) => { paramObj[key] = value })
      }
      const response = await api.get<IPaginationResponse<TrainingRegistration>>(
        ClassEndPoints.filterRegistrations,
        { params: paramObj }
      )
      return response.data ?? {
        Items: [], TotalItems: 0, PageIndex: 1,
        pageSize: 10, TotalPages: 1, FirstPage: 1, LastPage: 1,
      }
    },
  })
}

export const useAddTrainingRegistration = () => {
  const queryClient = useQueryClient()
  return useMutation<TrainingRegistration, Error, AddTrainingRegistrationPayload>({
    mutationFn: async (payload) => {
      const response = await api.post(ClassEndPoints.addRegistration, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [registrationQueryKey] })
    },
  })
}
export const useGetAllApplicants = () => {
  return useQuery({
    queryKey: ['AllApplicants'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<{ id: string; fullName: string }>>(
        '/api/Enrolments/AllApplicant'
      )
      return response.data?.Items ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}
export const useClassMutations = (refetch: () => void) => {
  const handleAdd = async (payload: AddConsultancyClassPayload) => {
    try {
      await api.post('/api/Enrolments/AddConsultancyClass', payload)
      Toast.success('Class added successfully!')
      refetch()
    } catch {
      Toast.error('Error adding class.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/Enrolments/ConsultancyClass/${id}`)
      Toast.success('Class deleted successfully!')
      refetch()
    } catch {
      Toast.error('Error deleting class.')
    }
  }

  const handleEdit = () => {
    Toast.info('Edit class coming soon!')
  }

  return { handleAdd, handleDelete, handleEdit }
}