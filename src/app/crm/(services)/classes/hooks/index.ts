import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddClassPayload, AddClassResponse, ClassResponse, UpdateClassPayload } from '../types/IClass'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const ClassEndpoints = {
  filter: '/api/Enrolments/FilterConsultancyClasss',
  add: '/api/Enrolments/AddConsultancyClass',
  update: '/api/Enrolments/UpdateInvoice',
  delete: '/api/Enrolments/DeleteInvoice'
}

export const ClassQueryKeys = {
  all: ['Class']
}

const normalizeUpdateClassPayload = (data: UpdateClassPayload): UpdateClassPayload => ({
  name: String(data.name ?? '').trim(),
 endTime: String(data.endTime ?? '').trim(),
  startTime: String(data.startTime ?? '').trim(),
  batch: String(data.batch ?? '').trim(),
  englishProficiency: Number(data.englishProficiency ?? 0),
})


const normalizeClassPayload = (data: AddClassPayload): AddClassPayload => ({
  name: String(data.name ?? '').trim(),
 endTime: String(data.endTime ?? '').trim(),
  startTime: String(data.startTime ?? '').trim(),
  batch: String(data.batch ?? '').trim(),
  englishProficiency: Number(data.englishProficiency ?? 0),
})

export const useGetAllClass = (queryParams?: string) => {
  return useQuery({
    queryKey: [...ClassQueryKeys.all, queryParams],
    queryFn: async () => {
      const url = queryParams
        ? `${ClassEndpoints.filter}${queryParams}`
        : ClassEndpoints.filter
      const response =
        await api.get<IPaginationCrmResponse<ClassResponse>>(url)
      return response.data.Data
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export const useAddClass = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddClassPayload) => {
      const normalizedPayload = normalizeClassPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddClassResponse>>(
        ClassEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Class added successfully')

      queryClient.invalidateQueries({
        queryKey: ClassQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add Class'
      )
    },
  })
}


export const useDeleteClass = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${ClassEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Class deleted successfully')

      queryClient.invalidateQueries({
        queryKey: ClassQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Class'
      )
    },
  })
}

export const useUpdateClass = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateClassPayload
    }) => {
      const response = await api.patch(
        `${ClassEndpoints.update}/${id}`,
        normalizeUpdateClassPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Class updated successfully')

      queryClient.invalidateQueries({
        queryKey: ClassQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Class'
      )
    },
  })
}
