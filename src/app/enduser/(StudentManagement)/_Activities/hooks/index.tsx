import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationResponse } from '@/types/IPaginationResponse'
import {
  Activity,
  AddActivityPayload,
  AddParticipationPayload,
  IClass,
  Participation,
} from '../types/IActivities'

const ActivityEndPoints = {
  filterActivity: '/api/CocurricularActivities/FilterActivity',
  addActivity: '/api/CocurricularActivities/AddActivity',
  allActivities: '/api/CocurricularActivities/Activity',
  filterParticipation: '/api/CocurricularActivities/FilterParticipation',
  addParticipation: '/api/CocurricularActivities/AddParticipation',
  allClasses: '/api/Academics/all-SchoolClass',
}

const activityQueryKey = 'Activities'
const participationQueryKey = 'Participations'

// ── Activities ───────────────────────────────────────────────────

export const useFilterActivity = (params?: string) => {
  return useQuery({
    queryKey: [activityQueryKey, params],
    queryFn: async () => {
      const url = params
        ? `${ActivityEndPoints.filterActivity}${params}`
        : ActivityEndPoints.filterActivity
      const response = await api.get<IPaginationResponse<Activity>>(url)
      return response.data ?? {
        Items: [], TotalItems: 0, PageIndex: 1,
        pageSize: 10, TotalPages: 1, FirstPage: 1, LastPage: 1,
      }
    },
    staleTime: 0,
    retry: false,
  })
}

export const useAddActivity = () => {
  const queryClient = useQueryClient()
  return useMutation<Activity, Error, AddActivityPayload>({
    mutationFn: async (payload) => {
      const response = await api.post(ActivityEndPoints.addActivity, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [activityQueryKey] })
    },
    onError: (error) => {
      console.error('Error adding activity:', error)
    },
  })
}

export const useGetAllActivitiesDropdown = () => {
  return useQuery({
    queryKey: ['AllActivitiesDropdown'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<{ id: string; name: string }>>(
        ActivityEndPoints.allActivities
      )
      return response.data?.Items ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ── Participations ───────────────────────────────────────────────

export const useFilterParticipation = (params?: string) => {
  return useQuery({
    queryKey: [participationQueryKey, params],
    queryFn: async () => {
      const url = params
        ? `${ActivityEndPoints.filterParticipation}${params}`
        : ActivityEndPoints.filterParticipation
      const response = await api.get<IPaginationResponse<Participation>>(url)
      return response.data ?? {
        Items: [], TotalItems: 0, PageIndex: 1,
        pageSize: 10, TotalPages: 1, FirstPage: 1, LastPage: 1,
      }
    },
    staleTime: 0,
    retry: false,
  })
}

export const useAddParticipation = () => {
  const queryClient = useQueryClient()
  return useMutation<Participation, Error, AddParticipationPayload>({
    mutationFn: async (payload) => {
      const response = await api.post(ActivityEndPoints.addParticipation, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [participationQueryKey] })
    },
    onError: (error) => {
      console.error('Error adding participation:', error)
    },
  })
}

export const useGetAllStudents = () => {
  return useQuery({
    queryKey: ['AllStudents'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<{
        id: string
        firstName: string
        middleName: string
        lastName: string
      }>>('/api/Student/all-Students')
      return response.data?.Items ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useGetAllEvents = () => {
  return useQuery({
    queryKey: ['AllEvents'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<{ id: string; title: string }>>(
        '/api/Academics/GetAllEvents'
      )
      return response.data?.Items ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useGetAllClasses = (p0: string) => {
  return useQuery({
    queryKey: ['AllClasses'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IClass>>(
        ActivityEndPoints.allClasses
      )
      return response.data?.Items ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ── Update & Delete ───────────────────────────────────────────────
export const useUpdateActivity = () => {
  const queryClient = useQueryClient()
  return useMutation<Activity, Error, AddActivityPayload & { id: string }>({
    mutationFn: async (payload) => {
      const { id, ...body } = payload
      const response = await api.patch(
        `/api/CocurricularActivities/UpdateActivity/${id}`,
        { ...body, id }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [activityQueryKey] })
    },
    onError: (error) => {
      console.error('Error updating activity:', error)
    },
  })
}

export const useDeleteActivity = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(
        `/api/CocurricularActivities/DeleteActivity/${id}`
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [activityQueryKey] })
    },
    onError: (error) => {
      console.error('Error deleting activity:', error)
    },
  })
}