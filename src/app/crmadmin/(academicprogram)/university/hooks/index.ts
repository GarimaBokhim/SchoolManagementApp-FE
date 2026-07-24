import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import {AddUniversityPayload,AddUniversityResponse,UniversityResponse,UpdateUniversityPayload} from '../types/IUniversity'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const UniversityEndpoints = {
  filter: '/api/AcademicPrograms/FilterUniversity',
  add: '/api/AcademicPrograms/AddUniversity',
  update: '/api/AcademicPrograms/UpdateFollowUp',
  delete: '/api/AcademicPrograms/DeleteFollowUp',
  getById:'/api/AcademicPrograms/UniversityById',
   country:'/api/AcademicPrograms/GetAllCountry'
  
}

export const UniversityQueryKeys = {
  all: ['University'],
  country: ['Country']
}

const normalizeUpdateUniversityPayload = (data: UpdateUniversityPayload): UpdateUniversityPayload => ({
  id: String(data.id ?? '').trim(),
  name: String(data.name ?? '').trim(),
  countryId: String(data.countryId ?? '').trim(),
  universityAddress: String(data.universityAddress ?? '').trim(),
  descriptions: String(data.descriptions ?? '').trim(),
  website: String(data.website ?? '').trim(),
  globalRanking: Number(data.globalRanking ?? 0)
});

const normalizeUniversityPayload = (data: AddUniversityPayload): AddUniversityPayload => ({
    name: (data.name ?? '').trim(),
  countryId: data.countryId ?? null,
  universityAddress: (data.universityAddress ?? '').trim(),
  descriptions: (data.descriptions ?? '').trim(),
  website: (data.website ?? '').trim(),
  globalRanking: Number(data.globalRanking ?? 0)
});

export const useGetAllUniversity = (queryParams?: string) => {
  return useQuery({
    queryKey: [...UniversityQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<UniversityResponse>>(
        UniversityEndpoints.filter,
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

export const useAddUniversity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddUniversityPayload) => {
      const normalizedPayload = normalizeUniversityPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddUniversityResponse>>(
        UniversityEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'University added successfully')

      queryClient.invalidateQueries({
        queryKey: UniversityQueryKeys.all,
      })

      queryClient.invalidateQueries({
        queryKey: UniversityQueryKeys.country,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add University'
      )
    },
  })
}

export const useDeleteUniversity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${UniversityEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'University deleted successfully')

      queryClient.invalidateQueries({
        queryKey: UniversityQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete University'
      )
    },
  })
}

export const useUpdateUniversity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateUniversityPayload
    }) => {
      const response = await api.patch(
        `${UniversityEndpoints.update}/${id}`,
        normalizeUpdateUniversityPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'University updated successfully')

      queryClient.invalidateQueries({
        queryKey: UniversityQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update University'
      )
    },
  })
}

export const useUniversityById = (UniversityId: string | null) => {
  return useQuery({
    queryKey: ["UniversityId", UniversityId],

    queryFn: async (): Promise<UniversityResponse> => {
      if (!UniversityId) {
        throw new Error("Id is required to get University");
      }

      const response = await api.get<UniversityResponse>(
        `${UniversityEndpoints.getById}/${UniversityId}`
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
    queryKey: UniversityQueryKeys.country,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(UniversityEndpoints.country, {
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


