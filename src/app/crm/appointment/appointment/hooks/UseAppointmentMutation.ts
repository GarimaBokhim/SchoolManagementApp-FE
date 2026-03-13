import { api } from '@/utils/instance';
import { Toast } from '@/components/Toast/toast';
import { AddAppointmentPayload } from '../types/IAppointment';


export const useAppointmentMutations = (refetch: () => void) => {
  const handleAdd = async (payload: AddAppointmentPayload) => {
    try {
      await api.post('/api/Enrolments/AddAppointment', payload);
      Toast.success('Appointment added successfully!');
      refetch();
    } catch {
      Toast.error('Error adding appointment.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/Enrolments/Appointment/${id}`);
      Toast.success('Appointment deleted successfully!');
      refetch();
    } catch {
      Toast.error('Error deleting appointment.');
    }
  };

  const handleEdit = () => {
    Toast.info('Edit appointment coming soon!');
  };

  return { handleAdd, handleDelete, handleEdit };
};