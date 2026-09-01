import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddWaterBillingRuleResponse, WaterBillingRuleResponse, UpdateWaterBillingRulePayload, AddWaterBillingRulePayload } from '../types/IWaterBillingRule'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const WaterBillingRuleEndpoints = {
    filter: '/api/KhaneyPaniSetUp/FilterWaterBillingRule',
    add: '/api/KhaneyPaniSetUp/AddWaterBillingRule',
    update: '/api/KhaneyPaniSetUp/UpdateWaterBillingRule',
    delete: '/api/KhaneyPaniSetUp/DeleteWaterBillingRule',
    filterWaterTariffPlan: '/api/KhaneyPaniSetUp/FilterWaterTariffPlan',
}

export const WaterBillingRuleQueryKeys = {
    all: ['WaterBillingRule'],
}


const normalizeWaterBillingRulePayload = (
    data: AddWaterBillingRulePayload
): AddWaterBillingRulePayload => ({
    waterTarifPlanId: String(data.waterTarifPlanId ?? "").trim(),
    effectiveFrom: String(data.effectiveFrom ?? "").trim(),
    effectiveTo: String(data.effectiveTo ?? "").trim()

});


const normalizeUpdateWaterBillingRulePayload = (
    data: UpdateWaterBillingRulePayload
): UpdateWaterBillingRulePayload => ({
    id: String(data.id ?? "").trim(),
    waterTarifPlanId: String(data.waterTarifPlanId ?? "").trim(),
    effectiveFrom: String(data.effectiveFrom ?? "").trim(),
    effectiveTo: String(data.effectiveTo ?? "").trim()
});


export const useGetAllWaterTariffPlan = () => {
    return useQuery({
        queryKey: [...WaterBillingRuleQueryKeys.all],

        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<{
                    id: string
                    name: string
                }>
            >(WaterBillingRuleEndpoints.filterWaterTariffPlan, {
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


export const useGetAllWaterBillingRule = (queryParams?: string) => {
    return useQuery({
        queryKey: [...WaterBillingRuleQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${WaterBillingRuleEndpoints.filter}${queryParams}`
                : WaterBillingRuleEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<WaterBillingRuleResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}



export const useAddWaterBillingRule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddWaterBillingRulePayload) => {
            const normalizedPayload = normalizeWaterBillingRulePayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddWaterBillingRuleResponse>>(
                WaterBillingRuleEndpoints.add,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterBillingRule added successfully')

            queryClient.invalidateQueries({
                queryKey: WaterBillingRuleQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add WaterBillingRule'
            )
        },
    })
}


export const useDeleteWaterBillingRule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(
                `${WaterBillingRuleEndpoints.delete}/${id}`
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterBillingRule deleted successfully')

            queryClient.invalidateQueries({
                queryKey: WaterBillingRuleQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to delete WaterBillingRule'
            )
        },
    })
}

export const useUpdateWaterBillingRule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateWaterBillingRulePayload
        }) => {
            const response = await api.patch(
                `${WaterBillingRuleEndpoints.update}/${id}`,
                normalizeUpdateWaterBillingRulePayload(payload)
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterBillingRule updated successfully')

            queryClient.invalidateQueries({
                queryKey: WaterBillingRuleQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to update WaterBillingRule'
            )
        },
    })
}
