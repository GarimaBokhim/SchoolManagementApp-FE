import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IUniversity } from "../types/IUniversity";

const UniversityEndPoints = {
  getAllUniversities: "/api/University/all-Universities",
  createUniversity: "/api/University/AddUniversity",
};

const queryKey = "Universities";

type UniversityRequest = {
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
      console.log("Add University (multipart)", formData);
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

export const useGetAllUniversities = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${UniversityEndPoints.getAllUniversities}${params}`
        : `${UniversityEndPoints.getAllUniversities}`;
      const response = await api.get<IPaginationResponse<IUniversity>>(url);
      return (
        response.data ?? {
          data: [],
          PageIndex: 0,
          isPagination: 1,
          pageSize: 10,
        }
      );
    },
  });
};