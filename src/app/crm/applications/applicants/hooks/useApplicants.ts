import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/instance';
import { Applicant, ApiResponse, School } from '../types';
import useErrorHandler from '@/components/helpers/ErrorHandling';
import { Toast } from '@/components/Toast/toast';

export const useApplicants = (allSchools?: { Items: School[] }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
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

  const getSchoolName = useCallback((schoolId: string) => {
    return allSchools?.Items?.find((school: School) => school.id === schoolId)?.name || 'Unknown School';
  }, [allSchools]);

  const buildQueryString = useCallback(() => {
    const baseQuery = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
    return baseQuery + (params || "");
  }, [paginationParams, params]);

  const fetchApplicants = useCallback(async (customParams?: string) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = customParams || buildQueryString();
      const url = `/api/Enrolments/FilterApplicants${queryString}`;

      const response = await api.get<ApiResponse>(url);
      const data = response.data;
      const items = data.Items || [];

      const formattedApplicants: Applicant[] = items.map((item: any) => ({
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
      }));

      setApplicants(formattedApplicants);
      setTotalItems(data.TotalItems ?? 0);
      setTotalPages(data.TotalPages ?? 1);
      setCurrentPage(data.PageIndex ?? paginationParams.pageIndex);
    } catch (error: any) {
      const errorMsg = handleError(error);
      setError(errorMsg);
      Toast.error('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  }, [buildQueryString, getSchoolName, handleError, paginationParams.pageIndex]);

  // ✅ Fixed: removed fetchApplicants from deps to prevent infinite loop
  useEffect(() => {
    if (allSchools) {
      fetchApplicants();
    }
  }, [paginationParams.pageIndex, paginationParams.pageSize, params, allSchools]);

  return {
    applicants,
    loading,
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