import { api } from '@/utils/instance';
import { Toast } from '@/components/Toast/toast';
import { AddCounselorPayload } from '../types/ICounselor';

export const useCounselorMutations = (refetch: () => void) => {
  const handleAdd = async (payload: AddCounselorPayload) => {
    try {
      await api.post('/api/Enrolments/AddCounselor', payload);
      Toast.success('Counselor added successfully!');
      refetch();
    } catch {
      Toast.error('Error adding counselor.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/Enrolments/Counselor/${id}`);
      Toast.success('Counselor deleted successfully!');
      refetch();
    } catch {
      Toast.error('Error deleting counselor.');
    }
  };

  const handleEdit = () => {
    Toast.info('Edit counselor coming soon!');
  };

  return { handleAdd, handleDelete, handleEdit };
};