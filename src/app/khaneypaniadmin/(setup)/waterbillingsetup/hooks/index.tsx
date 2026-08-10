import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddWaterBillingSetUpResponse, WaterBillingSetUpResponse, UpdateWaterBillingSetUpPayload, AddWaterBillingSetUpPayload } from '../types/IWaterBillingSetup'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const WaterBillingSetUpEndpoints = {
    filter: '/api/KhaneyPaniSetUp/FilterWaterTariffPlan',
    add: '/api/KhaneyPaniSetUp/AddWaterTariffPlan',
    update: '/api/KhaneyPaniSetUp/UpdateWaterTariffPlan',
    delete: '/api/KhaneyPaniSetUp/DeleteWaterTariffPlan',
}

export const WaterBillingSetUpQueryKeys = {
    all: ['WaterBillingSetUp'],
}


const normalizeWaterBillingSetUpPayload = (
    data: AddWaterBillingSetUpPayload
): AddWaterBillingSetUpPayload => ({
    name: String(data.name ?? "").trim(),
    description: String(data.description ?? "").trim(),
    isDefault: data.isDefault ?? true

});


const normalizeUpdateWaterBillingSetUpPayload = (
    data: UpdateWaterBillingSetUpPayload
): UpdateWaterBillingSetUpPayload => ({
    id: String(data.id ?? "").trim(),
    name: String(data.name ?? "").trim(),
    description: String(data.description ?? "").trim(),
    isDefault: data.isDefault ?? true
});


export const useGetAllWaterBillingSetUp = (queryParams?: string) => {
    return useQuery({
        queryKey: [...WaterBillingSetUpQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${WaterBillingSetUpEndpoints.filter}${queryParams}`
                : WaterBillingSetUpEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<WaterBillingSetUpResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}



export const useAddWaterBillingSetUp = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddWaterBillingSetUpPayload) => {
            const normalizedPayload = normalizeWaterBillingSetUpPayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddWaterBillingSetUpResponse>>(
                WaterBillingSetUpEndpoints.add,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterBillingSetUp added successfully')

            queryClient.invalidateQueries({
                queryKey: WaterBillingSetUpQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add WaterBillingSetUp'
            )
        },
    })
}


export const useDeleteWaterBillingSetUp = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(
                `${WaterBillingSetUpEndpoints.delete}/${id}`
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterBillingSetUp deleted successfully')

            queryClient.invalidateQueries({
                queryKey: WaterBillingSetUpQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to delete WaterBillingSetUp'
            )
        },
    })
}

export const useUpdateWaterBillingSetUp = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateWaterBillingSetUpPayload
        }) => {
            const response = await api.patch(
                `${WaterBillingSetUpEndpoints.update}/${id}`,
                normalizeUpdateWaterBillingSetUpPayload(payload)
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterBillingSetUp updated successfully')

            queryClient.invalidateQueries({
                queryKey: WaterBillingSetUpQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to update WaterBillingSetUp'
            )
        },
    })
}
