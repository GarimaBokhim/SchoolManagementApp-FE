import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddDocumentsTypePayload, AddDocumentsTypeResponse, DocumentsTypeResponse, UpdateDocumentsTypePayload } from '../types/IDocumentsType'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const DocumentsTypeEndpoints = {
  filter: '/api/AcademicPrograms/FilterDocumentsType',
  add: '/api/AcademicPrograms/AddDocumentsType',
  update: '/api/AcademicPrograms/UpdateDocumentsType',
  delete: '/api/AcademicPrograms/DeleteDocumentsType',
  getById:'/api/AcademicPrograms/DocumentsType'
}

export const DocumentsTypeQueryKeys = {
  all: ['DocumentsType']
}

const normalizeUpdateDocumentsTypePayload = (data: UpdateDocumentsTypePayload): UpdateDocumentsTypePayload => ({
  id: String(data.id ?? '').trim(),
  name: String(data.name ?? '').trim()
});


const normalizeDocumentsTypePayload = (data: AddDocumentsTypePayload): AddDocumentsTypePayload => ({
  name: String(data.name ?? '').trim()
});

export const useGetAllDocumentsType = (queryParams?: string) => {
  return useQuery({
    queryKey: [...DocumentsTypeQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<DocumentsTypeResponse>>(
        DocumentsTypeEndpoints.filter,
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


export const useAddDocumentsType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddDocumentsTypePayload) => {
      const normalizedPayload = normalizeDocumentsTypePayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddDocumentsTypeResponse>>(
        DocumentsTypeEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'DocumentsType added successfully')

      queryClient.invalidateQueries({
        queryKey: DocumentsTypeQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add DocumentsType'
      )
    },
  })
}


export const useDeleteDocumentsType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${DocumentsTypeEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'DocumentsType deleted successfully')

      queryClient.invalidateQueries({
        queryKey: DocumentsTypeQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete DocumentsType'
      )
    },
  })
}

export const useUpdateDocumentsType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateDocumentsTypePayload
    }) => {
      const response = await api.patch(
        `${DocumentsTypeEndpoints.update}/${id}`,
        normalizeUpdateDocumentsTypePayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'DocumentsType updated successfully')

      queryClient.invalidateQueries({
        queryKey: DocumentsTypeQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update DocumentsType'
      )
    },
  })
}


export const useDocumentsTypeById = (DocumentsTypeId: string) => {
  return useQuery({
    queryKey: ["DocumentsTypeId", DocumentsTypeId],

    queryFn: async (): Promise<DocumentsTypeResponse> => {
      if (!DocumentsTypeId) {
        throw new Error("Id is required to get DocumentsType");
      }

      const response = await api.get<DocumentsTypeResponse>(
        `${DocumentsTypeEndpoints.getById}/${DocumentsTypeId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};


