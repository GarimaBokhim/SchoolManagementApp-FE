import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import {ConvertApplicantPayload,ConvertApplicantResponse,ApplicantResponse,UpdateApplicantPayload, UserProfileResponse, DocumentStatusResponse, VisaRequirementByResponse, VisaDetailsByApplicant, updateSingleVisaStatusPayload} from '../types/IApplicants'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const ApplicantsEndpoints = {
  filter: '/api/Enrolments/FilterApplicants',
  add: '/api/Enrolments/AddApplicants',
  update: '/api/Enrolments/UpdateApplicants',
  delete: '/api/Enrolments/DeleteApplicants',
  getById:'/api/Enrolments/ApplicantsById',
  userProfile: '/api/Enrolments/UserProfile',
  documentStatus: '/api/AcademicPrograms/DocumentStatusByApplicant',
  visaRequirementsByDTOs: '/api/AcademicPrograms/VisaRequirementsByDTOs',
   visaDetails: '/api/VisaApplication/VisaDetailsByApplicant',
   UpdateSingleVisaStatus: '/api/VisaApplication/UpdateSingleVisaStatus',
      getalluserprofile:'/api/Enrolments/GetAllUserProfile'
  
}

export const ApplicantsQueryKeys = {
  all: ['Applicants'],
  documentStatus: ['DocumentStatus'],
  appointment: ['Appointment'],
  UserProfile: ['UserProfile'],
  Getalluserprofile: ['Getalluserprofile']
}

const normalizeUpdateSingleVisaStatusPayload = (data: updateSingleVisaStatusPayload): updateSingleVisaStatusPayload => ({
  id: String(data.id ?? '').trim(),
  status: Number(data.status ?? 0),
  emailContent:String(data.emailContent ?? '').trim(),

});

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
      const url = queryParams
        ? `${ApplicantsEndpoints.filter}${queryParams}`
        : ApplicantsEndpoints.filter
      const response =
        await api.get<IPaginationCrmResponse<ApplicantResponse>>(url)
      return response.data.Data
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export const useDocumentStatus = ({
  applicantId,
  pageIndex,
  pageSize,
}: {
  applicantId?: string;
  pageIndex: number;
  pageSize: number;
}) => {
  return useQuery({
    queryKey: [
      ...ApplicantsQueryKeys.documentStatus,
      applicantId,
      pageIndex,
      pageSize,
    ],

    enabled: !!applicantId,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<DocumentStatusResponse>
      >(ApplicantsEndpoints.documentStatus, {
        params: {
          applicantId,
          pageIndex,
          pageSize,
        },
      });

      return response.data;
    },

    select: (response) => ({
      items: response?.Data?.Items ?? [],
      pagination: response?.Data,
    }),
  });
};


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


export const useUpdateSingleVisaStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: updateSingleVisaStatusPayload  
    }) => {
      const response = await api.patch(
        `${ApplicantsEndpoints.UpdateSingleVisaStatus}/${id}`,
        normalizeUpdateSingleVisaStatusPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'SingleVisaStatus updated successfully')

      queryClient.invalidateQueries({
        queryKey: ApplicantsQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update SingleVisaStatus'
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

export const useGetAllUserProfile = () => {
  return useQuery({
    queryKey: ApplicantsQueryKeys.Getalluserprofile,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          fullName: string
        }>
      >(ApplicantsEndpoints.getalluserprofile, {
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


export const useGetVisaRequirements = (
  applicantId?: string | null
) => {
  return useQuery({
    queryKey: ['visaRequirementsDTOs', applicantId],
    queryFn: async () => {
      const { data } = await api.get<IPaginationCrmResponse<VisaRequirementByResponse>>(
        `${ApplicantsEndpoints.visaRequirementsByDTOs}?applicantId=${applicantId}`,
        {
          params: {
            pageSize: 10,
            pageIndex: 1,
            isPagination: false,
          },
        }
      )
      return data.Data
    },
    enabled: Boolean(applicantId),
  })
}

export const useVisaDetailsByApplicant = (ApplicantId: string | null) => {
  return useQuery({
    queryKey: ['VisaByApplicantId', ApplicantId],

    queryFn: async (): Promise<VisaDetailsByApplicant> => {
      if (!ApplicantId) {
        throw new Error('Id is required to get VisaDetails')
      }

      const response = await api.get<VisaDetailsByApplicant>(
        `${ApplicantsEndpoints.visaDetails}/${ApplicantId}`
      )

      return response.data
    },

    staleTime: 0,
    gcTime: 0, //
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })
}