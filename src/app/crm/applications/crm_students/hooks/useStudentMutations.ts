import { api } from '@/utils/instance';
import { Toast } from '@/components/Toast/toast';
import { Student } from '../type/studnets';

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

  const handleEdit = (student: Student) => {
    // Wire up your edit modal/logic here
    Toast.info(`Editing student`);
  };

  return {
    handleDelete,
    handleEdit,
  };
};