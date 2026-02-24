import { useState, useEffect, useCallback } from "react";
import { Toast } from "@/components/Toast/toast";
import { ApiResponse, Course, FilterParams, University } from "../types/ICourses";
import { api } from "@/utils/instance";

interface UseCoursesReturn {
  courses: Course[];
  universities: University[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  filters: FilterParams;
  setFilters: (filters: FilterParams) => void;
  refreshData: () => Promise<void>;
}

export const useCourses = (initialPageSize: number = 9): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState<FilterParams>({
    pageIndex: 1,
    pageSize: initialPageSize,
  });

  // Fetch universities
  const fetchUniversities = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<University>>('/AcademicPrograms/FilterUniversity', {
        params: {
          pageIndex: 1,
          pageSize: 100, // Get all universities
        }
      });
      setUniversities(response.data.items || []);
    } catch (err: any) {
      console.error('Error fetching universities:', err);
      // Don't show error toast here as it might be a secondary failure
    }
  }, []);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        pageIndex: currentPage,
        pageSize: pageSize,
      };

      // Add filters if they exist
      if (filters.searchTerm) {
        params.searchTerm = filters.searchTerm;
      }
      if (filters.universityId) {
        params.universityId = filters.universityId;
      }
      if (filters.country) {
        params.country = filters.country;
      }

      const response = await api.get<ApiResponse<Course>>('/AcademicPrograms/FilterCourse', { params });
      
      // Enrich courses with university data
      const enrichedCourses = response.data.items.map((course: Course) => {
        const university = universities.find(u => u.id === course.universityId);
        return {
          ...course,
          universityName: university?.name || 'Unknown University',
          country: university?.country || 'Unknown Location',
        };
      });

      setCourses(enrichedCourses);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch courses';
      setError(errorMessage);
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters, universities]);

  // Initial load
  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  // Fetch courses when dependencies change
  useEffect(() => {
    if (universities.length > 0) {
      fetchCourses();
    }
  }, [currentPage, pageSize, filters, universities, fetchCourses]);

  const setPage = (page: number) => {
    setCurrentPage(page);
    setFilters(prev => ({ ...prev, pageIndex: page }));
  };

  const refreshData = async () => {
    await fetchUniversities();
    await fetchCourses();
  };

  return {
    courses,
    universities,
    loading,
    error,
    totalPages,
    currentPage,
    pageSize,
    setPage,
    setPageSize,
    filters,
    setFilters,
    refreshData,
  };
};