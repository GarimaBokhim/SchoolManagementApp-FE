// src/api/university/cascadingHooks.ts

import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface IUniversityByCountry {
  id: string;
  name: string;
}

export interface ICourseByUniversity {
  id: string;
  title: string;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Fetch universities that belong to a specific country.
 * Only runs when countryId is truthy.
 *
 * API: GET /api/AcademicPrograms/UniversityByCountry/{countryId}
 */
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

/**
 * Fetch courses that belong to a specific university.
 * Only runs when universityId is truthy.
 *
 * API: GET /api/AcademicPrograms/CourseByUniversity/{universityId}
 */
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