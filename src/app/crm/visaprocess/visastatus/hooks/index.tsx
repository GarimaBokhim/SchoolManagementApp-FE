import { IPaginationResponse } from '@/types/IPaginationResponse'
import { api } from '@/utils/instance'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IAddVisaStatus, IVisaStatus } from '../types/IVisaStatus'

export const VisaStatusEndPoints = {
    filterVisaStatuses: '/api/VisaApplication/FilterVisaStatus',
    addVisaStatus: '/api/VisaApplication/AddVisaStatus',
}

export const visaStatusQueryKey = 'VisaStatuses'
export const visaStatusFlatQueryKey = 'VisaStatusesFlat'

export const useAddVisaStatus = () => {
    const queryClient = useQueryClient()

    return useMutation<IVisaStatus, Error, IAddVisaStatus>({
        mutationFn: async (payload) => {
            const response = await api.post(
                VisaStatusEndPoints.addVisaStatus,
                payload
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [visaStatusQueryKey],
            })
        },
    })
}

// Paginated fetch — used in the Allvisastatus list table
export const useGetAllVisaStatuses = (queryParams?: string) => {
    return useQuery({
        queryKey: [visaStatusQueryKey, queryParams],
        queryFn: async () => {
            const paramObj: Record<string, string> = {}
            if (queryParams) {
                const parsed = new URLSearchParams(queryParams.replace(/^&/, ''))
                parsed.forEach((value, key) => {
                    paramObj[key] = value
                })
            }
            const response = await api.get<IPaginationResponse<IVisaStatus>>(
                VisaStatusEndPoints.filterVisaStatuses,
                { params: paramObj }
            )
            return (
                response.data ?? {
                    Items: [],
                    TotalItems: 0,
                    PageIndex: 1,
                    pageSize: 10,
                    TotalPages: 1,
                    FirstPage: 1,
                    LastPage: 1,
                }
            )
        },
    })
}

// Flat (no-pagination) fetch — used for id→name lookup maps in other components
export const useGetAllVisaStatusesFlat = () => {
    return useQuery({
        queryKey: [visaStatusFlatQueryKey],
        queryFn: async () => {
            const response = await api.get<IPaginationResponse<IVisaStatus>>(
                VisaStatusEndPoints.filterVisaStatuses,
                { params: { IsPagination: false } }
            )
            return response.data?.Items ?? []
        },
        staleTime: 5 * 60 * 1000,
    })
}
