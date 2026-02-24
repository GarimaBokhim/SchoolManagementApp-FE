import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/instance';
import { Toast } from '@/components/Toast/toast';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import { ApiResponse, Student } from '../type/studnets';

interface School {
  id: string;
  name: string;
}

interface AllSchoolsData {
  Items: School[];
}

export const useStudents = (allSchools: AllSchoolsData | undefined) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState('');
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { handleError } = useErrorHandler();

  const getSchoolName = useCallback(
    (schoolId: string) => {
      return allSchools?.Items?.find((s) => s.id === schoolId)?.name || 'Unknown School';
    },
    [allSchools]
  );

  const buildQueryString = useCallback(() => {
    return (
      `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}` +
      (params || '')
    );
  }, [paginationParams, params]);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryString = buildQueryString();
      const response = await api.get<ApiResponse>(`/api/Enrolments/FilterCRMStudents${queryString}`);
      const data = response.data;
      const items = data.Items || [];

      const formatted: Student[] = items.map((item) => ({
        id: item.id,
        userId: item.userId,
        universityName: item.universityName || '-',
        visaId: item.visaId || '-',
        isActive: item.isActive,
        schoolId: item.schoolId,
        schoolName: getSchoolName(item.schoolId),
        createdBy: item.createdBy,
        createdAt: item.createdAt,
        modifiedBy: item.modifiedBy,
        modifiedAt: item.modifiedAt,
      }));

      setStudents(formatted);
      setTotalPages(data.TotalPages ?? 1);
      setCurrentPage(data.PageIndex ?? paginationParams.pageIndex);
    } catch (err: unknown) {
      const errorMsg = handleError(err);
      setError(errorMsg);
      Toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [buildQueryString, getSchoolName, handleError, paginationParams.pageIndex]);

  useEffect(() => {
    if (allSchools) {
      fetchStudents();
    }
  }, [paginationParams.pageIndex, paginationParams.pageSize, params, allSchools, fetchStudents]);

  return {
    students,
    loading,
    error,
    params,
    setParams,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    fetchStudents,
  };
};