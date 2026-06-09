import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddVisaApplicationPayload, VisaApplicationResponse,AddVisaApplicationResponse,UpdateVisaApplicationPayload } from '../types/IVisaApplication'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const VisaApplicationEndpoints = {
  filter: '/api/VisaApplication/FilterVisaApplication',
  add: '/api/VisaApplication/AddVisaApplication',
  update: '/api/VisaApplication/UpdateVisaApplication',
  delete: '/api/VisaApplication/DeleteVisaApplication',
  applicants: '/api/Enrolments/AllApplicant',
  country: '/api/AcademicPrograms/GetAllCountry',
  intake: '/api/AcademicPrograms/FilterIntake',
  visaStatus: '/api/VisaApplication/FilterVisaStatus',
    CourseByUniversity: '/api/AcademicPrograms/CourseByUniversity',
   UniversityByCountry: '/api/AcademicPrograms/UniversityByCountry'
}

export const VisaApplicationQueryKeys = {
  all: ['VisaApplication'],
  applicants: ['Applicants'],
   country: ['country'],
      intake: ['intake'],
       visaStatus: ['visaStatus']
}


const normalizeInvoicePayload = (
  data: AddVisaApplicationPayload
): AddVisaApplicationPayload => ({
 applicantId: data.applicantId,
  countryId: data.countryId,
  universityId: data.universityId,
  courseId: data.courseId,
  intakeId: data.intakeId,
  appliedDate: data.appliedDate,
  visaStatusId: data.visaStatusId,
  visaDetails: data.visaDetails,
  emailSent: data.emailSent,
  emailContent: data.emailContent

});



const normalizeUpdateInvoicePayload = (
  data: UpdateVisaApplicationPayload
): UpdateVisaApplicationPayload => ({
  applicantId: String(data.applicantId ?? '').trim(),
  countryId: String(data.countryId ?? '').trim(),
  universityId: String(data.universityId ?? '').trim(),
  courseId: String(data.courseId ?? '').trim(),
  intakeId: String(data.intakeId ?? '').trim(),
  appliedDate: String(data.appliedDate ?? '').trim(),
  visaStatusId: String(data.visaStatusId ?? '').trim(),
  emailSent: Boolean(data.emailSent),
  visaDetails: String(data.visaDetails ?? '').trim(),
  emailContent: String(data.emailContent ?? '').trim()
});


export const useGetAllVisaApplication = (queryParams?: string) => {
  return useQuery({
    queryKey: [...VisaApplicationQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<VisaApplicationResponse>>(
        VisaApplicationEndpoints.filter,
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


export const useAddVisaApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddVisaApplicationPayload) => {
      const normalizedPayload = normalizeInvoicePayload(payload)
      

      const response = await api.post<IPaginationCrmResponse<AddVisaApplicationResponse>>(
        VisaApplicationEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'VisaApplication added successfully')

      queryClient.invalidateQueries({
        queryKey: VisaApplicationQueryKeys.all,
      })
    },

    

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add VisaApplication'
      )
    },
  })
}


export const useDeleteVisaApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${VisaApplicationEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'VisaApplication deleted successfully')

      queryClient.invalidateQueries({
        queryKey: VisaApplicationQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete VisaApplication'
      )
    },
  })
}

export const useUpdateVisaApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateVisaApplicationPayload
    }) => {
      const response = await api.patch(
        `${VisaApplicationEndpoints.update}/${id}`,
        normalizeUpdateInvoicePayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'VisaApplication updated successfully')

      queryClient.invalidateQueries({
        queryKey: VisaApplicationQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update VisaApplication'
      )
    },
  })
}


export const useGetAllApplicants = () => {
  return useQuery({
    queryKey: VisaApplicationQueryKeys.applicants,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          fullName: string
        }>
      >(VisaApplicationEndpoints.applicants)

      return response.data
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  })
}


export const useGetAllCountry = () => {
  return useQuery({
    queryKey: VisaApplicationQueryKeys.country,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(VisaApplicationEndpoints.country, {
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


export const useGetAllIntake = () => {
  return useQuery({
    queryKey: VisaApplicationQueryKeys.intake,


    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          month: number
        }>
      >(VisaApplicationEndpoints.intake, {
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



export const useGetAllVisaStatus = () => {
  return useQuery({
    queryKey: [...VisaApplicationQueryKeys.visaStatus],

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(VisaApplicationEndpoints.visaStatus, {
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
        `${VisaApplicationEndpoints.CourseByUniversity}/${UniversityId}`,
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
         `${VisaApplicationEndpoints.UniversityByCountry}/${CountryId}`, {
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
