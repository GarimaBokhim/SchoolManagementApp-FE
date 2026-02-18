import { api } from '@/utils/instance';
import { ApiResponse, ConvertToApplicantPayload, UserProfileResponse } from '../types/leads';


export const leadService = {
  async fetchLeads() {
    const response = await api.get<ApiResponse>(`/api/Enrolments/FilterInquery`);
    return response.data;
  },

  async searchProfiles(query: string) {
    const response = await api.get<UserProfileResponse>(
      `/api/Enrolments/GetAllUserProfile?search=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  async convertToApplicant(data: ConvertToApplicantPayload) {
    const response = await api.post('/api/Enrolments/ConvertToApplicant', data);
    return response.data;
  }
};