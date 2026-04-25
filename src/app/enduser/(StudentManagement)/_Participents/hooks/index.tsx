import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'

const participationQueryKey = 'Participations'

const ParticipationEndPoints = {
  updateParticipation: '/api/CocurricularActivities/UpdateParticipation',
  deleteParticipation: '/api/CocurricularActivities/DeleteParticipation',
}

export interface UpdateParticipationPayload {
  id: string
  studentId: string
  activityId: string
  awardPosition: number
  certificateTitle: string
  certificateContent: string
}

export const useUpdateParticipation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateParticipationPayload) => {
      const { id, ...body } = payload
      const response = await api.patch(
        `${ParticipationEndPoints.updateParticipation}/${id}`, // ✅ id in path
        { ...body, id }                                        // ✅ id in body too (same pattern as activity)
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [participationQueryKey] })
    },
    onError: (error) => {
      console.error('Error updating participation:', error)
    },
  })
}

export const useDeleteParticipation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(
        `${ParticipationEndPoints.deleteParticipation}/${id}` // ✅ id in path
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [participationQueryKey] })
    },
    onError: (error) => {
      console.error('Error deleting participation:', error)
    },
  })
}