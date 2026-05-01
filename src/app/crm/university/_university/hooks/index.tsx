// src/api/university/index.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IUniversity } from "../types/IUniversity";
import { ICountry } from "../types/ICountry";
import { IIntake, IVisaStatusResponse } from "../../intake/types/IIntakes";


export const UniversityEndPoints = {
  getAllUniversities: "/api/AcademicPrograms/FilterUniversity",
  createUniversity: "/api/University/AddUniversity",
  getAllCountries: "/api/AcademicPrograms/GetAllCountry",
  getUniversities: "/api/AcademicPrograms/University",
};

export const queryKey = "Universities";
const countryQueryKey = "Countries";
const universityQueryKey = "UniversityList";

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

export const useGetAllUniversities = (queryParams?: string) => {
  return useQuery({
    queryKey: [queryKey, queryParams],
    queryFn: async () => {
      const paramObj: Record<string, string> = {};
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ""));
        parsed.forEach((value, key) => {
          paramObj[key] = value;
        });
      }

      const response = await api.get<IPaginationResponse<IUniversity>>(
        UniversityEndPoints.getAllUniversities,
        { params: paramObj }
      );

      return response.data ?? {
        Items: [],
        TotalItems: 0,
        PageIndex: 1,
        pageSize: 10,
        TotalPages: 1,
        FirstPage: 1,
        LastPage: 1,
      };
    },
  });
};

export const useGetAllCountries = () => {
  return useQuery({
    queryKey: [countryQueryKey],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<ICountry>>(
        UniversityEndPoints.getAllCountries
      );
      return response.data?.Items ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
};


export const useGetUniversities = () => {
  return useQuery({
    queryKey: [universityQueryKey],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IUniversity>>(
        UniversityEndPoints.getUniversities
      );
      return response.data?.Items ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const useGetAllCourses = () => {
  return useQuery({
    queryKey: ['AllCourses'],
    queryFn: async () => {
      const response = await api.get('/api/AcademicPrograms/GetAllCourse');
      return response.data?.Items ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const UseFilterIntakes = () => {
  return useQuery<IIntake[]>({
    queryKey: ['AllIntakes'],
    queryFn: async () => {
      const response = await api.get('/api/AcademicPrograms/FilterIntake')
      return response.data?.Items ?? []   // flatten pagination
    },
    staleTime: 5 * 60 * 1000,
  })
}
export const Usefiltervisastatus = () => {
  return useQuery<IVisaStatusResponse[]>({
    queryKey: ['AllVisaStatuses'],

    queryFn: async () => {
      const response = await api.get('/api/VisaApplication/FilterVisaStatus')
      return response.data?.Items ?? []   // flatten pagination
    },
    staleTime: 5 * 60 * 1000,
  })
}