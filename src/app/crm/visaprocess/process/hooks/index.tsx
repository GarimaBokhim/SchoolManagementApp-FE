import { IPaginationResponse } from '@/types/IPaginationResponse'
import { api } from '@/utils/instance'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IVisaApplication } from '../types/Ivisaapplication'

export const VisaApplicationEndPoints = {
    filterVisaApplications: '/api/VisaApplication/FilterVisaApplication',
    AddVisaApplication: '/api/VisaApplication/AddVisaApplication',
}

export const visaApplicationQueryKey = 'VisaApplications'


export const useAddVisaApplication = () => {
    const queryClient = useQueryClient()

    return useMutation<IVisaApplication, Error, IVisaApplication>({
        mutationFn: async (payload) => {
            const response = await api.post(
                VisaApplicationEndPoints.AddVisaApplication,
                payload
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [visaApplicationQueryKey],
            })
        },
    })
}


export const useGetAllVisaApplications = (queryParams?: string) => {
    return useQuery({
        queryKey: [visaApplicationQueryKey, queryParams],

        queryFn: async () => {
            const paramObj: Record<string, string> = {}
            if (queryParams) {
                const parsed = new URLSearchParams(queryParams.replace(/^&/, ''))
                parsed.forEach((value, key) => {
                    paramObj[key] = value
                })
            }
            const response = await api.get<IPaginationResponse<IVisaApplication>>(
                VisaApplicationEndPoints.filterVisaApplications,
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
