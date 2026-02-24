import { useState } from 'react';
import { api } from '@/utils/instance';
import { Toast } from '@/components/Toast/toast';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import { Applicant, ConvertToStudentPayload } from '../types/IApplicants';

export const useApplicantMutations = (refetchApplicants: () => void) => {
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const handleDelete = async () => {
    try {
      // await api.delete(`/api/Enrolments/${_id}`);
      Toast.success('Applicant deleted successfully!');
      refetchApplicants();
    } catch {
      Toast.error('Error deleting applicant.');
    }
  };

  const handleConvert = async (selectedApplicant: Applicant, conversionData: ConvertToStudentPayload) => {
    try {
      setConvertingId(selectedApplicant.id);
      await api.post('/api/Enrolments/ConvertToStudents', conversionData);
      Toast.success(`Successfully converted to student!`);
      refetchApplicants();
      return true;
    } catch (error: unknown) {
      const errorMsg = handleError(error);
      Toast.error(`Error: ${errorMsg}`);
      return false;
    } finally {
      setConvertingId(null);
    }
  };

  const handleViewDetails = () => {
    Toast.info(`Viewing details for applicant`);
  };

  const handleEdit = () => {
    Toast.info(`Editing applicant`);
  };

  return {
    convertingId,
    handleDelete,
    handleConvert,
    handleViewDetails,
    handleEdit,
  };
};