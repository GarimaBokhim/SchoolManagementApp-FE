import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import {AddFollowUpPayload,AddFollowUpResponse,FollowUpResponse,UpdateFollowUpPayload} from '../types/IFollowUp'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import { UpdatePaymentsPayload } from '@/app/crm/(finance)/payments/types/IPayments'


export const FollowUpEndpoints = {
  filter: '/api/Enrolments/FilterFollowUps',
  add: '/api/Enrolments/AddFollowUp',
  update: '/api/Enrolments/UpdateFollowUp',
  delete: '/api/Enrolments/DeleteFollowUp',
  getById:'/api/Enrolments/FollowUpById',
   appointment:'/api/Enrolments/FilterAppointments',
    userprofile:'/api/Enrolments/GetAllUserProfile'
  
}

export const FollowUpQueryKeys = {
  all: ['FollowUp'],
  appointment: ['Appointment'],
  UserProfile: ['UserProfile']
}

const normalizeUpdateFollowUpPayload = (data: UpdateFollowUpPayload): UpdateFollowUpPayload => ({
  id: String(data.id ?? '').trim(),
  userId: String(data.userId ?? '').trim(),
  startTime: String(data.startTime ?? '').trim(),
  endTime: String(data.endTime ?? '').trim(),
  followUpDate: String(data.followUpDate ?? '').trim(),
  notes: String(data.notes ?? '').trim(),
  followUpStatus: Number(data.followUpStatus ?? 0),
    appointmentId: String(data.appointmentId ?? '').trim()
});


const normalizeFollowUpPayload = (data: AddFollowUpPayload): AddFollowUpPayload => ({
  userId: String(data.userId ?? '').trim(),
  startTime: String(data.startTime ?? '').trim(),
  endTime: String(data.endTime ?? '').trim(),
  followUpDate: String(data.followUpDate ?? '').trim(),
  notes: String(data.notes ?? '').trim(),
    followUpStatus: Number(data.followUpStatus ?? 0),
  appointmentId: String(data.appointmentId ?? '').trim()


});

export const useGetAllFollowUp = (queryParams?: string) => {
  return useQuery({
    queryKey: [...FollowUpQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<FollowUpResponse>>(
        FollowUpEndpoints.filter,
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


export const useAddFollowUp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddFollowUpPayload) => {
      const normalizedPayload = normalizeFollowUpPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddFollowUpResponse>>(
        FollowUpEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'FollowUp added successfully')

      queryClient.invalidateQueries({
        queryKey: FollowUpQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add FollowUp'
      )
    },
  })
}


export const useDeleteFollowUp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${FollowUpEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'FollowUp deleted successfully')

      queryClient.invalidateQueries({
        queryKey: FollowUpQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete FollowUp'
      )
    },
  })
}

export const useUpdateFollowUp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateFollowUpPayload
    }) => {
      const response = await api.patch(
        `${FollowUpEndpoints.update}/${id}`,
        normalizeUpdateFollowUpPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'FollowUp updated successfully')

      queryClient.invalidateQueries({
        queryKey: FollowUpQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update FollowUp'
      )
    },
  })
}


export const useFollowUpById = (FollowUpId: string | null) => {
  return useQuery({
    queryKey: ["FollowUpId", FollowUpId],

    queryFn: async (): Promise<FollowUpResponse> => {
      if (!FollowUpId) {
        throw new Error("Id is required to get Appointment");
      }

      const response = await api.get<FollowUpResponse>(
        `${FollowUpEndpoints.getById}/${FollowUpId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};




export const useGetAllUserProfile = () => {
  return useQuery({
    queryKey: FollowUpQueryKeys.UserProfile,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          fullName: string
        }>
      >(FollowUpEndpoints.userprofile, {
        params: {
          pageSize: 10,
          pageIndex: 1,
          isPagination: false,
        },
      });

      return response.data;
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  });
};


export const useGetAllAppointments = () => {
  return useQuery({
    queryKey: FollowUpQueryKeys.appointment,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          counselorName: string
          appointmentDate: string
        }>
      >(FollowUpEndpoints.appointment, {
        params: {
          pageSize: 10,
          pageIndex: 1,
          isPagination: false,
        },
      });

      return response.data;
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  });
};
