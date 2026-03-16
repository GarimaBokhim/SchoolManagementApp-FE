import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddConsultancyClassPayload } from '../class/types/IClass'

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