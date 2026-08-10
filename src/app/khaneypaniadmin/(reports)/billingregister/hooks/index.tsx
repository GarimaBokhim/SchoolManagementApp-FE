import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { BillingRegisterResponse } from '../types/IBillingRegister'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const BillingRegisterEndpoints = {
    filter: '/api/KhaneyPaniReport/BillingRegisterReport',
}

export const BillingRegisterQueryKeys = {
    all: ['BillingRegister'],
}



export const useGetAllBillingRegister = (queryParams?: string) => {
    return useQuery({
        queryKey: [...BillingRegisterQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${BillingRegisterEndpoints.filter}${queryParams}`
                : BillingRegisterEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<BillingRegisterResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}
