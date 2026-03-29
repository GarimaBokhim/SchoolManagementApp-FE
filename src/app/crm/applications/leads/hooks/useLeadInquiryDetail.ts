// src/app/crm/applications/leads/hooks/useLeadEnquiryDetails.ts

import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/instance';

export interface LeadEnquiryUniversity {
  universityId: string;
  CourseIds: string[];
}

export interface LeadEnquiryCountry {
  countryId: string;
  Universities: LeadEnquiryUniversity[];
}

export interface LeadEnquiryDetails {
  Countries: LeadEnquiryCountry[];
}

export const useLeadEnquiryDetails = (leadId: string | null) => {
  return useQuery({
    queryKey: ['LeadEnquiryDetails', leadId],
    queryFn: async () => {
      const response = await api.get<LeadEnquiryDetails>(
        `/api/Enrolments/ShowLeadEnqueryDetails?leadId=${leadId}`
      );
      return response.data;
    },
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000,
  });
};