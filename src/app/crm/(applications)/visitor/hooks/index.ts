import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import {AddInquiryPayload,AddInquiryPayloadResponse,ConversionPayload,ConversionResponse,InquiryResponse, UpdateInquiryPayload } from '../types/IVisitors'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const InquiryEndpoints = {
  filter: '/api/Enrolments/FilterInquery',
  add: '/api/Enrolments/AddInquiry',
  update: '/api/CrmFinance/UpdateInvoice',
  delete: '/api/CrmFinance/DeleteInvoice',
  getInquiryById:'/api/Enrolments/Inquiry',
  filterDocumentType:'/api/AcademicPrograms/FilterDocumentsType',

  RequiredDocType:'/api/AcademicPrograms/RequiredDocType',
  NonRequiredDocType:'/api/AcademicPrograms/NonRequiredDocType',
  convertToApplicant:'/api/Enrolments/ConvertToApplicant',

  country:'/api/AcademicPrograms/GetAllCountry',
  course:'/api/AcademicPrograms/FilterCourse',
  university:'/api/AcademicPrograms/FilterUniversity',

  CourseByUniversity: '/api/AcademicPrograms/CourseByUniversity',
  UniversityByCountry: '/api/AcademicPrograms/UniversityByCountry'

}

export const InquiryQueryKeys = {
  all: ['Inquiry'],
  country: ['Country'],
  course: ['Course'],
  university: ['University'],
  requirementsById: ['InvoiceByIds'],
  documentType:["DocumentType"],
  convertToApplicant:["ConvertToApplicant"]
}

export const normalizeConvertToApplicantPayload = (data: ConversionPayload): ConversionPayload => ({
  passportNo: String(data.passportNo ?? '').trim(),
  countryId: String(data.countryId ?? '').trim(),
  universityId: String(data.universityId ?? '').trim(),
  courseId: String(data.courseId ?? '').trim()
});

export const normalizeUpdateInquiryPayload = (data: UpdateInquiryPayload): UpdateInquiryPayload => ({
  id: String(data.id ?? '').trim(),
  fullName: String(data.fullName ?? '').trim(),
  email: String(data.email ?? '').trim(),
  dateOfBirth: String(data.dateOfBirth ?? '').trim(),
  gender: Number(data.gender ?? 0),
  contactNumber: String(data.contactNumber ?? '').trim(),
  permanentAddress: String(data.permanentAddress ?? '').trim(),
  educationLevel: Number(data.educationLevel ?? 0),
  englishProficiency: Number(data.englishProficiency ?? 0),
  bandScore: Number(data.bandScore ?? 0),
  languageRemarks: String(data.languageRemarks ?? '').trim(),
  skillOrTrainingName: String(data.skillOrTrainingName ?? '').trim(),
  institutionName: String(data.institutionName ?? '').trim(),
  trainingRemarks: String(data.trainingRemarks ?? '').trim(),
  trainingStartDate: String(data.trainingStartDate ?? '').trim(),
  trainingEndDate: String(data.trainingEndDate ?? '').trim(),
  completionYear: String(data.completionYear ?? '').trim(),
  currentGpa: String(data.currentGpa ?? '').trim(),
  previousAcademicQualification: String(data.previousAcademicQualification ?? '').trim(),
  source: String(data.source ?? '').trim(),
  feedBackOrSuggestion: String(data.feedBackOrSuggestion ?? '').trim(),
  countries: (data.countries ?? []).map(country => ({
    countryId: String(country.countryId ?? '').trim(),
    universities: (country.universities ?? []).map(university => ({
      universityId: String(university.universityId ?? '').trim(),
      courseIds: (university.courseIds ?? []).map(courseId =>
        String(courseId ?? '').trim()
      ),
    })),
  })),
});


