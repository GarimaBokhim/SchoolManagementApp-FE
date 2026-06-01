import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { InstallmentInvoiceResponse, AddInstallmentInvoicePayload,AddInstallmentInvoiceResponse, UpdateInstallmentInvoicePayload } from '../types/IInstallmentInvoice'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import { InvoiceResponse } from '../../invoice/types/IInvoice'
import { InvoiceEndpoints } from '../../invoice/hooks'


export const InstallmentInvoiceEndpoints = {
  filter: '/api/CrmFinance/FilterInstallmentInvoice',
  add: '/api/CrmFinance/AddInvoice',
  update: '/api/CrmFinance/UpdateInvoice',
  delete: '/api/CrmFinance/DeleteInvoice',
  applicants: '/api/Enrolments/AllApplicant',
}

export const InstallmentInvoiceQueryKeys = {
  all: ['InstallmentInvoice'],
  applicants: ['Applicants'],
}

const normalizeUpdateInstallmentInvoicePayload = (data: UpdateInstallmentInvoicePayload): UpdateInstallmentInvoicePayload => ({
  id: String(data.id ?? '').trim(),
  invoiceNumber: String(data.invoiceNumber ?? '').trim(),
  applicantId: String(data.applicantId ?? '').trim(),
  paidAmount: Number(data.paidAmount ?? 0),

  issueDate: String(data.issueDate ?? '').trim(),
  dueDate: String(data.dueDate ?? '').trim(),

  updateInvoiceItemDTOs: (data.updateInvoiceItemDTOs ?? []).map(item => ({
    id:String(item.id ?? '').trim(),
    description: String(item.description ?? '').trim(),
    amount: Number(item.amount ?? 0),
    quantity: Number(item.quantity ?? 0),
  })),
});


const normalizeInstallmentInvoicePayload = (data: AddInstallmentInvoicePayload): AddInstallmentInvoicePayload => ({
  applicantId: String(data.applicantId ?? '').trim(),
  isInstallments: data.isInstallments,
  issueDate: String(data.issueDate ?? '').trim(),
  dueDate: String(data.dueDate ?? '').trim(),
  addInvoiceItemDTOs: (data.addInvoiceItemDTOs ?? []).map(item => ({
    description: String(item.description ?? '').trim(),
    amount: Number(item.amount ?? 0),
    quantity: Number(item.quantity ?? 0),
  })),
});

export const useGetAllInstallmentInvoice = (queryParams?: string) => {
  return useQuery({
    queryKey: [...InstallmentInvoiceQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<InstallmentInvoiceResponse>>(
        InstallmentInvoiceEndpoints.filter,
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


export const useAddInstallmentInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddInstallmentInvoicePayload) => {
      const normalizedPayload = normalizeInstallmentInvoicePayload(payload)

      const response = await api.post<IPaginationCrmResponse<AddInstallmentInvoiceResponse>>(
        InstallmentInvoiceEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Invoice added successfully')

      queryClient.invalidateQueries({
        queryKey: InstallmentInvoiceQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to add invoice'
      )
    },
  })
}


export const useDeleteInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${InstallmentInvoiceEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Invoice deleted successfully')

      queryClient.invalidateQueries({
        queryKey: InstallmentInvoiceQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete invoice'
      )
    },
  })
}

export const useUpdateInstallmentInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateInstallmentInvoicePayload
    }) => {
      const response = await api.patch(
        `${InstallmentInvoiceEndpoints.update}/${id}`,
        normalizeUpdateInstallmentInvoicePayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Invoice updated successfully')

      queryClient.invalidateQueries({
        queryKey: InstallmentInvoiceQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update invoice'
      )
    },
  })
}

export const useInvoiceById = (InvoiceId: string) => {
  return useQuery({
    queryKey: ["invoiceById", InvoiceId],

    queryFn: async (): Promise<InvoiceResponse> => {
      if (!InvoiceId) {
        throw new Error("Id is required to get Invoice");
      }

      const response = await api.get<InvoiceResponse>(
        `${InvoiceEndpoints.invoiceById}/${InvoiceId}`
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
    queryKey: InstallmentInvoiceQueryKeys.applicants,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          fullName: string
        }>
      >(InstallmentInvoiceEndpoints.applicants)

      return response.data
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  })
}
