/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import { ConvertToApplicantPayload, Lead } from '../types/ILeads';

export const useLeadMutations = (refetchLeads: () => void) => {
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  const handleDelete = async (_id: string) => {
    try {
      // await api.delete(`/api/Enrolments/${_id}`);
      toast.success('Lead deleted successfully!');
      refetchLeads();
    } catch {
      toast.error('Error deleting lead.');
    }
  };

  const handleConvert = async (selectedLead: Lead, conversionData: ConvertToApplicantPayload) => {
    try {
      setConvertingId(selectedLead.id);
      await api.post('/api/Enrolments/ConvertToApplicant', conversionData);
      toast.success(`Successfully converted ${selectedLead.name} to applicant!`);
      refetchLeads();
      return true;
    } catch (error: any) {
      const errorMsg = handleError(error);
      toast.error(`Error: ${errorMsg}`);
      return false;
    } finally {
      setConvertingId(null);
    }
  };

  return {
    convertingId,
    handleDelete,
    handleConvert,
  };
};