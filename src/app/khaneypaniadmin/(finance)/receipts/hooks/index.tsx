import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddWaterReceiptResponse, WaterReceiptResponse, UpdateWaterReceiptPayload, AddWaterReceiptPayload } from '../types/IWaterReceipts'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const WaterReceiptEndpoints = {
    filter: '/api/KhaneyPaniFinance/FilterWaterReceipt',
    add: '/api/KhaneyPaniFinance/AddWaterReceipt',
    update: '/api/KhaneyPaniFinance/UpdateWaterReceipt',
    delete: '/api/KhaneyPaniFinance/DeleteWaterReceipt',
    waterBilling: '/api/KhaneyPaniHouseHolds/FilterWaterBilling',
}

export const WaterReceiptQueryKeys = {
    all: ['WaterReceipt'],
}


const normalizeWaterReceiptPayload = (
    data: AddWaterReceiptPayload
): AddWaterReceiptPayload => ({
    waterBillingId: String(data.waterBillingId ?? "").trim(),
    receiptDate: String(data.receiptDate ?? "").trim(),
    paymentMethods: data.paymentMethods ?? 0,

});


const normalizeUpdateWaterReceiptPayload = (
    data: UpdateWaterReceiptPayload
): UpdateWaterReceiptPayload => ({
    id: String(data.id ?? "").trim(),
    waterBillingId: String(data.waterBillingId ?? "").trim(),
    receiptDate: String(data.receiptDate ?? "").trim(),
    paymentMethods: data.paymentMethods ?? 0,

});



export const useGetAllWaterBilling = () => {
    return useQuery({
        queryKey: [...WaterReceiptQueryKeys.all],

        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<{
                    id: string
                    name: string
                }>
            >(WaterReceiptEndpoints.waterBilling, {
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


export const useGetAllWaterReceipt = (queryParams?: string) => {
    return useQuery({
        queryKey: [...WaterReceiptQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${WaterReceiptEndpoints.filter}${queryParams}`
                : WaterReceiptEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<WaterReceiptResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}


export const useAddWaterReceipt = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddWaterReceiptPayload) => {
            const normalizedPayload = normalizeWaterReceiptPayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddWaterReceiptResponse>>(
                WaterReceiptEndpoints.add,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterReceipt added successfully')

            queryClient.invalidateQueries({
                queryKey: WaterReceiptQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add WaterReceipt'
            )
        },
    })
}


export const useDeleteWaterReceipt = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(
                `${WaterReceiptEndpoints.delete}/${id}`
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterReceipt deleted successfully')

            queryClient.invalidateQueries({
                queryKey: WaterReceiptQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to delete WaterReceipt'
            )
        },
    })
}

export const useUpdateWaterReceipt = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateWaterReceiptPayload
        }) => {
            const response = await api.patch(
                `${WaterReceiptEndpoints.update}/${id}`,
                normalizeUpdateWaterReceiptPayload(payload)
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterReceipt updated successfully')

            queryClient.invalidateQueries({
                queryKey: WaterReceiptQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to update WaterReceipt'
            )
        },
    })
}
