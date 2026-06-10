import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import {ConvertApplicantPayload,ConvertApplicantResponse,ApplicantResponse,UpdateApplicantPayload, UserProfileResponse} from '../types/IApplicants'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const ApplicantsEndpoints = {
  filter: '/api/Enrolments/FilterApplicants',
  add: '/api/Enrolments/AddApplicants',
  update: '/api/Enrolments/UpdateApplicants',
  delete: '/api/Enrolments/DeleteApplicants',
  getById:'/api/Enrolments/ApplicantsById',
  userProfile: '/api/Enrolments/UserProfile',
  
}

export const ApplicantsQueryKeys = {
  all: ['Applicants'],
  appointment: ['Appointment'],
  UserProfile: ['UserProfile']
}

const normalizeUpdateApplicantsPayload = (data: UpdateApplicantPayload): UpdateApplicantPayload => ({
  id: String(data.id ?? '').trim(),
  userId: String(data.userId ?? '').trim(),
  passportNo: String(data.passportNo ?? '').trim(),
  countryId: String(data.countryId ?? '').trim(),
  universityId: String(data.universityId ?? '').trim(),
  courseId: String(data.courseId ?? '').trim()

});


const normalizeConvertApplicantsPayload = (data: ConvertApplicantPayload): ConvertApplicantPayload => ({
   userId: String(data.userId ?? '').trim(),
  passportNo: String(data.passportNo ?? '').trim(),
  countryId: String(data.countryId ?? '').trim(),
  universityId: String(data.universityId ?? '').trim(),
  courseId: String(data.courseId ?? '').trim()
});

export const useGetAllApplicants = (queryParams?: string) => {
  return useQuery({
    queryKey: [...ApplicantsQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<ApplicantResponse>>(
        ApplicantsEndpoints.filter,
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


export const useAddApplicants = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ConvertApplicantPayload) => {
      const normalizedPayload = normalizeConvertApplicantsPayload(payload)

      const response = await api.post<IPaginationCrmResponse<ConvertApplicantResponse>>(
        ApplicantsEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Applicants converted successfully')

      queryClient.invalidateQueries({
        queryKey: ApplicantsQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add Applicants'
      )
    },
  })
}


export const useDeleteApplicants = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${ApplicantsEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Applicants deleted successfully')

      queryClient.invalidateQueries({
        queryKey: ApplicantsQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Applicants'
      )
    },
  })
}

export const useUpdateApplicants = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateApplicantPayload
    }) => {
      const response = await api.patch(
        `${ApplicantsEndpoints.update}/${id}`,
        normalizeUpdateApplicantsPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Applicants updated successfully')

      queryClient.invalidateQueries({
        queryKey: ApplicantsQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Applicants'
      )
    },
  })
}


export const useApplicantsById = (ApplicantsId: string | null) => {
  return useQuery({
    queryKey: ["ApplicantsId", ApplicantsId],

    queryFn: async (): Promise<ApplicantResponse> => {
      if (!ApplicantsId) {
        throw new Error("Id is required to get Appointment");
      }

      const response = await api.get<ApplicantResponse>(
        `${ApplicantsEndpoints.getById}/${ApplicantsId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};


export const useUserProfileById = (userId: string | null) => {
  return useQuery({
    queryKey: ["UserProfile", userId],

    enabled: !!userId,

    queryFn: async (): Promise<UserProfileResponse> => {
      const response = await api.get<UserProfileResponse>(
        `${ApplicantsEndpoints.userProfile}/${userId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};