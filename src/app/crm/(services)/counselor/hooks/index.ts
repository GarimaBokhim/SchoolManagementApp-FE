import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddCounselorPayload, AddCounselorResponse, CounselorResponse, UpdateCounselorPayload } from '../types/ICounselor'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const CounselorEndpoints = {
  filter: '/api/Enrolments/FilterCounselor',
  add: '/api/Enrolments/AddCounselor',
  update: '/api/Enrolments/UpdateInvoice',
  delete: '/api/Enrolments/DeleteInvoice',
  getById:'/api/Enrolments/DeleteInvoice'
}

export const CounselorQueryKeys = {
  all: ['Counselor']
}

const normalizeUpdateCounselorPayload = (data: UpdateCounselorPayload): UpdateCounselorPayload => ({
  id: String(data.id ?? '').trim(),
  fullName: String(data.fullName ?? '').trim(),
  email: String(data.email ?? '').trim(),
  contactNumber: String(data.contactNumber ?? '').trim()
});


const normalizeCounselorPayload = (data: AddCounselorPayload): AddCounselorPayload => ({
  fullName: String(data.fullName ?? '').trim(),
  email: String(data.email ?? '').trim(),
  contactNumber: String(data.contactNumber ?? '').trim()
});

export const useGetAllCounselor = (queryParams?: string) => {
  return useQuery({
    queryKey: [...CounselorQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<CounselorResponse>>(
        CounselorEndpoints.filter,
        { params }
      )

      return response.data
    },

    select: (response) => ({
      items: response?.Data?.Items ?? [],
      pagination: {
        totalItems: response?.Data?.TotalItems ?? 0,
        pageIndex: response?.Data?.PageIndex ?? 1,
        pageSize: response?.Data?.pageSize ?? 10,
        totalPages: response?.Data?.TotalPages ?? 1,
      },
      message: response?.Message ?? '',
      statusCode: response?.StatusCode ?? 200,
    }),

    staleTime: 1000 * 60 * 5,
  })
}


export const useAddCounselor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddCounselorPayload) => {
      const normalizedPayload = normalizeCounselorPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddCounselorResponse>>(
        CounselorEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Counselor added successfully')

      queryClient.invalidateQueries({
        queryKey: CounselorQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add Counselor'
      )
    },
  })
}


export const useDeleteCounselor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${CounselorEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Counselor deleted successfully')

      queryClient.invalidateQueries({
        queryKey: CounselorQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Counselor'
      )
    },
  })
}

export const useUpdateCounselor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCounselorPayload
    }) => {
      const response = await api.patch(
        `${CounselorEndpoints.update}/${id}`,
        normalizeUpdateCounselorPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Counselor updated successfully')

      queryClient.invalidateQueries({
        queryKey: CounselorQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Counselor'
      )
    },
  })
}


export const useCounselorById = (CounselorId: string) => {
  return useQuery({
    queryKey: ["CounselorId", CounselorId],

    queryFn: async (): Promise<CounselorResponse> => {
      if (!CounselorId) {
        throw new Error("Id is required to get Counselor");
      }

      const response = await api.get<CounselorResponse>(
        `${CounselorEndpoints.getById}/${CounselorId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};


