import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FilterFormData, Lead, UserProfile, UserProfileResponse } from '../types';
import { api } from '@/utils/instance';
import toast from 'react-hot-toast';

export const useLeadFilters = (
  setParams: (params: string) => void,
  setPaginationParams: (updater: (prev: any) => any) => void,
  setSingleLead: (lead: Lead | null) => void  // ✅ new
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

  // ✅ On profile select: build a single Lead from UserProfile and display it directly
  const handleProfileSelected = async (profile: UserProfile | null) => {
    if (!profile) return;
    setSelectedProfile(profile);
    filterForm.setValue('firstName', profile.fullName);

    try {
      // Fetch enrolmentType for the selected user
      let enrolmentType = profile.enrolmentType ?? 0;
      try {
        const res = await api.get(`/api/Enrolments/UserProfile/${profile.id}`);
        enrolmentType = res.data?.enrolmentType ?? enrolmentType;
      } catch {
        // fallback to profile.enrolmentType
      }

      const singleLead: Lead = {
        id: profile.id,
        userId: profile.id,
        name: profile.fullName || 'N/A',
        email: profile.email || 'N/A',
        phone: profile.contactNumber || 'N/A',
        source: profile.source || 'website',
        educationLevel: 0,
        completionYear: 'N/A',
        enrolmentType,
      };

      setSingleLead(singleLead); // ✅ directly inject into table
    } catch (error) {
      toast.error('Failed to load user details');
    }
  };

  const onClearClick = () => {
    setParams("");
    setSelectedProfile(undefined);
    setSingleLead(null); // ✅ clear single lead override
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