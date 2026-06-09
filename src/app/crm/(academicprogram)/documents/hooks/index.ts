import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddDocumentsPayload, AddDocumentsResponse, ApplicantResponse, DocumentsIdResponse, DocumentsResponse, UpdateDocumentsPayload } from '../types/IDocuments'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const DocumentsEndpoints = {
  filter: '/api/AcademicPrograms/FilterDocuments',
  add: '/api/AcademicPrograms/AddDocuments',
  update: '/api/AcademicPrograms/UploadApplicantDocuments',
  delete: '/api/AcademicPrograms/DeleteDocuments',
  getById:'/api/AcademicPrograms/Documents',
   applicants: '/api/Enrolments/AllApplicant',
    filterDocType: '/api/AcademicPrograms/FilterDocumentsType',
    filterApplicant: '/api/Enrolments/FilterApplicants',

}

export const DocumentsQueryKeys = {
  all: ['Documents'],
  applicants: ['Applicants'],
  docType: ['docType'],
  filterApplicant:['FilterApplicant']
}

const normalizeUpdateDocumentsPayload = (
    data: UpdateDocumentsPayload
): FormData => {
    const formData = new FormData();

    formData.append("id", String(data.id ?? "").trim());
    formData.append("applicantId", String(data.applicantId ?? "").trim());

    (data.documentsByIdDTOs ?? []).forEach((doc, index) => {
        formData.append(
            `documentsByIdDTOs[${index}].documentTypeId`,
            String(doc.documentTypeId ?? "").trim()
        );

        formData.append(
            `documentsByIdDTOs[${index}].documentStatus`,
            String(doc.documentStatus ?? 0)
        );

        if (doc.docFile) {
            formData.append(
                `documentsByIdDTOs[${index}].docFile`,
                doc.docFile
            );
        }
    });

    return formData;
};


const normalizeDocumentsPayload = (data: AddDocumentsPayload): FormData => {
  const formData = new FormData();

  formData.append(
    "applicantId",
    String(data.applicantId ?? "").trim()
  );

  (data.documentsDTOs ?? []).forEach((doc, index) => {
    formData.append(
      `documentsDTOs[${index}].documentTypeId`,
      String(doc.documentTypeId ?? "").trim()
    );

    if (doc.docFile) {
      formData.append(
        `documentsDTOs[${index}].docFile`,
        doc.docFile
      );
    }
  });

  return formData;
};

export const useGetAllDocuments = (
  queryParams?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...DocumentsQueryKeys.all, queryParams],

    enabled,

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, "") || "")
      );

      const response =
        await api.get<IPaginationCrmResponse<DocumentsResponse>>(
          DocumentsEndpoints.filter,
          { params }
        );

      return response.data;
    },

    select: (response) => ({
      items: response?.Data?.Items ?? [],
      pagination: {
        totalItems: response?.Data?.TotalItems ?? 0,
        pageIndex: response?.Data?.PageIndex ?? 1,
        pageSize: response?.Data?.pageSize ?? 10,
        totalPages: response?.Data?.TotalPages ?? 1,
      },
      message: response?.Message ?? "",
      statusCode: response?.StatusCode ?? 200,
    }),

    staleTime: 1000 * 60 * 5,
  });
};


export const useAddDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddDocumentsPayload) => {
      const formData = normalizeDocumentsPayload(payload);

      const response =
        await api.post<IPaginationCrmResponse<AddDocumentsResponse>>(
          DocumentsEndpoints.add,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

      return response.data;
    },

    onSuccess: (response) => {
      Toast.success(
        response?.Message || "Documents added successfully"
      );

      queryClient.invalidateQueries({
        queryKey: DocumentsQueryKeys.all,
      });
    },

    onError: (error: any) => {
      console.log("API Error:", error?.response?.data);

      Toast.error(
        error?.response?.data?.Message ||
          "Failed to add Documents"
      );
    },
  });
};


export const useDeleteDocuments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${DocumentsEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Documents deleted successfully')

      queryClient.invalidateQueries({
        queryKey: DocumentsQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Documents'
      )
    },
  })
}

export const useUpdateDocuments = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateDocumentsPayload;
        }) => {
            const formData = normalizeUpdateDocumentsPayload(payload);

            const response = await api.patch(
                `${DocumentsEndpoints.update}/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return response.data;
        },

        onSuccess: (response: any) => {
            Toast.success(
                response?.message ||
                    response?.Message ||
                    "Documents updated successfully"
            );

            queryClient.invalidateQueries({
                queryKey: DocumentsQueryKeys.all,
            });
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.message ||
                    error?.response?.data?.Message ||
                    "Failed to update Documents"
            );
        },
    });
};


export const useDocumentsById = (DocumentsId: string) => {
  return useQuery({
    queryKey: ["DocumentsId", DocumentsId],

    queryFn: async (): Promise<DocumentsIdResponse> => {
      if (!DocumentsId) {
        throw new Error("Id is required to get Documents");
      }

      const response = await api.get<DocumentsIdResponse>(
        `${DocumentsEndpoints.getById}/${DocumentsId}`
      );

      return response.data;
    },

    staleTime: 0,
    gcTime: 0, // 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useGetAllApplicants = () => {
  return useQuery({
    queryKey: DocumentsQueryKeys.applicants,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          fullName: string
        }>
      >(DocumentsEndpoints.applicants)

      return response.data
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  })
}


export const useGetAllDocType = () => {
  return useQuery({
    queryKey: DocumentsQueryKeys.docType,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          name: string
        }>
      >(DocumentsEndpoints.filterDocType)

      return response.data
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  })
}


export const useFilterAllApplicants = (queryParams?: string) => {
   return useQuery({
    queryKey: [...DocumentsQueryKeys.filterApplicant, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<ApplicantResponse>>(
        DocumentsEndpoints.filterApplicant,
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


