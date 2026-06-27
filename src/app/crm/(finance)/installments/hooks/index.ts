import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import {AddInstallmentPlanPayload,UpdateInstallmentPlanPayload,  AddInstallmentPlanResponse, InstallmentPlanResponse } from '../types/IInstallments'



export const InstallmentEndPoints = {
  filter: '/api/CrmFinance/FilterInstallmentPlan',
  add: '/api/CrmFinance/AddInstallmentsPlan',
  update: '/api/CrmFinance/UpdateInstallmentsPlan',
  delete: '/api/CrmFinance/DeleteInstallmentsPlan',
  applicants: '/api/Enrolments/AllApplicant',
  get: '/api/CrmFinance/InstallmentPlan',
  filterInvoice: '/api/CrmFinance/FilterInvoice'
}

export const InstallmentPlanQueryKeys = {
   invoice:['Invoice'],
  all: ['InstallmentPlan'],
  applicants: ['Applicants'],
}

const normalizeInstallmentPlanUpdatePayload = (data: UpdateInstallmentPlanPayload): UpdateInstallmentPlanPayload => ({
  numberOfInstallments: Number(data.numberOfInstallments) || 0,
  invoiceId:String(data.invoiceId ?? '').trim(),
})

const normalizeInstallmentPlanAddPayload = (data: AddInstallmentPlanPayload): AddInstallmentPlanPayload => ({
  numberOfInstallments: Number(data.numberOfInstallments) || 0,
  invoiceId:String(data.invoiceId ?? '').trim(),
})


export const normalizeInstallmentPlan = (
  data: Partial<InstallmentPlanResponse> | null | undefined
  ): InstallmentPlanResponse => {
    return {
      id: String(data?.id ?? ''),
      numberOfInstallments: Number(data?.numberOfInstallments ?? 0),
      applicantName: String(data?.applicantName ?? ''),
      invoiceId: String(data?.invoiceId ?? '').trim(),
      invoiceNumber: String(data?.invoiceNumber ?? '').trim(),
      totalAmount: Number(data?.totalAmount ?? 0),
      isActive: Boolean(data?.isActive ?? false),
      schoolId: String(data?.schoolId ?? ''),
      createdBy: String(data?.createdBy ?? ''),
      createdAt: String(data?.createdAt ?? ''),
      modifiedBy: String(data?.modifiedBy ?? ''),
      modifiedAt: String(data?.modifiedAt ?? ''),
    }
  }


export const useGetAllInstallments = (queryParams?: string) => {
    return useQuery({
      queryKey: [...InstallmentPlanQueryKeys.all, queryParams],
      queryFn: async () => {
        const url = queryParams
          ? `${InstallmentEndPoints.filter}${queryParams}`
          : InstallmentEndPoints.filter
        const response =
          await api.get<IPaginationCrmResponse<InstallmentPlanResponse>>(url)
        return response.data.Data
      },
      staleTime: 1000 * 60 * 5,
      retry: false,
    })
  }
 

export const useAddInstallmentsPlan = () => {
  const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: async (payload: AddInstallmentPlanPayload) => {
        const normalizedPayload = normalizeInstallmentPlanAddPayload(payload)
  
        const response = await api.post<IPaginationCrmResponse<AddInstallmentPlanResponse>>(
          InstallmentEndPoints.add,
          normalizedPayload
        )
  
        return response.data
      },
  
      onSuccess: (response) => {
        Toast.success(response?.Message || 'InstallmentPlan added successfully')
  
        queryClient.invalidateQueries({
          queryKey: InstallmentPlanQueryKeys.all,
        })
      },
  
      onError: (error: any) => {
        Toast.error(
          error?.response?.data?.Message || 'Failed to add InstallmentPlan'
        )
      },
    })
}

export const useDeleteInstallmentPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        `${InstallmentEndPoints.delete}/${id}`
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'InstallmentPlan deleted successfully')

      queryClient.invalidateQueries({
        queryKey: InstallmentPlanQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to delete InstallmentPlan'
      )
    },
  })
}

export const useUpdateInstallmentPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateInstallmentPlanPayload
    }) => {
      const response = await api.patch(
        `${InstallmentEndPoints.update}/${id}`,
        normalizeInstallmentPlanUpdatePayload(payload)
      )

      return response.data
    },

    onSuccess: (response) => {
      Toast.success(response?.Message || 'InstallmentPlan updated successfully')

      queryClient.invalidateQueries({
        queryKey: InstallmentPlanQueryKeys.all,
      })
    },

    onError: (error: any) => {
      Toast.error(
        error?.response?.data?.Message || 'Failed to update InstallmentPlan'
      )
    },
  })
}

export const useGetInstallmentPlanById = (InstallmentPlanId?: string) => {
  return useQuery({
    queryKey: [...InstallmentPlanQueryKeys.all, InstallmentPlanId],

    queryFn: async (): Promise<InstallmentPlanResponse> => {
      const response = await api.get<InstallmentPlanResponse>(
        `${InstallmentEndPoints.get}/${InstallmentPlanId}`
      )

      return normalizeInstallmentPlan(response.data)
    },

    enabled: !!InstallmentPlanId,

    staleTime: 1000 * 60 * 5,

    retry: false,
  })
}

export const useGetAllApplicants = () => {
  return useQuery({
      queryKey: InstallmentPlanQueryKeys.applicants,
  
      queryFn: async () => {
        const response = await api.get<
          IPaginationCrmResponse<{
            id: string
            fullName: string
          }>
        >(InstallmentEndPoints.applicants)
  
        return response.data
      },
  
      select: (response) => response?.Data.Items ?? [],
  
      staleTime: 1000 * 60 * 5,
    })
}

export const useGetAllInvoice = () => {
  return useQuery({
    queryKey: InstallmentPlanQueryKeys.invoice,

    queryFn: async () => {
      const response = await api.get<
        IPaginationCrmResponse<{
          id: string
          invoiceNumber: string
        }>
      >(InstallmentEndPoints.filterInvoice)

      return response.data
    },

    select: (response) => response?.Data.Items ?? [],

    staleTime: 1000 * 60 * 5,
  })
}
