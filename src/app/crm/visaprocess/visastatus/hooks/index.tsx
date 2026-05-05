import { IPaginationResponse } from '@/types/IPaginationResponse'
import { api } from '@/utils/instance'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IAddVisaStatus, IVisaStatus } from '../types/IVisaStatus'

export const VisaStatusEndPoints = {
    filterVisaStatuses: '/api/VisaApplication/FilterVisaStatus',
    addVisaStatus: '/api/VisaApplication/AddVisaStatus',
}

export const visaStatusQueryKey = 'VisaStatuses'

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