export const normalizeAddInquiryPayload = (data: AddInquiryPayload): AddInquiryPayload => ({
  fullName: String(data.fullName ?? "").trim(),
  email: String(data.email ?? "").trim(),
  dateOfBirth: String(data.dateOfBirth ?? "").trim(),
  gender: Number(data.gender ?? 0),
  contactNumber: String(data.contactNumber ?? "").trim(),
  permanentAddress: String(data.permanentAddress ?? "").trim(),
  educationLevel: Number(data.educationLevel ?? 0),
  englishProficiency: Number(data.englishProficiency ?? 0),
  bandScore: Number(data.bandScore ?? 0),
  languageRemarks: String(data.languageRemarks ?? "").trim(),
  skillOrTrainingName: String(data.skillOrTrainingName ?? "").trim(),
  institutionName: String(data.institutionName ?? "").trim(),
  trainingRemarks: String(data.trainingRemarks ?? "").trim(),
  trainingStartDate: String(data.trainingStartDate ?? "").trim(),
  trainingEndDate: String(data.trainingEndDate ?? "").trim(),
  completionYear: String(data.completionYear ?? "").trim(),
  currentGpa: String(data.currentGpa ?? "").trim(),
  previousAcademicQualification: String(data.previousAcademicQualification ?? "").trim(),
  source: String(data.source ?? "").trim(),
  feedBackOrSuggestion: String(data.feedBackOrSuggestion ?? "").trim(),

  countries: (data.countries ?? []).map((country) => ({
    countryId: String(country.countryId ?? "").trim(),

    universities: (country.universities ?? []).map((university) => ({
      universityId: String(university.universityId ?? "").trim(),

      courseIds: (university.courseIds ?? []).map((courseId) =>
        String(courseId ?? "").trim()
      ),
    })),
  })),
});

export const useGetAllInquiry = (queryParams?: string) => {
  return useQuery({
    queryKey: [...InquiryQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<InquiryResponse>>(
        InquiryEndpoints.filter,
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

export const useConvertToApplicant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ConversionPayload) => {
      const normalizedPayload = normalizeConvertToApplicantPayload(payload)

      const response = await api.post<IPaginationCrmResponse<ConversionResponse>>(
        InquiryEndpoints.convertToApplicant,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Convert to applicant successfully')

      queryClient.invalidateQueries({
        queryKey: InquiryQueryKeys.convertToApplicant,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to cinvert'
      )
    },
  })
}


export const useAddInquiry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddInquiryPayload) => {
      const normalizedPayload = normalizeAddInquiryPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddInquiryPayloadResponse>>(
        InquiryEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Inquiry added successfully')

      queryClient.invalidateQueries({
        queryKey: InquiryQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add Inquiry'
      )
    },
  })
}

export const useDeleteInquiry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${InquiryEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Inquiry deleted successfully')

      queryClient.invalidateQueries({
        queryKey: InquiryQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Inquiry'
      )
    },
  })
}

export const useUpdateInquiry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateInquiryPayload
    }) => {
      const response = await api.patch(
        `${InquiryEndpoints.update}/${id}`,
        normalizeUpdateInquiryPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Inquiry updated successfully')

      queryClient.invalidateQueries({
        queryKey: InquiryQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Inquiry'
      )
    },
  })
}


export const useInquiryById = (InquiryId: string) => {
  return useQuery({
    queryKey: ["InquiryId", InquiryId],

    queryFn: async (): Promise<InquiryResponse> => {
      if (!InquiryId) {
        throw new Error("Id is required to get Inquiry");
      }

      const response = await api.get<InquiryResponse>(
        `${InquiryEndpoints.getInquiryById}/${InquiryId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useGetAllCountry = () => {
  return useQuery({
    queryKey: InquiryQueryKeys.country,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(InquiryEndpoints.country, {
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
    queryKey: InquiryQueryKeys.course,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          title: string
        }>
      >(InquiryEndpoints.course, {
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
    queryKey: InquiryQueryKeys.university,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(InquiryEndpoints.university, {
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


export const useGetCourseByUniversity = async (UniversityId?: string | null) => {

      const response = await api.get(
    `${InquiryEndpoints.CourseByUniversity}/${UniversityId}`,
    {
      params: {
        pageSize: 10,
        pageIndex: 1,
        isPagination: false,
      },
    }
  );

  return response.data?.Data?.Items ?? [];
};

export const useGetUniversityByCountry = async (CountryId?: string | null) => {
      const response = await api.get(
        `${InquiryEndpoints.UniversityByCountry}/${CountryId}`,
        {
          params: {
            pageSize: 10,
            pageIndex: 1,
            isPagination: false,
          },
        }
      );

      return response.data?.Data?.Items ?? [];
};

