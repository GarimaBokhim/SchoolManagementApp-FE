import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddInvoicePayload, Invoice, InvoiceResponse } from '../types/IInvoice'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const InvoiceEndpoints = {
  filter: '/api/CrmFinance/FilterInvoice',
  add: '/api/CrmFinance/AddInvoice',
  update: '/api/CrmFinance/UpdateInvoice',
  delete: '/api/CrmFinance/DeleteInvoice',
  applicants: '/api/Enrolments/AllApplicant',
}

export const InvoiceQueryKeys = {
  all: ['Invoice'],
  applicants: ['Applicants'],
}


const normalizeInvoicePayload = (data: AddInvoicePayload): AddInvoicePayload => ({
  applicantId: String(data.applicantId ?? '').trim(),
  paidAmount: Number(data.paidAmount) || 0,
  issueDate: String(data.issueDate ?? '').trim(),
  dueDate: String(data.dueDate ?? '').trim(),
})


export const useGetAllInvoice = (queryParams?: string) => {
  return useQuery({
    queryKey: [...InvoiceQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<InvoiceResponse>>(
        InvoiceEndpoints.filter,
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


export const useAddInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddInvoicePayload) => {
      const normalizedPayload = normalizeInvoicePayload(payload)

      const response = await api.post<IPaginationCrmResponse<Invoice>>(
        InvoiceEndpoints.add,
        normalizedPayload
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Invoice added successfully')

      queryClient.invalidateQueries({
        queryKey: InvoiceQueryKeys.all,
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
        `${InvoiceEndpoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Invoice deleted successfully')

      queryClient.invalidateQueries({
        queryKey: InvoiceQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete invoice'
      )
    },
  })
}

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: AddInvoicePayload
    }) => {
      const response = await api.patch(
        `${InvoiceEndpoints.update}/${id}`,
        normalizeInvoicePayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Invoice updated successfully')

      queryClient.invalidateQueries({
        queryKey: InvoiceQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update invoice'
      )
    },
  })
}


export const useGetAllApplicants = () => {
  return useQuery({
    queryKey: InvoiceQueryKeys.applicants,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          fullName: string
        }>
      >(InvoiceEndpoints.applicants)

      return response.data
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  })
}