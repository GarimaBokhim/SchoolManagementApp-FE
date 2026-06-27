import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationCrmResponse, IPaginationResponse } from '@/types/IPaginationResponse'
import { AddInstallmentPaymentsPayload, InstallmentPaymentsResponse,AddInstallmentPaymentsResponse, UpdateInstallmentPaymentsPayload } from '../types/IInstallmentPayments'
import { Toast } from '@/components/Toast/toast'


export const InstallmentpaymentsEndPoints = {
  filter: '/api/CrmFinance/FilterInstallmentPayments',
  add: '/api/CrmFinance/AddPayments',
  update: '/api/CrmFinance/UpdatePayments',
  delete: '/api/CrmFinance/DeletePayments',
  applicants: '/api/Enrolments/AllApplicant',
  get: '/api/CrmFinance/PaymentsById',
    filterInvoice: '/api/CrmFinance/FilterInvoice',
}


export const InstallmentpaymentsQueryKey = {
  invoice:['Invoice'],
  all: ['Installmentpayments'],
  applicants: ['Applicants'],
}

const normalizePaymentsPayload = (data: UpdateInstallmentPaymentsPayload): UpdateInstallmentPaymentsPayload => ({
  invoiceId: String(data.invoiceId ?? '').trim(),
  amount: Number(data.amount) || 0,
  paymentDate: String(data.paymentDate ?? '').trim(),
  paymentMethod: Number(data.paymentMethod) || 0,
})

export const normalizePayments = (
  data: Partial<InstallmentPaymentsResponse> | null | undefined
  ): InstallmentPaymentsResponse => {
    return {
      id: String(data?.id ?? ''),
      invoiceId: String(data?.invoiceId ?? ''),
      amount: Number(data?.amount ?? 0),
      applicantId: String(data?.applicantId ?? '').trim(),
      applicantName: String(data?.applicantName ?? '').trim(),
      invoiceNumber: String(data?.invoiceNumber ?? '').trim(),
      paymentDate: String(data?.paymentDate ?? ''),
      paymentMethod: Number(data?.paymentMethod ?? 0),
      referenceNumber: String(data?.referenceNumber ?? '').trim(),
      paymentStatus: Number(data?.paymentStatus ?? 0),
      isActive: Boolean(data?.isActive ?? false),
      schoolId: String(data?.schoolId ?? ''),
      createdBy: String(data?.createdBy ?? ''),
      createdAt: String(data?.createdAt ?? ''),
      modifiedBy: String(data?.modifiedBy ?? ''),
      modifiedAt: String(data?.modifiedAt ?? ''),
    }
  }


  export const useGetAllInstallmentPayments = (queryParams?: string) => {
    return useQuery({
      queryKey: [...InstallmentpaymentsQueryKey.all, queryParams],
      queryFn: async () => {
        const url = queryParams
          ? `${InstallmentpaymentsEndPoints.filter}${queryParams}`
          : InstallmentpaymentsEndPoints.filter
        const response =
          await api.get<IPaginationCrmResponse<InstallmentPaymentsResponse>>(url)
        return response.data.Data
      },
      staleTime: 1000 * 60 * 5,
      retry: false,
    })
  }
  
export const useAddInstallmentPayments = () => {
  const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: async (payload: AddInstallmentPaymentsPayload) => {
        const normalizedPayload = normalizePaymentsPayload(payload)
  
        const response = await api.post<IPaginationCrmResponse<AddInstallmentPaymentsResponse>>(
          InstallmentpaymentsEndPoints.add,
          normalizedPayload
        )
  
        return response.data
      },
  
      onSuccess: (response) => {
        Toast.success(response?.Message || 'InstallmentPayments added successfully')
  
        queryClient.invalidateQueries({
          queryKey: InstallmentpaymentsQueryKey.all,
        })
      },
  
      onError: (error: any) => {
        Toast.error(
          error?.response?.data?.Message || 'Failed to add Installment Payments'
        )
      },
    })
}

export const useDeleteInstallmentPayments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${InstallmentpaymentsEndPoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Installment Payments deleted successfully')

      queryClient.invalidateQueries({
        queryKey: InstallmentpaymentsQueryKey.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete Installment payments'
      )
    },
  })
}

export const useEditInstallmentPayments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateInstallmentPaymentsPayload
    }) => {
      const response = await api.patch(
        `${InstallmentpaymentsEndPoints.update}/${id}`,
        normalizePaymentsPayload(data)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'Installment Payments updated successfully')

      queryClient.invalidateQueries({
        queryKey: InstallmentpaymentsQueryKey.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update Payments'
      )
    },
  })
}


export const useGetInstallmentPaymentsById = (paymentId?: string) => {
  return useQuery({
    queryKey: [...InstallmentpaymentsQueryKey.all, paymentId],

    queryFn: async (): Promise<InstallmentPaymentsResponse> => {
      const response = await api.get<InstallmentPaymentsResponse>(
        `${InstallmentpaymentsEndPoints.get}/${paymentId}`
      )

      return normalizePayments(response.data)
    },

    enabled: !!paymentId,

    staleTime: 1000 * 60 * 5,

    retry: false,
  })
}


export const useGetAllApplicants = () => {
  return useQuery({
      queryKey: InstallmentpaymentsQueryKey.applicants,
  
      queryFn: async () => {
        const response = await api.get<
          IPaginationCrmResponse<{
            id: string
            fullName: string
          }>
        >(InstallmentpaymentsEndPoints.applicants)
  
        return response.data
      },
  
      select: (response) => response?.Data.Items ?? [],
  
      staleTime: 1000 * 60 * 5,
    })
}


export const useGetAllInvoice = () => {
  return useQuery({
    queryKey: InstallmentpaymentsQueryKey.invoice,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          invoiceNumber: string
        }>
      >(InstallmentpaymentsEndPoints.filterInvoice)

      return response.data
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  })
}
