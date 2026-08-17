import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddWaterPaymentsResponse, WaterPaymentsResponse, UpdateWaterPaymentsPayload, AddWaterPaymentsPayload, AddReceiptPayload, AddReceiptResponse } from '../types/IWaterPayments'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import { WaterIncomeEndpoints } from '../../income/hooks'
import { WaterIncomeResponse } from '../../income/types/IWaterIncome'


export const WaterPaymentsEndpoints = {
    filter: '/api/KhaneyPaniFinance/FilterWaterpayment',
    add: '/api/KhaneyPaniFinance/AddWaterPayment',
    update: '/api/KhaneyPaniFinance/UpdateWaterPayment',
    delete: '/api/KhaneyPaniFinance/DeleteWaterPayment',
    addReceipt: '/api/KhaneyPaniFinance/AddWaterReceipt',
    houseHolds: '/api/KhaneyPaniHouseHolds/FilterHouseHolds',
}

export const WaterPaymentsQueryKeys = {
    all: ['WaterPayments'],
}


const normalizeWaterPaymentsPayload = (
    data: AddWaterPaymentsPayload
): AddWaterPaymentsPayload => ({
    houseHoldId: String(data.houseHoldId ?? "").trim(),
    paymentDate: String(data.paymentDate ?? "").trim(),
    paidAmount: data.paidAmount ?? 0,
    paymentMethods: data.paymentMethods ?? 0

});

const normalizeWaterReceiptsPayload = (
    data: AddReceiptPayload
): AddReceiptPayload => ({
    waterPaymentId: String(data.waterPaymentId ?? "").trim()

});



const normalizeUpdateWaterPaymentsPayload = (
    data: UpdateWaterPaymentsPayload
): UpdateWaterPaymentsPayload => ({
    id: String(data.id ?? "").trim(),
    houseHoldId: String(data.houseHoldId ?? "").trim(),
    paymentDate: String(data.paymentDate ?? "").trim(),
    paidAmount: data.paidAmount ?? 0,
    paymentMethods: data.paymentMethods ?? 0
});



export const useGetAllHouseHolds = () => {
    return useQuery({
        queryKey: [...WaterPaymentsQueryKeys.all],

        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<{
                    id: string
                    consumerName: string
                }>
            >(WaterPaymentsEndpoints.houseHolds, {
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


export const useGetAllWaterPayments = (queryParams?: string) => {
    return useQuery({
        queryKey: [...WaterPaymentsQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${WaterPaymentsEndpoints.filter}${queryParams}`
                : WaterPaymentsEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<WaterPaymentsResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}


export const useAddWaterReceipts = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddReceiptPayload) => {
            const normalizedPayload = normalizeWaterReceiptsPayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddReceiptResponse>>(
                WaterPaymentsEndpoints.addReceipt,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterReceipts added successfully')

            queryClient.invalidateQueries({
                queryKey: WaterPaymentsQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add WaterReceipts'
            )
        },
    })
}


export const useAddWaterPayments = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddWaterPaymentsPayload) => {
            const normalizedPayload = normalizeWaterPaymentsPayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddWaterPaymentsResponse>>(
                WaterPaymentsEndpoints.add,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterPayments added successfully')

            queryClient.invalidateQueries({
                queryKey: WaterPaymentsQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add WaterPayments'
            )
        },
    })
}


export const useDeleteWaterPayments = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(
                `${WaterPaymentsEndpoints.delete}/${id}`
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterPayments deleted successfully')

            queryClient.invalidateQueries({
                queryKey: WaterPaymentsQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to delete WaterPayments'
            )
        },
    })
}

export const useUpdateWaterPayments = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateWaterPaymentsPayload
        }) => {
            const response = await api.patch(
                `${WaterPaymentsEndpoints.update}/${id}`,
                normalizeUpdateWaterPaymentsPayload(payload)
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterPayments updated successfully')

            queryClient.invalidateQueries({
                queryKey: WaterPaymentsQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to update WaterPayments'
            )
        },
    })
}
