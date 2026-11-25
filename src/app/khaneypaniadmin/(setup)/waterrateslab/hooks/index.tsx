import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import { getBackendBaseUrl } from '@/utils/backendUrl'
import {
    AddWaterRateSlabPayload,
    UpdateWaterRateSlabPayload,
    WaterRateSlabDetailsResponse,
    WaterRateSlabResponse,
} from '../types/IWaterRateSlab'
import { WaterTariffResponse } from '../../watertariff/types/IWaterTariff'

type ApiErrorResponse = {
    Message?: string
}

export const WaterRateSlabEndpoints = {
    filter: `${getBackendBaseUrl()}/api/KhaneyPaniSetUp/FilterWaterRateSlab`,
    details: `${getBackendBaseUrl()}/api/KhaneyPaniSetUp/WaterRateSlab`,
    add: `${getBackendBaseUrl()}/api/KhaneyPaniSetUp/AddWaterRateSlab`,
    update: `${getBackendBaseUrl()}/api/KhaneyPaniSetUp/UpdateWaterRateSlab`,
    delete: `${getBackendBaseUrl()}/api/KhaneyPaniSetUp/DeleteWaterRateSlab`,
}

export const WaterRateSlabQueryKeys = {
    all: ['WaterRateSlab'],
    tariffs: ['WaterRateSlab', 'WaterTariffs'],
}

export const useGetWaterTariffs = () =>
    useQuery({
        queryKey: WaterRateSlabQueryKeys.tariffs,
        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<WaterTariffResponse>
            >(`${getBackendBaseUrl()}/api/KhaneyPaniSetUp/FilterWaterTariff`, {
                params: {
                    pageSize: 1000,
                    pageIndex: 1,
                    IsPagination: false,
                },
            })
            return response.data.Data.Items
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })

export const useGetAssignedWaterTariffIds = () =>
    useQuery({
        queryKey: [...WaterRateSlabQueryKeys.all, 'assignedTariffs'],
        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<WaterRateSlabResponse>
            >(WaterRateSlabEndpoints.filter, {
                params: {
                    pageSize: 1000,
                    pageIndex: 1,
                    IsPagination: false,
                },
            })
            const rateSlabs = response.data.Data.Items
            const assignedTariffIds = new Set<string>()

            for (let index = 0; index < rateSlabs.length; index += 10) {
                const batch = rateSlabs.slice(index, index + 10)
                const details = await Promise.all(
                    batch.map(async (rateSlab) => {
                        const detailResponse =
                            await api.get<WaterRateSlabDetailsResponse>(
                                WaterRateSlabEndpoints.details,
                                { params: { rateSlabId: rateSlab.id } },
                            )
                        return detailResponse.data.Data
                    }),
                )

                details.flat().forEach((slab) => {
                    assignedTariffIds.add(slab.WaterTariffId)
                })
            }

            return [...assignedTariffIds]
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })

export const useGetAllWaterRateSlab = (queryParams?: string) =>
    useQuery({
        queryKey: [...WaterRateSlabQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${WaterRateSlabEndpoints.filter}${queryParams}`
                : WaterRateSlabEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<WaterRateSlabResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })

export const useGetWaterRateSlab = (rateSlabId: string, enabled = true) =>
    useQuery({
        queryKey: [...WaterRateSlabQueryKeys.all, 'detail', rateSlabId],
        queryFn: async () => {
            const response = await api.get<WaterRateSlabDetailsResponse>(
                WaterRateSlabEndpoints.details,
                { params: { rateSlabId } },
            )
            return response.data.Data
        },
        enabled: Boolean(rateSlabId) && enabled,
        retry: false,
    })

export const useAddWaterRateSlab = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddWaterRateSlabPayload) => {
            const response = await api.post(
                WaterRateSlabEndpoints.add,
                {
                    WaterTariffId: payload.waterTariffId,
                    Name: payload.name.trim(),
                    CurrentLastSlabEndsAt: payload.currentLastSlabEndsAt,
                    NewRateSlabs: payload.newRateSlabs.map((slab) => ({
                        ToUnit: slab.toUnit,
                        RatePerUnit: slab.ratePerUnit,
                    })),
                },
            )
            return response.data
        },
        onSuccess: (response) => {
            Toast.success(response?.Message || 'Water rate slab added successfully')
            queryClient.invalidateQueries({ queryKey: WaterRateSlabQueryKeys.all })
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            Toast.error(error?.response?.data?.Message || 'Failed to add water rate slab')
        },
    })
}

export const useUpdateWaterRateSlab = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateWaterRateSlabPayload
        }) => {
            const response = await api.patch(
                `${WaterRateSlabEndpoints.update}/${id}`,
                {
                    name: payload.name.trim(),
                    Slabs: payload.slabs.map((slab) => ({
                        SlabNo: slab.slabNo,
                        ToUnit: slab.toUnit,
                        RatePerUnit: slab.ratePerUnit,
                    })),
                },
            )
            return response.data
        },
        onSuccess: (response) => {
            Toast.success(response?.Message || 'Water rate slab updated successfully')
            queryClient.invalidateQueries({ queryKey: WaterRateSlabQueryKeys.all })
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            Toast.error(error?.response?.data?.Message || 'Failed to update water rate slab')
        },
    })
}

export const useDeleteWaterRateSlab = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`${WaterRateSlabEndpoints.delete}/${id}`)
            return response.data
        },
        onSuccess: (response) => {
            Toast.success(response?.Message || 'Water rate slab deleted successfully')
            queryClient.invalidateQueries({ queryKey: WaterRateSlabQueryKeys.all })
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            Toast.error(error?.response?.data?.Message || 'Failed to delete water rate slab')
        },
    })
}
