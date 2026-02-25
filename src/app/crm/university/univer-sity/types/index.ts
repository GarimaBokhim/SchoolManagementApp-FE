import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IUniversity } from "./IUniversity";

export const UniversityEndPoints = {
  getAllUniversities: "/api/AcademicPrograms/FilterUniversity",
  createUniversity: "/api/University/AddUniversity",
};

export const queryKey = "Universities";

export type UniversityRequest = {
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  establishedDate: Date;
  provinceId: number;
  districtId: number;
  municipalityId: number | 0;
  wardNumber?: number | null;
  universityImg: File;
};

export const useAddUniversity = () => {
  const queryClient = useQueryClient();

  return useMutation<IUniversity, Error, FormData>({
    mutationFn: async (formData: FormData): Promise<IUniversity> => {
      const response = await api.post(
        UniversityEndPoints.createUniversity,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {
      console.error("Error adding university:", error);
    },
  });
};

// Updated to accept an object parameter
export const useGetAllUniversities = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      let url = UniversityEndPoints.getAllUniversities;
      
      // Build query string from params object
      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        
        // Add all params to query string
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
        
        const queryString = queryParams.toString();
        if (queryString) {
          url = `${url}?${queryString}`;
        }
      }
      
      const response = await api.get<IPaginationResponse<IUniversity>>(url);
      
      // Handle the response structure from your API
      return response.data ?? {
        Items: [],
        TotalItems: 0,
        PageIndex: 1,
        pageSize: 10,
        TotalPages: 1,
        FirstPage: 1,
        LastPage: 1
      };
    },
  });
};