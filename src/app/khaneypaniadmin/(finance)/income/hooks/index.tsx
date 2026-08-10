import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddWaterIncomeResponse, WaterIncomeResponse, UpdateWaterIncomePayload, AddWaterIncomePayload } from '../types/IWaterIncome'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const WaterIncomeEndpoints = {
    filter: '/api/KhaneyPaniFinance/FilterWaterIncome',
    add: '/api/KhaneyPaniFinance/AddWaterIncome',
    update: '/api/KhaneyPaniFinance/UpdateWaterIncome',
    delete: '/api/KhaneyPaniFinance/DeleteWaterIncome',
    waterIncomeSource: '/api/KhaneyPaniFinance/FilterWaterIncomeSource'
}

export const WaterIncomeQueryKeys = {
    all: ['WaterIncome'],
}


const normalizeWaterIncomePayload = (
    data: AddWaterIncomePayload
): AddWaterIncomePayload => ({
    incomeDate: String(data.incomeDate ?? "").trim(),
    waterincomeSourceId: String(data.waterincomeSourceId ?? "").trim(),
    amount: data.amount ?? 0,
    paymentMethods: data.paymentMethods ?? 0,
    description: String(data.description ?? "").trim()

});


const normalizeUpdateWaterIncomePayload = (
    data: UpdateWaterIncomePayload
): UpdateWaterIncomePayload => ({
    id: String(data.id ?? "").trim(),
    incomeDate: String(data.incomeDate ?? "").trim(),
    waterincomeSourceId: String(data.waterincomeSourceId ?? "").trim(),
    amount: data.amount ?? 0,
    paymentMethods: data.paymentMethods ?? 0,
    description: String(data.description ?? "").trim()
});


export const useGetAllWaterIncome = (queryParams?: string) => {
    return useQuery({
        queryKey: [...WaterIncomeQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${WaterIncomeEndpoints.filter}${queryParams}`
                : WaterIncomeEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<WaterIncomeResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}

export const useGetAllWaterIncomeSource = () => {
    return useQuery({
        queryKey: [...WaterIncomeQueryKeys.all],

        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<{
                    id: string
                    name: string
                }>
            >(WaterIncomeEndpoints.waterIncomeSource, {
                params: {
                    pageSize: 10,
                    pageIndex: 1,
                    isPagination: true,
                },
            })

            return response.data
        },

        select: (response) => response?.Data.Items ?? [],

        staleTime: 1000 * 60 * 5,
    })
}



export const useAddWaterIncome = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddWaterIncomePayload) => {
            const normalizedPayload = normalizeWaterIncomePayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddWaterIncomeResponse>>(
                WaterIncomeEndpoints.add,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterIncome added successfully')

            queryClient.invalidateQueries({
                queryKey: WaterIncomeQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add WaterIncome'
            )
        },
    })
}


export const useDeleteWaterIncome = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(
                `${WaterIncomeEndpoints.delete}/${id}`
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterIncome deleted successfully')

            queryClient.invalidateQueries({
                queryKey: WaterIncomeQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to delete WaterIncome'
            )
        },
    })
}

export const useUpdateWaterIncome = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateWaterIncomePayload
        }) => {
            const response = await api.patch(
                `${WaterIncomeEndpoints.update}/${id}`,
                normalizeUpdateWaterIncomePayload(payload)
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterIncome updated successfully')

            queryClient.invalidateQueries({
                queryKey: WaterIncomeQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to update WaterIncome'
            )
        },
    })
}
