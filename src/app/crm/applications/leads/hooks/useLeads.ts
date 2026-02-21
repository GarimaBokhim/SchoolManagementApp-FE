import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/instance';
import { Lead, ApiResponse } from '../types';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import toast from 'react-hot-toast';

// ✅ Helper to fetch enrolmentType for a single userId
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState("");

  const { handleError } = useErrorHandler();

  const buildQueryString = useCallback(() => {
    const baseQuery = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
    return baseQuery + (params || "");
  }, [paginationParams, params]);

  const fetchLeads = useCallback(async (customParams?: string) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = customParams || buildQueryString();
      const url = `/api/Enrolments/FilterInquery${queryString}`;

      const response = await api.get<ApiResponse>(url);
      const data = response.data;
      const items = data.Items || [];

      // ✅ Fetch enrolmentType for all leads in parallel
      const enrolmentTypes = await Promise.all(
        items.map((item: any) => fetchEnrolmentType(item.userId))
      );

      const formattedLeads: Lead[] = items.map((item: any, index: number) => ({
        id: item.userId || Math.random().toString(),
        userId: item.userId,
        name: item.fullName || 'N/A',
        email: item.email || 'N/A',
        phone: item.contactNumber || 'N/A',
        source: item.source || 'website',
        educationLevel: item.educationLevel || 0,
        completionYear: item.completionYear || 'N/A',
        enrolmentType: enrolmentTypes[index], // ✅ attached here
      }));

      setLeads(formattedLeads);
      setTotalItems(data.TotalItems ?? 0);
      setTotalPages(data.TotalPages ?? 1);
      setCurrentPage(data.PageIndex ?? paginationParams.pageIndex);
    } catch (error: any) {
      const errorMsg = handleError(error);
      setError(errorMsg);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [buildQueryString, handleError, paginationParams.pageIndex]);

  useEffect(() => {
    fetchLeads();
  }, [paginationParams.pageIndex, paginationParams.pageSize, params]);

  return {
    leads,
    loading,
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