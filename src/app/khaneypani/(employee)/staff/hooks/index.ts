import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddStaffPayload, AddStaffResponse, StaffResponse, UpdateStaffPayload } from '../types/IStaff'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const StaffEndpoints = {
  filter: '/api/KhaneyPaniStaff/FilterStaff',
  add: '/api/KhaneyPaniStaff/AddStaff',
  update: '/api/KhaneyPaniStaff/UpdateStaff',
  delete: '/api/KhaneyPaniStaff/DeleteStaff',
  getAllRoles: "/api/Authentication/all-roles",
}

export const StaffQueryKeys = {
  all: ['Staff'],
   roles: ['Roles']
}

const normalizeUpdateStaffPayload = (data: UpdateStaffPayload): UpdateStaffPayload => ({
  id: String(data.id ?? "").trim(),
  username: String(data.username ?? "").trim(),
  password: String(data.password ?? "").trim(),
  employeeCode: String(data.employeeCode ?? "").trim(),
  fullName: String(data.fullName ?? "").trim(),
  gender: Number(data.gender ?? 0),
  dob: String(data.dob ?? "").trim(),
  contactNumber: String(data.contactNumber ?? "").trim(),
  email: String(data.email ?? "").trim(),
  nid: String(data.nid ?? "").trim(),
  address: String(data.address ?? "").trim(),
  joiningDate: String(data.joiningDate ?? "").trim(),
  tole: String(data.tole ?? "").trim(),
  registrationDate: String(data.registrationDate ?? "").trim(),

  rolesId: Array.isArray(data.rolesId)
    ? data.rolesId
        .filter((role) => role != null)
        .map((role) => String(role).trim())
    : [],
});


const normalizeStaffPayload = (data: AddStaffPayload): AddStaffPayload => ({
  username: String(data.username ?? "").trim(),
  password: String(data.password ?? "").trim(),
  employeeCode: String(data.employeeCode ?? "").trim(),
  fullName: String(data.fullName ?? "").trim(),
  gender: Number(data.gender ?? 0),
  dob: String(data.dob ?? "").trim(),
  contactNumber: String(data.contactNumber ?? "").trim(),
  email: String(data.email ?? "").trim(),
  nid: String(data.nid ?? "").trim(),
  address: String(data.address ?? "").trim(),
  joiningDate: String(data.joiningDate ?? "").trim(),
  tole: String(data.tole ?? "").trim(),
  registrationDate: String(data.registrationDate ?? "").trim(),

  rolesId: Array.isArray(data.rolesId)
    ? data.rolesId
        .filter((role) => role != null)
        .map((role) => String(role).trim())
    : [],
})

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

export interface Role {
  id: string;
  name: string;
}

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: StaffQueryKeys.roles,

    queryFn: async () => {
      const { data } = await api.get<{
        Items: {
          Id: string;
          Name: string;
        }[];
        TotalItems: number;
        PageIndex: number;
        pageSize: number;
        TotalPages: number;
        FirstPage: number;
        LastPage: number;
      }>(StaffEndpoints.getAllRoles);

      return data;
    },

    select: (response): Role[] =>
      response.Items.map((role) => ({
        id: role.Id,
        name: role.Name,
      })),

    staleTime: 1000 * 60 * 5,
  });
};
