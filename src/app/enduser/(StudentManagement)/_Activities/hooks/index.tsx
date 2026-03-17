import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationResponse } from '@/types/IPaginationResponse'
import { Activity, AddActivityPayload, AddParticipationPayload, Participation } from '../types/IActivities'


const ActivityEndPoints = {
  filterActivity: '/api/CocurricularActivities/FilterActivity',
  addActivity: '/api/CocurricularActivities/AddActivity',
  allActivities: '/api/CocurricularActivities/Activity',
  filterParticipation: '/api/CocurricularActivities/FilterParticipation',
  addParticipation: '/api/CocurricularActivities/AddParticipation',
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