import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddWaterBillingRuleSlabResponse, WaterBillingRuleSlabResponse, UpdateWaterBillingRuleSlabPayload, AddWaterBillingRuleSlabPayload } from '../types/IWaterBillingRuleSlab'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const WaterBillingRuleSlabEndpoints = {
    filter: '/api/KhaneyPaniSetUp/FilterWaterBillingRuleSlab',
    add: '/api/KhaneyPaniSetUp/AddWaterBillingRuleSlab',
    update: '/api/KhaneyPaniSetUp/UpdateWaterBillingRuleSlab',
    delete: '/api/KhaneyPaniSetUp/DeleteWaterBillingRuleSlab',
}

export const WaterBillingRuleSlabQueryKeys = {
    all: ['WaterBillingRuleSlab'],
}


const normalizeWaterBillingRuleSlabPayload = (
    data: AddWaterBillingRuleSlabPayload
): AddWaterBillingRuleSlabPayload => ({
    billingRuleId: String(data.billingRuleId ?? "").trim(),
    fromUnit: data.fromUnit ?? 0,
    toUnit: data.toUnit ?? 0,
    ratePerUnit: data.ratePerUnit ?? 0

});


const normalizeUpdateWaterBillingRuleSlabPayload = (
    data: UpdateWaterBillingRuleSlabPayload
): UpdateWaterBillingRuleSlabPayload => ({
    id: String(data.id ?? "").trim(),
    billingRuleId: String(data.billingRuleId ?? "").trim(),
    fromUnit: data.fromUnit ?? 0,
    toUnit: data.toUnit ?? 0,
    ratePerUnit: data.ratePerUnit ?? 0
});


export const useGetAllWaterBillingRuleSlab = (queryParams?: string) => {
    return useQuery({
        queryKey: [...WaterBillingRuleSlabQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${WaterBillingRuleSlabEndpoints.filter}${queryParams}`
                : WaterBillingRuleSlabEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<WaterBillingRuleSlabResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}



export const useAddWaterBillingRuleSlab = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddWaterBillingRuleSlabPayload) => {
            const normalizedPayload = normalizeWaterBillingRuleSlabPayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddWaterBillingRuleSlabResponse>>(
                WaterBillingRuleSlabEndpoints.add,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterBillingRuleSlab added successfully')

            queryClient.invalidateQueries({
                queryKey: WaterBillingRuleSlabQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add WaterBillingRuleSlab'
            )
        },
    })
}


export const useDeleteWaterBillingRuleSlab = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(
                `${WaterBillingRuleSlabEndpoints.delete}/${id}`
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterBillingRuleSlab deleted successfully')

            queryClient.invalidateQueries({
                queryKey: WaterBillingRuleSlabQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to delete WaterBillingRuleSlab'
            )
        },
    })
}

export const useUpdateWaterBillingRuleSlab = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateWaterBillingRuleSlabPayload
        }) => {
            const response = await api.patch(
                `${WaterBillingRuleSlabEndpoints.update}/${id}`,
                normalizeUpdateWaterBillingRuleSlabPayload(payload)
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterBillingRuleSlab updated successfully')

            queryClient.invalidateQueries({
                queryKey: WaterBillingRuleSlabQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to update WaterBillingRuleSlab'
            )
        },
    })
}
