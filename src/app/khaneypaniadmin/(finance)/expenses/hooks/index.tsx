import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddWaterExpensesResponse, WaterExpensesResponse, UpdateWaterExpensesPayload, AddWaterExpensesPayload } from '../types/IWaterExpenses'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const WaterExpensesEndpoints = {
    filter: '/api/KhaneyPaniFinance/FilterWaterExpenses',
    add: '/api/KhaneyPaniFinance/AddWaterExpenses',
    update: '/api/KhaneyPaniFinance/UpdateWaterExpense',
    delete: '/api/KhaneyPaniFinance/DeleteWaterExpense',
    expensesCategory: '/api/KhaneyPaniFinance/FilterWaterExpensesCategory',
}

export const WaterExpensesQueryKeys = {
    all: ['WaterExpenses'],
}


const normalizeWaterExpensesPayload = (
    data: AddWaterExpensesPayload
): AddWaterExpensesPayload => ({
    expenseDate: String(data.expenseDate ?? "").trim(),
    expenseCategoryId: String(data.expenseCategoryId ?? "").trim(),
    amount: data.amount ?? 0,
    paymentMethod: data.paymentMethod ?? 0,
    venderName: String(data.venderName ?? "").trim(),
    description: String(data.description ?? "").trim()

});


const normalizeUpdateWaterExpensesPayload = (
    data: UpdateWaterExpensesPayload
): UpdateWaterExpensesPayload => ({
    id: String(data.id ?? "").trim(),
    expensesDate: String(data.expensesDate ?? "").trim(),
    expenseCategoryId: String(data.expenseCategoryId ?? "").trim(),
    amount: data.amount ?? 0,
    paymentMethod: data.paymentMethod ?? 0,
    venderName: String(data.venderName ?? "").trim(),
    description: String(data.description ?? "").trim()
});


export const useGetAllWaterExpenses = (queryParams?: string) => {
    return useQuery({
        queryKey: [...WaterExpensesQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${WaterExpensesEndpoints.filter}${queryParams}`
                : WaterExpensesEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<WaterExpensesResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}

export const useGetAllExpensesCategory = () => {
    return useQuery({
        queryKey: [...WaterExpensesQueryKeys.all],

        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<{
                    id: string
                    name: string
                }>
            >(WaterExpensesEndpoints.expensesCategory, {
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



export const useAddWaterExpenses = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddWaterExpensesPayload) => {
            const normalizedPayload = normalizeWaterExpensesPayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddWaterExpensesResponse>>(
                WaterExpensesEndpoints.add,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterExpenses added successfully')

            queryClient.invalidateQueries({
                queryKey: WaterExpensesQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add WaterExpenses'
            )
        },
    })
}


export const useDeleteWaterExpenses = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(
                `${WaterExpensesEndpoints.delete}/${id}`
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterExpenses deleted successfully')

            queryClient.invalidateQueries({
                queryKey: WaterExpensesQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to delete WaterExpenses'
            )
        },
    })
}

export const useUpdateWaterExpenses = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateWaterExpensesPayload
        }) => {
            const response = await api.patch(
                `${WaterExpensesEndpoints.update}/${id}`,
                normalizeUpdateWaterExpensesPayload(payload)
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'WaterExpenses updated successfully')

            queryClient.invalidateQueries({
                queryKey: WaterExpensesQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to update WaterExpenses'
            )
        },
    })
}
