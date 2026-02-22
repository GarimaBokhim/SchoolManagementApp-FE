import { api } from '@/utils/instance';
import { UserProfile } from '../types';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const response = await api.get<UserProfile>(`/api/Enrolments/UserProfile/${userId}`);
    return response.data;
  } catch {
    return null;
  }
};