import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddAppointmentPayload, AppointmentResponse, UpdateAppointmentPayload, AddAppointmentResponse, LeadEnquiryDetailsResponse, CountryResponse, CourseResponse, UniversityResponse, InquiryResponse, ConvertToApplicantPayload, ConvertToApplicantResponse, FollowUpFilters, FollowUpResponse, UpdateFollowUpPayload, AddFollowUpPayload, AddFollowUpResponse } from '../types/IAppointment'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import { UpdatePaymentsPayload } from '@/app/crm/(finance)/payments/types/IPayments'


export const AppointmentEndpoints = {
  filter: '/api/Enrolments/FilterAppointments',
  add: '/api/Enrolments/AddAppointment',
  update: '/api/Enrolments/UpdateAppointments',
  delete: '/api/Enrolments/DeleteAppointments',
  getById:'/api/Enrolments/AppointmentsById',
  filterCouncellor:'/api/Enrolments/FilterCounselor',
  filterLead:'/api/Enrolments/FilterInquery',
  LeadDetails:'/api/Enrolments/ShowLeadEnqueryDetails',

   addFollowUp: '/api/Enrolments/AddFollowUp',

  filterFollowUps: '/api/Enrolments/FilterFollowUps',

  ConvertToApplicant:'/api/Enrolments/ConvertToApplicant',

  getByCountry:'/api/AcademicPrograms/CountryById',
  getByCourse:'/api/AcademicPrograms/CourseById',
  getByUniversity:'/api/AcademicPrograms/UniversityById',

    CourseByUniversity: '/api/AcademicPrograms/CourseByUniversity',
   UniversityByCountry: '/api/AcademicPrograms/UniversityByCountry',


  country:'/api/AcademicPrograms/GetAllCountry',
  course:'/api/AcademicPrograms/FilterCourse',
  university:'/api/AcademicPrograms/FilterUniversity',
    userprofile:'/api/Enrolments/GetAllUserProfile'
}

export const AppointmentQueryKeys = {
  all: ['Appointment'],
  applicants: ['Applicants'],
  appointmentById: ['AppointmentById'],
  councellorId: ['AouncellorId'],
  leadId: ['LeadId'],
  country: ['Country'],
  course: ['Course'],
  university: ['University'],
    UserProfile: ['UserProfile'],
    followUp: ['FollowUp']
}

const normalizeUpdateAppointmentPayload = (data: UpdateAppointmentPayload): UpdateAppointmentPayload => ({
  id: String(data.id ?? '').trim(),
  leadId: String(data.leadId ?? '').trim(),
  appointmentDate: String(data.appointmentDate ?? '').trim(),
  counselorId: String(data.counselorId ?? '').trim(),
  notes: String(data.notes ?? '').trim(),
  appointmentStatus: Number(data.appointmentStatus ?? 0)
});


const normalizeAppointmentPayload = (data: AddAppointmentPayload): AddAppointmentPayload => ({
  leadId: String(data.leadId ?? '').trim(),
  appointmentDate: String(data.appointmentDate ?? '').trim(),
  counselorId: String(data.counselorId ?? '').trim(),
  notes: String(data.notes ?? '').trim(),
  appointmentStatus: Number(data.appointmentStatus ?? 0)

});


const normalizeConvertToApplicantPayload = (data: ConvertToApplicantPayload): ConvertToApplicantPayload => ({
  userId: String(data.userId ?? '').trim(),
  passportNo: String(data.passportNo ?? '').trim(),
  countryId: String(data.countryId ?? '').trim(),
  universityId: String(data.universityId ?? '').trim(),
  courseId: String(data.courseId ?? '').trim()

});


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


export const useGetAllAppointment = (queryParams?: string) => {
  return useQuery({
    queryKey: [...AppointmentQueryKeys.all, queryParams],
    queryFn: async () => {
      const url = queryParams
        ? `${AppointmentEndpoints.filter}${queryParams}`
        : AppointmentEndpoints.filter
      const response =
        await api.get<IPaginationCrmResponse<AppointmentResponse>>(url)
      return response.data.Data
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}


export const useAddAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddAppointmentPayload) => {
      const normalizedPayload = normalizeAppointmentPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddAppointmentResponse>>(
        AppointmentEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Appointment added successfully')

      queryClient.invalidateQueries({
        queryKey: AppointmentQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add Appointment'
      )
    },
  })
}

export const useConvertToApplicant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ConvertToApplicantPayload) => {
      const normalizedPayload = normalizeConvertToApplicantPayload(payload)

      const response = await api.post<IPaginationCrmResponse<ConvertToApplicantResponse>>(
        AppointmentEndpoints.ConvertToApplicant,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'ConvertToApplicant successfully')

      queryClient.invalidateQueries({
        queryKey: AppointmentQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to ConvertToApplicant'
      )
    },
  })
}


export const useDeleteAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${AppointmentEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Appointment deleted successfully')

      queryClient.invalidateQueries({
        queryKey: AppointmentQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Appointment'
      )
    },
  })
}

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateAppointmentPayload
    }) => {
      const response = await api.patch(
        `${AppointmentEndpoints.update}/${id}`,
        normalizeUpdateAppointmentPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Appointments updated successfully')

      queryClient.invalidateQueries({
        queryKey: AppointmentQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Appointments'
      )
    },
  })
}


