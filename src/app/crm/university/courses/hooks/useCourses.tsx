/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCourses.ts (updated version without pagination)
import { useState, useEffect, useCallback } from "react";
import { Toast } from "@/components/Toast/toast";
import { Course, University } from "../types/ICourses";
import { api } from "@/utils/instance";

interface UseCoursesReturn {
  courses: Course[];
  universities: University[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useCourses = (): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch universities
  const fetchUniversities = useCallback(async () => {
    try {
      const response = await api.get('/api/AcademicPrograms/FilterUniversity', {
        params: {
          pageIndex: 1,
          pageSize: 1000, // Get all universities
        }
      });
      // Handle different response structures
      const universitiesData = response.data?.items || response.data || [];
      setUniversities(universitiesData);
    } catch (err: any) {
      console.error('Error fetching universities:', err);
    }
  }, []);

  // Fetch all courses without pagination
  const fetchAllCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all courses by requesting a large page size
      const response = await api.get('/api/AcademicPrograms/FilterCourse', {
        params: {
          pageIndex: 1,
          pageSize: 1000, // Get all courses
        }
      });
      
      // Handle different response structures
      let coursesData = [];
      if (response.data?.items) {
        coursesData = response.data.items;
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
      } else {
        coursesData = response.data || [];
      }
      
      // Enrich courses with university data
      const enrichedCourses = coursesData.map((course: Course) => {
        const university = universities.find(u => u.id === course.universityId);
        return {
          ...course,
          universityName: university?.name || 'Unknown University',
          country: university?.country || 'Unknown Location',
        };
      });

      setCourses(enrichedCourses);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch courses';
      setError(errorMessage);
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [universities]);

  // Initial load
  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  // Fetch courses when universities are loaded
  useEffect(() => {
    if (universities.length > 0) {
      fetchAllCourses();
    }
  }, [universities, fetchAllCourses]);

  const refreshData = async () => {
    await fetchUniversities();
    await fetchAllCourses();
  };

  return {
    courses,
    universities,
    loading,
    error,
    refreshData,
  };
};