import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddStaffResponse, StaffResponse, UpdateStaffPayload, AddStaffPayload } from '../types/IStaff'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const StaffEndpoints = {
    filter: '/api/KhaneyPaniStaff/FilterStaff',
    add: '/api/KhaneyPaniStaff/AddStaff',
    update: '/api/KhaneyPaniStaff/UpdateStaff',
    delete: '/api/KhaneyPaniStaff/DeleteStaff',
}

export const StaffQueryKeys = {
    all: ['Staff'],
}


const normalizeStaffPayload = (
    data: AddStaffPayload
): AddStaffPayload => ({
    username: String(data.username ?? "").trim(),
    password: String(data.password ?? "").trim(),
    fullName: String(data.fullName ?? "").trim(),
    gender: Number(data.gender ?? 0),
    dob: data.dob ? String(data.dob).trim() : null,
    contactNumber: String(data.contactNumber ?? "").trim(),
    email: data.email ? String(data.email).trim() : null,
    nid: data.nid ? String(data.nid).trim() : null,
    address: String(data.address ?? "").trim(),
    joiningDate: String(data.joiningDate ?? "").trim(),
    rolesId: data.rolesId ?? [],
});


const normalizeUpdateStaffPayload = (
    data: UpdateStaffPayload
): UpdateStaffPayload => ({
    id: String(data.id ?? "").trim(),
    username: String(data.username ?? "").trim(),
    password: String(data.password ?? "").trim(),
    fullName: String(data.fullName ?? "").trim(),
    gender: Number(data.gender ?? 0),
    dob: data.dob ? String(data.dob).trim() : null,
    contactNumber: String(data.contactNumber ?? "").trim(),
    email: data.email ? String(data.email).trim() : null,
    nid: data.nid ? String(data.nid).trim() : null,
    address: String(data.address ?? "").trim(),
    joiningDate: String(data.joiningDate ?? "").trim(),
    rolesId: (data.rolesId ?? []).filter(Boolean),
});


export const useGetAllStaff = (queryParams?: string) => {
    return useQuery({
        queryKey: [...StaffQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${StaffEndpoints.filter}${queryParams}`
                : StaffEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<StaffResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}



export const useAddStaff = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddStaffPayload) => {
            const normalizedPayload = normalizeStaffPayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddStaffResponse>>(
                StaffEndpoints.add,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'Staff added successfully')

            queryClient.invalidateQueries({
                queryKey: StaffQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add Staff'
            )
        },
    })
}


export const useDeleteStaff = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(
                `${StaffEndpoints.delete}/${id}`
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'Staff deleted successfully')

            queryClient.invalidateQueries({
                queryKey: StaffQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to delete Staff'
            )
        },
    })
}

export const useUpdateStaff = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateStaffPayload
        }) => {
            const response = await api.patch(
                `${StaffEndpoints.update}/${id}`,
                normalizeUpdateStaffPayload(payload)
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'Staff updated successfully')

            queryClient.invalidateQueries({
                queryKey: StaffQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to update Staff'
            )
        },
    })
}
