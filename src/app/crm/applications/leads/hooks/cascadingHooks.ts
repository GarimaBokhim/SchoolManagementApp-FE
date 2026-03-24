
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";


export interface IUniversityByCountry {
  id: string;
  name: string;
}

export interface ICourseByUniversity {
  id: string;
  title: string;
}
export const useGetUniversitiesByCountry = (countryId: string | null) => {
  return useQuery({
    queryKey: ["UniversitiesByCountry", countryId],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IUniversityByCountry>>(
        `/api/AcademicPrograms/UniversityByCountry/${countryId}`
      );
      return response.data?.Items ?? [];
    },
    enabled: !!countryId,
    staleTime: 5 * 60 * 1000,
  });
};
export const useGetCoursesByUniversity = (universityId: string | null) => {
  return useQuery({
    queryKey: ["CoursesByUniversity", universityId],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<ICourseByUniversity>>(
        `/api/AcademicPrograms/CourseByUniversity/${universityId}`
      );
      return response.data?.Items ?? [];
    },
    enabled: !!universityId,
    staleTime: 5 * 60 * 1000,
  });
};