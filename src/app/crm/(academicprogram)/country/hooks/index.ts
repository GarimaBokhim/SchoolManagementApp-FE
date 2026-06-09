import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import {AddCountryPayload,AddCountryResponse,CountryResponse,UpdateCountryPayload} from '../types/ICountry'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const CountryEndpoints = {
  filter: '/api/AcademicPrograms/FilterCountry',
  add: '/api/AcademicPrograms/AddCountry',
  update: '/api/AcademicPrograms/UpdateFollowUp',
  delete: '/api/AcademicPrograms/DeleteFollowUp',
  getById:'/api/AcademicPrograms/CountryById',
   university:'/api/AcademicPrograms/FilterUniversity'
  
}

export const CountryQueryKeys = {
  all: ['Country'],
  university: ['University']
}

const normalizeUpdateCountryPayload = (data: UpdateCountryPayload): UpdateCountryPayload => ({
  id: String(data.id ?? '').trim(),
  name: String(data.name ?? '').trim()
});

const normalizeCountryPayload = (data: AddCountryPayload): AddCountryPayload => ({
  name: String(data.name ?? '').trim()
});

export const useGetAllCountry = (queryParams?: string) => {
  return useQuery({
    queryKey: [...CountryQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<CountryResponse>>(
        CountryEndpoints.filter,
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

export const useAddCountry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddCountryPayload) => {
      const normalizedPayload = normalizeCountryPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddCountryResponse>>(
        CountryEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Country added successfully')

      queryClient.invalidateQueries({
        queryKey: CountryQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Issues to add Country'
      )
    },
  })
}

export const useDeleteCountry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${CountryEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Country deleted successfully')

      queryClient.invalidateQueries({
        queryKey: CountryQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Country'
      )
    },
  })
}

export const useUpdateCountry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCountryPayload
    }) => {
      const response = await api.patch(
        `${CountryEndpoints.update}/${id}`,
        normalizeUpdateCountryPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Country updated successfully')

      queryClient.invalidateQueries({
        queryKey: CountryQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Country'
      )
    },
  })
}

export const useCountryById = (CountryId: string | null) => {
  return useQuery({
    queryKey: ["CountryId", CountryId],

    queryFn: async (): Promise<CountryResponse> => {
      if (!CountryId) {
        throw new Error("Id is required to get Country");
      }

      const response = await api.get<CountryResponse>(
        `${CountryEndpoints.getById}/${CountryId}`
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
    queryKey: CountryQueryKeys.university,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(CountryEndpoints.university, {
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


