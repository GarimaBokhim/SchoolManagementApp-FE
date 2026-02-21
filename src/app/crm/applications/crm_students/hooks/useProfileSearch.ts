import { useState, useCallback } from 'react';
import { api } from '@/utils/instance';
import { Toast } from '@/components/Toast/toast';
import { UserProfile, UserProfileResponse } from '../type/studnets';

export const useProfileSearch = () => {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchUsers = useCallback(async (search: string = "") => {
    setIsSearching(true);
    try {
      const response = await api.get<UserProfileResponse>(
        `/api/Enrolments/GetAllUserProfile?search=${encodeURIComponent(search)}`
      );
      if (response.data?.Items) {
        setSearchResults(response.data.Items);
      }
    } catch (error) {
      Toast.error('Failed to search profiles');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleProfileSelected = useCallback((
    profile: UserProfile | null,
    callback?: (profile: UserProfile) => void
  ) => {
    if (!profile) return;
    
    setSelectedProfile(profile);
    if (callback) {
      callback(profile);
    }
  }, []);

  return {
    selectedProfile,
    searchResults,
    isSearching,
    fetchUsers,
    handleProfileSelected,
    setSelectedProfile,
  };
};