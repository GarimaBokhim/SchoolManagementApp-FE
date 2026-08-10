import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { DailyCollectionResponse } from '../types/IDailyCollection'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const DailyCollectionEndpoints = {
    filter: '/api/KhaneyPaniReport/DailyCollectionReport',
}

export const DailyCollectionQueryKeys = {
    all: ['DailyCollection'],
}



export const useGetAllDailyCollection = (queryParams?: string) => {
    return useQuery({
        queryKey: [...DailyCollectionQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${DailyCollectionEndpoints.filter}${queryParams}`
                : DailyCollectionEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<DailyCollectionResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}
