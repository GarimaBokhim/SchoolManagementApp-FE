import { api } from '@/utils/instance';
import { Toast } from '@/components/Toast/toast';

export const useStudentMutations = (fetchStudents: () => void) => {
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/Enrolments/${id}`);
      Toast.success('Student deleted successfully!');
      fetchStudents();
    } catch {
      Toast.error('Error deleting student.');
    }
  };

  const handleEdit = () => {
    Toast.info(`Editing student`);
  };

  return {
    handleDelete,
    handleEdit,
  };
};