import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/utils/instance';
import { Toast } from '@/components/Toast/toast';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import { ApiResponse, Student } from '../type/IStudents';

interface School {
  id: string;
  name: string;
}

interface AllSchoolsData {
  Items: School[];
}

export const useStudents = (allSchools: AllSchoolsData | undefined) => {
  const [students, setStudents] = useState<Student[]>([]);

  // `loading` = true only on the very first fetch (no data yet)
  const [loading, setLoading] = useState(true);

  // `isFetching` = true on every subsequent fetch (old data stays visible underneath)
  const [isFetching, setIsFetching] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState('');
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const hasLoadedOnce = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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
    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // First load → full loading state; subsequent → subtle isFetching only
    if (!hasLoadedOnce.current) {
      setLoading(true);
    } else {
      setIsFetching(true);
    }

    setError(null);

    try {
      const queryString = buildQueryString();
      const response = await api.get<ApiResponse>(
        `/api/Enrolments/FilterCRMStudents${queryString}`,
        { signal: abortControllerRef.current.signal }
      );
      const data = response.data;
      const items = data.Items || [];

      const formatted: Student[] = items.map((item) => ({
        id: item.id,
        userId: item.userId,
        fullName: item.fullName || '-',       
        email: item.email || '-',             
        enrolmentType: item.enrolmentType, 
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

      hasLoadedOnce.current = true;
    } catch (err: unknown) {
      // Ignore intentional cancellations
      if (
        (err as { name?: string })?.name === 'AbortError' ||
        (err as { code?: string })?.code === 'ERR_CANCELED'
      ) {
        return;
      }
      const errorMsg = handleError(err);
      setError(errorMsg);
      Toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [buildQueryString, getSchoolName, handleError, paginationParams.pageIndex]);

  useEffect(() => {
    if (allSchools) {
      fetchStudents();
    }
    // fetchStudents intentionally omitted — raw deps below are the real triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.pageIndex, paginationParams.pageSize, params, allSchools]);

  return {
    students,
    loading,      // true only on initial load
    isFetching,   // true on filter/page changes — use for subtle overlay
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