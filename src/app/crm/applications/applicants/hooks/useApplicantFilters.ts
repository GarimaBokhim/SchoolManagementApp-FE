import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/utils/instance';
import { Toast } from '@/components/Toast/toast';
import { FilterFormData, UserProfile, UserProfileResponse, SearchParam } from '../types/IApplicants';

export const useApplicantFilters = (
  setParams: (params: string) => void,
  setPaginationParams: (updater: (prev: SearchParam) => SearchParam) => void
) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const filterForm = useForm<FilterFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      firstName: '',
    },
  });

  const handleFilterSubmit = (formData: FilterFormData) => {
    const queryParams = [
      formData.firstName ? `firstName=${encodeURIComponent(formData.firstName)}` : null,
      formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
      formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
    ]
      .filter(Boolean)
      .join('&');

    const fullQuery = queryParams ? `&${queryParams}` : '';

    setParams(fullQuery);
    setPaginationParams((prev: SearchParam) => ({ ...prev, pageIndex: 1 }));
  };

  const fetchUsers = async (search: string = '') => {
    setIsSearching(true);
    try {
      const response = await api.get<UserProfileResponse>(
        `/api/Enrolments/GetAllUserProfile?search=${encodeURIComponent(search)}`
      );
      if (response.data?.Items) {
        setSearchResults(response.data.Items);
      }
    } catch {
      Toast.error('Failed to search profiles');
    } finally {
      setIsSearching(false);
    }
  };

  const handleProfileSelected = (profile: UserProfile | null) => {
    if (!profile) return;
    setSelectedProfile(profile);
    filterForm.setValue('firstName', profile.fullName);
    handleFilterSubmit(filterForm.getValues());
  };

  const onClearClick = () => {
    setParams('');
    setSelectedProfile(undefined);
    filterForm.reset();
    setPaginationParams((prev: SearchParam) => ({ ...prev, pageIndex: 1 }));
    Toast.success('Filters cleared');
  };

  return {
    openFilter,
    setOpenFilter,
    filterForm,
    selectedProfile,
    setSelectedProfile,
    searchResults,
    isSearching,
    handleFilterSubmit,
    fetchUsers,
    handleProfileSelected,
    onClearClick,
  };
};