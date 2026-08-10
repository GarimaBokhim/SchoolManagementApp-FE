import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { DueDetailsResponse, DueReportsResponse } from '../types/IDueReports'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const DueReportsEndpoints = {
    filter: '/api/KhaneyPaniReport/DueReports',
    dueDetails: '/api/KhaneyPaniReport/DueDetailsReport',

}

export const DueReportsQueryKeys = {
    all: ['DueReports'],
    byHouseHold: (houseHoldId: string) => [
        'DueDetails',
        houseHoldId,
    ]
}



export const useGetAllDueReports = (queryParams?: string) => {
    return useQuery<DueReportsResponse>({
        queryKey: [...DueReportsQueryKeys.all, queryParams],

        queryFn: async () => {
            const url = queryParams
                ? `${DueReportsEndpoints.filter}${queryParams}`
                : DueReportsEndpoints.filter

            const response = await api.get(url)

            return response.data.Data as DueReportsResponse
        },

        staleTime: 1000 * 60 * 5,

        retry: false,
    })
}


export const useDueDetailsReports = (
    houseHoldId?: string
) => {
    return useQuery<DueDetailsResponse>({
        queryKey:
            DueReportsQueryKeys.byHouseHold(
                houseHoldId ?? ''
            ),

        queryFn: async () => {
            if (!houseHoldId) {
                throw new Error(
                    'Household ID is required.'
                )
            }

            const response = await api.get(
                DueReportsEndpoints.dueDetails,
                {
                    params: {
                        houseHoldId,
                    },
                }
            )

            return response.data.Data
        },

        enabled: Boolean(houseHoldId),

        staleTime: 1000 * 60 * 5,

        retry: false,
    })
}

