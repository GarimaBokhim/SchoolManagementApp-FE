import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import {AddCoursePayload,AddCourseResponse,CourseResponse,UpdateCoursePayload} from '../types/ICourse'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const CourseEndpoints = {
  filter: '/api/AcademicPrograms/FilterCourse',
  add: '/api/AcademicPrograms/AddCourse',
  update: '/api/AcademicPrograms/UpdateFollowUp',
  delete: '/api/AcademicPrograms/DeleteFollowUp',
  getById:'/api/AcademicPrograms/CourseById',
   university:'/api/AcademicPrograms/FilterUniversity'
  
}

export const CourseQueryKeys = {
  all: ['Course'],
  university: ['University']
}

const normalizeUpdateCoursePayload = (data: UpdateCoursePayload): UpdateCoursePayload => ({
  id: String(data.id ?? '').trim(),
  title: String(data.title ?? '').trim(),
  studyLevel: Number(data.studyLevel ?? 0),
  tuationFee: Number(data.tuationFee ?? 0),
  currency: String(data.currency ?? '').trim(),
  universityId: String(data.universityId ?? '').trim()
});

const normalizeCoursePayload = (data: AddCoursePayload): AddCoursePayload => ({
  title: (data.title ?? "").trim(),
  studyLevel: Number(data.studyLevel ?? 0),
  tuationFee: Number(data.tuationFee ?? 0),
  currency: (data.currency ?? "").trim(),
  universityId: data.universityId ?? null,
});

export const useGetAllCourse = (queryParams?: string) => {
  return useQuery({
    queryKey: [...CourseQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<CourseResponse>>(
        CourseEndpoints.filter,
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

export const useAddCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddCoursePayload) => {
      const normalizedPayload = normalizeCoursePayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddCourseResponse>>(
        CourseEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Course added successfully')

      queryClient.invalidateQueries({
        queryKey: CourseQueryKeys.all,
        
      })

      queryClient.invalidateQueries({
        queryKey: CourseQueryKeys.university,
        
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Issues to add Course'
      )
    },
  })
}

export const useDeleteCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${CourseEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Course deleted successfully')

      queryClient.invalidateQueries({
        queryKey: CourseQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Course'
      )
    },
  })
}

export const useUpdateCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCoursePayload
    }) => {
      const response = await api.patch(
        `${CourseEndpoints.update}/${id}`,
        normalizeUpdateCoursePayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Course updated successfully')

      queryClient.invalidateQueries({
        queryKey: CourseQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Course'
      )
    },
  })
}

export const useCourseById = (CourseId: string | null) => {
  return useQuery({
    queryKey: ["CourseId", CourseId],

    queryFn: async (): Promise<CourseResponse> => {
      if (!CourseId) {
        throw new Error("Id is required to get Course");
      }

      const response = await api.get<CourseResponse>(
        `${CourseEndpoints.getById}/${CourseId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useGetAllUniversity = () => {
  return useQuery({
    queryKey: CourseQueryKeys.university,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(CourseEndpoints.university, {
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


