import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/utils/instance';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import toast from 'react-hot-toast';
import { ApiResponse, Lead } from '../types/ILeads';

const fetchEnrolmentType = async (userId: string): Promise<number> => {
  try {
    const response = await api.get(`/api/Enrolments/UserProfile/${userId}`);
    return response.data?.enrolmentType ?? 0;
  } catch {
    return 0;
  }
};

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  // `loading` is only true on the very first load (no data yet → show skeleton/spinner)
  const [loading, setLoading] = useState(true);

  // `isFetching` is true on every subsequent fetch (data exists → don't blank the table)
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

  // Track whether the first fetch has completed
  const hasLoadedOnce = useRef(false);

  // Ref to cancel stale in-flight requests when params change rapidly
  const abortControllerRef = useRef<AbortController | null>(null);

  const { handleError } = useErrorHandler();

  const buildQueryString = useCallback(() => {
    const base = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
    return base + (params || '');
  }, [paginationParams, params]);

  const fetchLeads = useCallback(
    async (customParams?: string) => {
      // Cancel any previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // First load → show full loading state; subsequent loads → just mark as fetching
      if (!hasLoadedOnce.current) {
        setLoading(true);
      } else {
        setIsFetching(true);
      }

      setError(null);

      try {
        const queryString = customParams || buildQueryString();
        const url = `/api/Enrolments/FilterInquery${queryString}`;

        const response = await api.get<ApiResponse>(url, {
          signal: abortControllerRef.current.signal,
        });
        const data = response.data;
        const items = data.Items || [];

        const enrolmentTypes = await Promise.all(
          items.map((item: { userId: string }) => fetchEnrolmentType(item.userId))
        );

        const formattedLeads: Lead[] = items.map(
          (
            item: {
              id?: string;
              userId: string;
              fullName?: string;
              email?: string;
              contactNumber?: string;
              source?: string;
              educationLevel?: number;
              completionYear?: string;
            },
            index: number
          ) => ({
            id: item.id || item.userId || Math.random().toString(),
            userId: item.userId,
            name: item.fullName || 'N/A',
            email: item.email || 'N/A',
            phone: item.contactNumber || 'N/A',
            source: item.source || 'website',
            educationLevel: item.educationLevel || 0,
            completionYear: item.completionYear || 'N/A',
            enrolmentType: enrolmentTypes[index],
          })
        );

        setLeads(formattedLeads);
        setTotalItems(data.TotalItems ?? 0);
        setTotalPages(data.TotalPages ?? 1);
        setCurrentPage(data.PageIndex ?? paginationParams.pageIndex);

        hasLoadedOnce.current = true;
      } catch (err: unknown) {
        // Ignore abort errors — they're intentional cancellations, not real errors
        if ((err as { name?: string })?.name === 'AbortError' || (err as { code?: string })?.code === 'ERR_CANCELED') {
          return;
        }
        const errorMsg = handleError(err);
        setError(errorMsg);
        toast.error('Failed to fetch leads');
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    },
    [buildQueryString, handleError, paginationParams.pageIndex]
  );

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.pageIndex, paginationParams.pageSize, params]);

  return {
    leads,
    loading,       // true only on initial load
    isFetching,    // true on filter/pagination changes — use for subtle overlay
    error,
    paginationParams,
    setPaginationParams,
    totalItems,
    totalPages,
    currentPage,
    params,
    setParams,
    fetchLeads,
  };
};