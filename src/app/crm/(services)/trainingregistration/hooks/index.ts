import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { UpdateTrainingRegistrationPayload,AddTrainingRegistrationPayload, AddTrainingRegistrationResponse, TrainingRegistrationResponse } from '../types/ITrainingRegistration'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const TrainingRegistrationEndpoints = {
  filter: '/api/Enrolments/FilterTrainingRegistration',
  add: '/api/Enrolments/AddTrainingRegistration',
  update: '/api/Enrolments/UpdateTrainingRegistration',
  delete: '/api/Enrolments/DeleteTrainingRegistration',
  applicants: '/api/Enrolments/AllApplicant',
  consultancyClass: '/api/Enrolments/FilterConsultancyClasss',
}

export const TrainingRegistrationQueryKeys = {
  all: ['TrainingRegistration'],
  applicants: ['Applicants'],
  consultancyClass: ['ConsultancyClass'],
}


const normalizeUpdateTrainingRegistrationPayload = (data: UpdateTrainingRegistrationPayload): UpdateTrainingRegistrationPayload => ({
  applicantId: String(data.applicantId ?? '').trim(),
  consultancyClassId: String(data.consultancyClassId ?? '').trim(),
  registeredAt: String(data.registeredAt ?? '').trim()
})


const normalizeTrainingRegistrationPayload = (data: AddTrainingRegistrationPayload): AddTrainingRegistrationPayload => ({
  applicantId: String(data.applicantId ?? '').trim(),
  consultancyClassId: String(data.consultancyClassId ?? '').trim(),
  registeredAt: String(data.registeredAt ?? '').trim()
})


export const useGetAllTrainingRegistration= (queryParams?: string) => {
  return useQuery({
    queryKey: [...TrainingRegistrationQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<TrainingRegistrationResponse>>(
        TrainingRegistrationEndpoints.filter,
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


export const useAddTrainingRegistration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddTrainingRegistrationPayload) => {
      const normalizedPayload = normalizeTrainingRegistrationPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddTrainingRegistrationResponse>>(
        TrainingRegistrationEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'TrainingRegistration added successfully')

      queryClient.invalidateQueries({
        queryKey: TrainingRegistrationQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add Training Registration'
      )
    },
  })
}


export const useDeleteTrainingRegistration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${TrainingRegistrationEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'TrainingRegistration deleted successfully')

      queryClient.invalidateQueries({
        queryKey: TrainingRegistrationQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete TrainingRegistration'
      )
    },
  })
}

export const useUpdateTrainingRegistration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateTrainingRegistrationPayload
    }) => {
      const response = await api.patch(
        `${TrainingRegistrationEndpoints.update}/${id}`,
        normalizeUpdateTrainingRegistrationPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Training Registration updated successfully')

      queryClient.invalidateQueries({
        queryKey: TrainingRegistrationQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Training Registration'
      )
    },
  })
}


export const useGetAllApplicants = () => {
  return useQuery({
    queryKey: TrainingRegistrationQueryKeys.applicants,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          fullName: string
        }>
      >(TrainingRegistrationEndpoints.applicants)

      return response.data
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  })
}

export const useGetAllConsultancyClass = () => {
  return useQuery({
    queryKey: TrainingRegistrationQueryKeys.consultancyClass,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(TrainingRegistrationEndpoints.consultancyClass, {
        params: {
          pageSize: 10,
          pageIndex: 1,
          isPagination: true,
        },
      });

      return response.data;
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  });
};
