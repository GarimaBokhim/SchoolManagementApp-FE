import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddTrainingRegistrationPayload } from '../class/types/IClass'

export const useRegistrationMutations = (refetch: () => void) => {
  const handleAdd = async (payload: AddTrainingRegistrationPayload) => {
    try {
      await api.post('/api/Enrolments/AddTrainingRegistration', payload)
      Toast.success('Registration added successfully!')
      refetch()
    } catch {
      Toast.error('Error adding registration.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/Enrolments/TrainingRegistration/${id}`)
      Toast.success('Registration deleted successfully!')
      refetch()
    } catch {
      Toast.error('Error deleting registration.')
    }
  }

  const handleEdit = () => {
    Toast.info('Edit registration coming soon!')
  }

  return { handleAdd, handleDelete, handleEdit }
}