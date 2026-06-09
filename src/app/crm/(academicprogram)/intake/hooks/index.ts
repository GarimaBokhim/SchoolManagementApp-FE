import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import {AddIntakePayload,AddIntakeResponse,IntakeResponse,UpdateIntakePayload} from '../types/IIntake'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import { UpdatePaymentsPayload } from '@/app/crm/(finance)/payments/types/IPayments'


export const IntakeEndpoints = {
  filter: '/api/AcademicPrograms/FilterIntake',
  add: '/api/AcademicPrograms/AddIntake',
  update: '/api/AcademicPrograms/UpdateIntake',
  delete: '/api/AcademicPrograms/DeleteIntake',
  getById:'/api/AcademicPrograms/IntakeById',
   appointment:'/api/Enrolments/FilterAppointments',
    userprofile:'/api/Enrolments/GetAllUserProfile',

    country:'/api/AcademicPrograms/GetAllCountry',
 CourseByUniversity: '/api/AcademicPrograms/CourseByUniversity',
   UniversityByCountry: '/api/AcademicPrograms/UniversityByCountry',
  
}

export const IntakeQueryKeys = {
  all: ['Intake'],
  appointment: ['Appointment'],
  UserProfile: ['UserProfile'],
  country: ['Country'],
  course: ['Course'],
  university: ['University'],
}

const normalizeUpdateIntakePayload = (data: UpdateIntakePayload): UpdateIntakePayload => ({
  id: String(data.id ?? '').trim(),
  month: Number(data.month ?? 0),
  deadline: String(data.deadline ?? '').trim(),
  isOpen: Boolean(data.isOpen ?? true),
  countryId: String(data.countryId ?? '').trim(),
  universityId: String(data.universityId ?? '').trim(),
  courseId: String(data.courseId ?? '').trim()
});


const normalizeIntakePayload = (data: AddIntakePayload): AddIntakePayload => ({
 month: Number(data.month ?? 0),
  deadline: String(data.deadline ?? '').trim(),
  isOpen: Boolean(data.isOpen ?? true),
  countryId: String(data.countryId ?? '').trim(),
  universityId: String(data.universityId ?? '').trim(),
  courseId: String(data.courseId ?? '').trim()


});

export const useGetAllIntake = (queryParams?: string) => {
  return useQuery({
    queryKey: [...IntakeQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<IntakeResponse>>(
        IntakeEndpoints.filter,
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


export const useAddIntake = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddIntakePayload) => {
      const normalizedPayload = normalizeIntakePayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddIntakeResponse>>(
        IntakeEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Intake added successfully')

      queryClient.invalidateQueries({
        queryKey: IntakeQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add Intake'
      )
    },
  })
}


export const useDeleteIntake = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${IntakeEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Intake deleted successfully')

      queryClient.invalidateQueries({
        queryKey: IntakeQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Intake'
      )
    },
  })
}

export const useUpdateIntake = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateIntakePayload
    }) => {
      const response = await api.patch(
        `${IntakeEndpoints.update}/${id}`,
        normalizeUpdateIntakePayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Intake updated successfully')

      queryClient.invalidateQueries({
        queryKey: IntakeQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Intake'
      )
    },
  })
}


export const useIntakeById = (IntakeId: string | null) => {
  return useQuery({
    queryKey: ["IntakeId", IntakeId],

    queryFn: async (): Promise<IntakeResponse> => {
      if (!IntakeId) {
        throw new Error("Id is required to get Appointment");
      }

      const response = await api.get<IntakeResponse>(
        `${IntakeEndpoints.getById}/${IntakeId}`
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
    queryKey: IntakeQueryKeys.country,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(IntakeEndpoints.country, {
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
        `${IntakeEndpoints.CourseByUniversity}/${UniversityId}`,
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
         `${IntakeEndpoints.UniversityByCountry}/${CountryId}`, {
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



