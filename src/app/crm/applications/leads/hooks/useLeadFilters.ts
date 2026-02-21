import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FilterFormData, UserProfile, UserProfileResponse } from '../types';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';

export const useLeadFilters = (
  setParams: (params: string) => void,
  setPaginationParams: (updater: (prev: any) => any) => void
) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const filterForm = useForm<FilterFormData>({
    defaultValues: {
      startDate: "",
      endDate: "",
      firstName: "",
    },
  });

  const handleFilterSubmit = async (formData: FilterFormData) => {
    try {
      const queryParams = [
        formData.firstName ? `firstName=${encodeURIComponent(formData.firstName)}` : null,
        formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
        formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
      ]
        .filter(Boolean)
        .join("&");

      const fullQuery = queryParams ? `&${queryParams}` : "";

      await toast.promise(
        (async () => {
          setParams(fullQuery);
          setPaginationParams((prev: any) => ({ ...prev, pageIndex: 1 }));
        })(),
        {
          loading: "Fetching leads...",
          success: "Leads fetched successfully!",
        }
      );
    } catch (error) {
      console.error("Error during filter submission:", error);
    }
  };

  const fetchUsers = async (search: string = "") => {
    setIsSearching(true);
    try {
      const response = await api.get<UserProfileResponse>(
        `/api/Enrolments/GetAllUserProfile?search=${encodeURIComponent(search)}`
      );
      if (response.data?.Items) {
        setSearchResults(response.data.Items);
      }
    } catch (error) {
      toast.error('Failed to search profiles');
    } finally {
      setIsSearching(false);
    }
  };

  // ✅ Fixed: now actually triggers the filter after selecting a profile
  const handleProfileSelected = (profile: UserProfile | null) => {
    if (!profile) return;
    setSelectedProfile(profile);
    filterForm.setValue('firstName', profile.fullName);
    handleFilterSubmit(filterForm.getValues());
  };

  const onClearClick = () => {
    setParams("");
    setSelectedProfile(undefined);
    filterForm.reset();
    setPaginationParams((prev: any) => ({ ...prev, pageIndex: 1 }));
    toast.success('Filters cleared');
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