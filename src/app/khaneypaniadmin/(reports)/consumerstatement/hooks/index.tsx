import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { ConsumerStatementResponse, HouseHoldsResponse } from '../types/IConsumerStatement'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const ConsumerStatementEndpoints = {
    filter: '/api/KhaneyPaniReport/ConsumerStatementReport',
    filterHouseHolds: '/api/KhaneyPaniHouseHolds/FilterHouseHolds',
}

export const ConsumerStatementQueryKeys = {
    all: ['ConsumerStatement'],
    byHouseHold: (houseHoldId: string) => [
        'ConsumerStatement',
        houseHoldId,
    ]
}

export const useGetAllHouseHolds = (queryParams?: string) => {
    return useQuery({
        queryKey: [...ConsumerStatementQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${ConsumerStatementEndpoints.filterHouseHolds}${queryParams}`
                : ConsumerStatementEndpoints.filterHouseHolds
            const response =
                await api.get<IPaginationCrmResponse<HouseHoldsResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}



export const useGetConsumerStatement = (
    houseHoldId?: string
) => {
    return useQuery<ConsumerStatementResponse>({
        queryKey:
            ConsumerStatementQueryKeys.byHouseHold(
                houseHoldId ?? ''
            ),

        queryFn: async () => {
            if (!houseHoldId) {
                throw new Error(
                    'Household ID is required.'
                )
            }

            const response = await api.get(
                ConsumerStatementEndpoints.filter,
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
