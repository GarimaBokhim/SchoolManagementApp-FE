import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import { AddInstallmentPlanPayload, AddInstallmentPlanResponse, FilterInstallmentPlanResponse } from '../types/IInstallments'



export const InstallmentEndPoints = {
  filter: '/api/CrmFinance/FilterInstallmentPlan',
  add: '/api/CrmFinance/AddInstallmentsPlan',
  update: '/api/CrmFinance/UpdateInvoice',
  delete: '/api/CrmFinance/DeleteInvoice',
  applicants: '/api/Enrolments/AllApplicant'
}

export const InstallmentPlanQueryKeys = {
  all: ['InstallmentPlan'],
  applicants: ['Applicants'],
}

const normalizeInstallmentPlanPayload = (data: AddInstallmentPlanPayload): AddInstallmentPlanPayload => ({
  applicantId: String(data.applicantId ?? '').trim(),
  numberOfInstallments: Number(data.numberOfInstallments) || 0
})


export const useGetAllInstallments = (queryParams?: string) => {
  return useQuery({
    queryKey: [...InstallmentPlanQueryKeys.all, queryParams],
    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )
      const response = await api.get<IPaginationCrmResponse<FilterInstallmentPlanResponse>>(
              InstallmentEndPoints.filter,
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

export const useAddInstallmentsPlan = () => {
  const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: async (payload: AddInstallmentPlanPayload) => {
        const normalizedPayload = normalizeInstallmentPlanPayload(payload)
  
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
      payload: AddInstallmentPlanPayload
    }) => {
      const response = await api.patch(
        `${InstallmentEndPoints.update}/${id}`,
        normalizeInstallmentPlanPayload(payload)
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
