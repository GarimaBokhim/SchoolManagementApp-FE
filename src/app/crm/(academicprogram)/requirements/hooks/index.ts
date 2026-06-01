import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddRequirementsPayload, RequiredDocTypeStatusPayload,RequiredDocTypeStatusResponse,RequirementsResponse,AddRequirementsResponse, UpdateRequirementsPayload } from '../types/IRequirements'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const RequirementsEndpoints = {
  filter: '/api/AcademicPrograms/FilterRequirements',
  add: '/api/AcademicPrograms/AddRequirements',
  update: '/api/CrmFinance/UpdateInvoice',
  delete: '/api/CrmFinance/DeleteInvoice',
  country: '/api/AcademicPrograms/GetAllCountry',
   CourseByUniversity: '/api/AcademicPrograms/CourseByUniversity',
   UniversityByCountry: '/api/AcademicPrograms/UniversityByCountry',
  invoiceById:'/api/CrmFinance/Invoice',
  filterDocumentType:'/api/AcademicPrograms/FilterDocumentsType',

  RequiredDocType:'/api/AcademicPrograms/RequiredDocType',
  NonRequiredDocType:'/api/AcademicPrograms/NonRequiredDocType'
}

export const RequirementsQueryKeys = {
  all: ['Requirements'],
  country: ['Country'],
  course: ['Course'],
  requirementsById: ['InvoiceByIds'],
  documentType:["DocumentType"]
}

const normalizeUpdateRequirementsPayload = (data: UpdateRequirementsPayload): UpdateRequirementsPayload => ({
  id: String(data.id ?? '').trim(),
  descriptions: String(data.descriptions ?? '').trim(),
  countryId: String(data.countryId ?? '').trim(),
  courseId: String(data.courseId ?? '').trim(),
  updatedocumentsCheckListDTOs: (data.updatedocumentsCheckListDTOs ?? []).map(item => ({
    id:String(item.id ?? '').trim(),
    documenteTypeId: String(item.documenteTypeId ?? '').trim()
  })),
});


const normalizeAddRequirementsPayload = (data: AddRequirementsPayload): AddRequirementsPayload => ({
    title:String(data.title ?? '').trim(),
  descriptions: String(data.descriptions ?? '').trim(),
  universityId: String(data.universityId ?? '').trim(),
  countryId: String(data.countryId ?? '').trim(),
  courseId: String(data.courseId ?? '').trim(),
  documentsCheckListDTOs: (data.documentsCheckListDTOs ?? []).map(item => ({
    documenteTypeId: String(item.documenteTypeId ?? '').trim()
  })),
});


const normallizeRequiredDocTypeStatusPayload = (data:RequiredDocTypeStatusPayload): RequiredDocTypeStatusPayload => ({
documentCheckListId : String(data.documentCheckListId)
})

const normallizeNonRequiredDocTypeStatusPayload = (data:RequiredDocTypeStatusPayload): RequiredDocTypeStatusPayload => ({
documentCheckListId : String(data.documentCheckListId)
})

export const useGetAllRequirements = (queryParams?: string) => {
  return useQuery({
    queryKey: [...RequirementsQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<RequirementsResponse>>(
        RequirementsEndpoints.filter,
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

export const useRequiredTypeStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RequiredDocTypeStatusPayload) => {
      const normalizedPayload = normallizeRequiredDocTypeStatusPayload(payload)

      const response = await api.post<IPaginationCrmResponse<RequiredDocTypeStatusResponse>>(
        RequirementsEndpoints.RequiredDocType,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'RequiredType Status Updated')

      queryClient.invalidateQueries({
        queryKey: RequirementsQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update RequiredType'
      )
    },
  })
}




export const useNonRequiredTypeStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RequiredDocTypeStatusPayload) => {
      const normalizedPayload = normallizeNonRequiredDocTypeStatusPayload(payload)

      const response = await api.post<IPaginationCrmResponse<RequiredDocTypeStatusResponse>>(
        RequirementsEndpoints.NonRequiredDocType,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'NonRequiredType Status Updated')

      queryClient.invalidateQueries({
        queryKey: RequirementsQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update NonRequiredType'
      )
    },
  })
}


export const useAddRequirements = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddRequirementsPayload) => {
      const normalizedPayload = normalizeAddRequirementsPayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddRequirementsResponse>>(
        RequirementsEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Requirements added successfully')

      queryClient.invalidateQueries({
        queryKey: RequirementsQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add Requirements'
      )
    },
  })
}


export const useDeleteRequirements = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${RequirementsEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Requirements deleted successfully')

      queryClient.invalidateQueries({
        queryKey: RequirementsQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete requirements'
      )
    },
  })
}

export const useUpdateRequirements = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateRequirementsPayload
    }) => {
      const response = await api.patch(
        `${RequirementsEndpoints.update}/${id}`,
        normalizeUpdateRequirementsPayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Requirements updated successfully')

      queryClient.invalidateQueries({
        queryKey: RequirementsQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Requirements'
      )
    },
  })
}


export const useRequirementsById = (RequirementsId: string) => {
  return useQuery({
    queryKey: ["RequirementsId", RequirementsId],

    queryFn: async (): Promise<RequirementsResponse> => {
      if (!RequirementsId) {
        throw new Error("Id is required to get Requirements");
      }

      const response = await api.get<RequirementsResponse>(
        `${RequirementsEndpoints.invoiceById}/${RequirementsId}`
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
    queryKey: RequirementsQueryKeys.country,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(RequirementsEndpoints.country)

      return response.data
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  })
}



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
        `${RequirementsEndpoints.CourseByUniversity}/${UniversityId}`,
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
         `${RequirementsEndpoints.UniversityByCountry}/${CountryId}`, {
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



export const useGetAllDocumentType = () => {
  return useQuery({
    queryKey: RequirementsQueryKeys.documentType,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(RequirementsEndpoints.filterDocumentType, {
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
