// src/api/university/index.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IUniversity } from "../types/IUniversity";

export const UniversityEndPoints = {
  getAllUniversities: "/api/AcademicPrograms/FilterUniversity",
  createUniversity: "/api/University/AddUniversity",
};

export const queryKey = "Universities";

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

export const useGetAllUniversities = () => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IUniversity>>(
        UniversityEndPoints.getAllUniversities
      );
      
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