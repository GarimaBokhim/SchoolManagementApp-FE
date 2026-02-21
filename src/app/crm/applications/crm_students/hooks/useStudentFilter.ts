import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/utils/instance';
import { Toast } from '@/components/Toast/toast';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent';
import { FilterFormData, UserProfile, UserProfileResponse } from '../type/studnets';

export const useStudentFilters = (
  setParams: (params: string) => void,
  setPaginationParams: React.Dispatch<React.SetStateAction<{ pageSize: number; pageIndex: number; isPagination: boolean }>>
) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const dateFilterRef = useRef<DateRangeFilterRef | null>(null);
  const { handleError, clearError } = useErrorHandler();

  const filterForm = useForm<FilterFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      firstName: '',
    },
  });

  const handleFilterSubmit = async (formData: FilterFormData) => {
    clearError();
    try {
      const queryParams = [
        formData.firstName ? `firstName=${encodeURIComponent(formData.firstName)}` : null,
        formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
        formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
      ]
        .filter(Boolean)
        .join('&');

      const fullQuery = queryParams ? `&${queryParams}` : '';

      await toast.promise(
        (async () => {
          setParams(fullQuery);
          setPaginationParams((prev) => ({ ...prev, pageIndex: 1 }));
        })(),
        {
          loading: 'Fetching students...',
          success: 'Students fetched successfully!',
        }
      );
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
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
    Toast.success(`Filtering by ${profile.fullName}`);
  };

  const onClearClick = () => {
    setParams('');
    dateFilterRef.current?.handleClear();
    setSelectedProfile(undefined);
    filterForm.reset();
    setPaginationParams((prev) => ({ ...prev, pageIndex: 1 }));
    Toast.success('Filters cleared');
  };

  return {
    openFilter,
    setOpenFilter,
    filterForm,
    dateFilterRef,
    selectedProfile,
    searchResults,
    isSearching,
    handleFilterSubmit,
    fetchUsers,
    handleProfileSelected,
    onClearClick,
  };
};