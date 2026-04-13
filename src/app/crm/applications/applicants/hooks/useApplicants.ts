import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/utils/instance';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import { Toast } from '@/components/Toast/toast';
import { fetchUserProfile } from './useUserProfile';
import { ApiResponse, Applicant, School } from '../types/IApplicants';

export const useApplicants = (allSchools?: { Items: School[] }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // `loading` = true only on the very first fetch (no data yet)
  const [loading, setLoading] = useState(true);

  // `isFetching` = true on every subsequent fetch (old data stays visible underneath)
  const [isFetching, setIsFetching] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState('');

  const hasLoadedOnce = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { handleError } = useErrorHandler();

  const getSchoolName = useCallback(
    (schoolId: string) => {
      return (
        allSchools?.Items?.find((school: School) => school.id === schoolId)?.name ||
        'Unknown School'
      );
    },
    [allSchools]
  );

  const buildQueryString = useCallback(() => {
    const baseQuery = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
    return baseQuery + (params || '');
  }, [paginationParams, params]);

  const fetchApplicants = useCallback(
    async (customParams?: string) => {
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
        const queryString = customParams || buildQueryString();
        const url = `/api/Enrolments/FilterApplicants${queryString}`;

        const response = await api.get<ApiResponse>(url, {
          signal: abortControllerRef.current.signal,
        });
        const data = response.data;
        const items = data.Items || [];

        const profiles = await Promise.all(
          items.map((item) => fetchUserProfile(item.userId))
        );

        const formattedApplicants: Applicant[] = items.map((item, index) => {
          const profile = profiles[index];
          return {
            id: item.id,
            userId: item.userId,
            passportNo: item.passportNo || '-',
            targetCountry: item.targetCountry || '-',
            isActive: item.isActive,
            schoolId: item.schoolId,
            schoolName: getSchoolName(item.schoolId),
            createdBy: item.createdBy,
            createdAt: item.createdAt,
            modifiedBy: item.modifiedBy,
            modifiedAt: item.modifiedAt,
            fullName: profile?.fullName ?? '-',
            email: profile?.email ?? '-',
            enrolmentType: profile?.enrolmentType,
          };
        });

        setApplicants(formattedApplicants);
        setTotalItems(data.TotalItems ?? 0);
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
        Toast.error('Failed to fetch applicants');
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    },
    [buildQueryString, getSchoolName, handleError, paginationParams.pageIndex]
  );

  useEffect(() => {
    if (allSchools) {
      fetchApplicants();
    }
    // fetchApplicants intentionally omitted — raw deps below are the real triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.pageIndex, paginationParams.pageSize, params, allSchools]);

  return {
    applicants,
    loading,      // true only on initial load — use for full skeleton/spinner
    isFetching,   // true on filter/page changes — use for subtle overlay
    error,
    paginationParams,
    setPaginationParams,
    totalItems,
    totalPages,
    currentPage,
    params,
    setParams,
    fetchApplicants,
    getSchoolName,
  };
};