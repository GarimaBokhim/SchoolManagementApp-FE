import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddVisaStatusResponse, VisaStatusResponse,UpdateVisaStatusResponse,UpdateVisaStatusPayload ,AddVisaStatusPayload} from '../types/IVisaStatus'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const VisaStatusEndpoints = {
  filter: '/api/VisaApplication/FilterVisaStatus',
  add: '/api/VisaApplication/AddVisaStatus',
  update: '/api/VisaApplication/UpdateVisaStatus',
  delete: '/api/VisaApplication/DeleteVisaStatus',
}

export const VisaStatusQueryKeys = {
  all: ['VisaStatus'],
}


const normalizeVisaStatusPayload = (
  data: AddVisaStatusPayload
): AddVisaStatusPayload => ({
  name: String(data.name ?? '').trim(),
  visaStatusType: Number(data.visaStatusType ?? 0)
});



const normalizeUpdateVisaStatusPayload = (
  data: UpdateVisaStatusPayload
): UpdateVisaStatusPayload => ({
  name: String(data.name ?? '').trim(),
  visaStatusType: Number(data.visaStatusType ?? 0)
});


export const useGetAllVisaStatus = (queryParams?: string) => {
  return useQuery({
    queryKey: [...VisaStatusQueryKeys.all, queryParams],
    queryFn: async () => {
      const url = queryParams
        ? `${VisaStatusEndpoints.filter}${queryParams}`
        : VisaStatusEndpoints.filter
      const response =
        await api.get<IPaginationCrmResponse<VisaStatusResponse>>(url)
      return response.data.Data
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}



export const useAddVisaStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddVisaStatusPayload) => {
      const normalizedPayload = normalizeVisaStatusPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddVisaStatusResponse>>(
        VisaStatusEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'VisaStatus added successfully')

      queryClient.invalidateQueries({
        queryKey: VisaStatusQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add VisaStatus'
      )
    },
  })
}


export const useDeleteVisaStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${VisaStatusEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'VisaStatus deleted successfully')

      queryClient.invalidateQueries({
        queryKey: VisaStatusQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete VisaStatus'
      )
    },
  })
}

export const useUpdateVisaStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateVisaStatusPayload
    }) => {
      const response = await api.patch(
        `${VisaStatusEndpoints.update}/${id}`,
        normalizeUpdateVisaStatusPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'VisaStatus updated successfully')

      queryClient.invalidateQueries({
        queryKey: VisaStatusQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update VisaStatus'
      )
    },
  })
}
