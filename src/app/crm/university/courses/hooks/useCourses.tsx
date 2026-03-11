import { useState, useEffect, useCallback } from "react";
import { Toast } from "@/components/Toast/toast";
import { Course, University } from "../types/ICourses";
import { api } from "@/utils/instance";

interface UseCoursesReturn {
  courses: Course[];
  universities: University[];
  allCourses: Course[];          
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useCourses = (): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(async () => {
    try {
      const response = await api.get('/api/AcademicPrograms/FilterUniversity');
      const universitiesData = response.data?.items ?? [];
      setUniversities(universitiesData);
    } catch (err: any) {
      console.error('Error fetching universities:', err);
    }
  }, []);

  const fetchAllCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/api/AcademicPrograms/FilterCourse', {
        params: { pageIndex: 1, pageSize: 1000 },
      });

      const coursesData = response.data?.Items ?? [];

      const enrichedCourses = coursesData.map((course: Course) => {
        const university = universities.find((u) => u.id === course.universityId);
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

  // ✅ new — fetch all courses from GetAllCourse (for combobox/dropdowns)
  const fetchGetAllCourses = useCallback(async () => {
    try {
      const response = await api.get('/api/AcademicPrograms/GetAllCourse');
      setAllCourses(response.data?.Items ?? []);
    } catch (err: any) {
      console.error('Error fetching all courses:', err);
    }
  }, []);

  useEffect(() => {
    fetchUniversities();
    fetchGetAllCourses();  // ✅ fetch on mount alongside universities
  }, [fetchUniversities, fetchGetAllCourses]);

  useEffect(() => {
    if (universities.length > 0) {
      fetchAllCourses();
    }
  }, [universities, fetchAllCourses]);

  const refreshData = async () => {
    await fetchUniversities();
    await fetchAllCourses();
    await fetchGetAllCourses();  // ✅ refresh this too
  };

  return { courses, universities, allCourses, loading, error, refreshData };
};