export const useAppointentById = (AppointmentId: string | null) => {
  return useQuery({
    queryKey: ["AppointmentId", AppointmentId],

    queryFn: async (): Promise<AppointmentResponse> => {
      if (!AppointmentId) {
        throw new Error("Id is required to get Appointment");
      }

      const response = await api.get<AppointmentResponse>(
        `${AppointmentEndpoints.getById}/${AppointmentId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useCountryById = (CounrtyId: string | null) => {
  return useQuery({
    queryKey: ["CountryId", CounrtyId],

    queryFn: async (): Promise<CountryResponse> => {
      if (!CounrtyId) {
        throw new Error("Id is required to get Appointment");
      }

      const response = await api.get<CountryResponse>(
        `${AppointmentEndpoints.getByCountry}/${CounrtyId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};


export const useCourseById = (CourseId: string | null) => {
  return useQuery({
    queryKey: ["CourseId", CourseId],

    queryFn: async (): Promise<CourseResponse> => {
      if (!CourseId) {
        throw new Error("Id is required to get Appointment");
      }

      const response = await api.get<CourseResponse>(
        `${AppointmentEndpoints.getByCourse}/${CourseId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};



export const useUniversityById = (UniversityId: string | null) => {
  return useQuery({
    queryKey: ["UniversityId", UniversityId],

    queryFn: async (): Promise<UniversityResponse> => {
      if (!UniversityId) {
        throw new Error("Id is required to get Appointment");
      }

      const response = await api.get<UniversityResponse>(
        `${AppointmentEndpoints.getByUniversity}/${UniversityId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};




export const useGetAllCouncellor = () => {
  return useQuery({
    queryKey: AppointmentQueryKeys.councellorId,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          fullName: string
        }>
      >(AppointmentEndpoints.filterCouncellor, {
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


export const useGetAllLead = () => {
  return useQuery({
    queryKey: AppointmentQueryKeys.leadId,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          fullName: string
        }>
      >(AppointmentEndpoints.filterLead, {
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



export const useLeadEnquiryDetailsById = (LeadId: string | null) => {
  return useQuery({
    queryKey: ["LeadEnquiryDetails", LeadId],

    enabled: !!LeadId,

    queryFn: async (): Promise<LeadEnquiryDetailsResponse> => {
      const response = await api.get<{
        Data: LeadEnquiryDetailsResponse;
        Message: string;
        StatusCode: number;
      }>(
        `${AppointmentEndpoints.LeadDetails}?leadId=${LeadId}`
      );

      return response.data.Data;
    },

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};



export const useGetAllCountry = () => {
  return useQuery({
    queryKey: AppointmentQueryKeys.country,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(AppointmentEndpoints.country, {
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

export const useGetAllCourse = () => {
  return useQuery({
    queryKey: AppointmentQueryKeys.course,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          title: string
        }>
      >(AppointmentEndpoints.course, {
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


export const useGetAllUniversity = () => {
  return useQuery({
    queryKey: AppointmentQueryKeys.university,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(AppointmentEndpoints.university, {
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


export const useGetCourseByUniversity = (UniversityId?: string | null) => {
  return useQuery({
     queryKey: ["UniversityId", UniversityId],

    queryFn: async () => {
      if (!UniversityId) {
        throw new Error("Id is required to get Course");
      }
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string;
          title: string;
        }>
      >(
        `${AppointmentEndpoints.CourseByUniversity}/${UniversityId}`,
        {
          params: {
            pageSize: 10,
            pageIndex: 1,
            isPagination: false,
          },
        }
      );

      return response.data;
    },

    select: (response) => response?.Data.Items ?? [],
    enabled: !!UniversityId, 
    staleTime: 1000 * 60 * 5,
  });
};




export const useGetUniversityByCountry = (CountryId?: string | null) => {
  return useQuery({
     queryKey: ["CountryId", CountryId],

    queryFn: async () => {
      if (!CountryId) {
        throw new Error("Id is required to get University");
      }
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(
         `${AppointmentEndpoints.UniversityByCountry}/${CountryId}`, {
        params: {
          pageSize: 10,
          pageIndex: 1,
          isPagination: false,
        },
      });

      return response.data;
    },

    select: (response) => response?.Data.Items ?? [],
    enabled: !!CountryId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAllUserProfile = () => {
  return useQuery({
    queryKey: AppointmentQueryKeys.UserProfile,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          fullName: string
        }>
      >(AppointmentEndpoints.userprofile, {
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


export const useGetAllFollowUp = (queryParams?: string) => {
  return useQuery({
    queryKey: [...AppointmentQueryKeys.all, queryParams],
    queryFn: async () => {
      const url = queryParams
        ? `${AppointmentEndpoints.filterFollowUps}${queryParams}`
        : AppointmentEndpoints.filterFollowUps
      const response =
        await api.get<IPaginationCrmResponse<FollowUpResponse>>(url)
      return response.data.Data
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}


export const useAddFollowUp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddFollowUpPayload) => {
      const normalizedPayload = normalizeFollowUpPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddFollowUpResponse>>(
        AppointmentEndpoints.addFollowUp,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'FollowUp added successfully')

      queryClient.invalidateQueries({
        queryKey: AppointmentQueryKeys.followUp,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add FollowUp'
      )
    },
  })
}

