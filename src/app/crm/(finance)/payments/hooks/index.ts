import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationCrmResponse, IPaginationResponse } from '@/types/IPaginationResponse'

import { AddPaymentsPayload, FilterPaymentsResponse,AddPaymentsResponse } from '../types/IPayments'



import { Toast } from '@/components/Toast/toast'


export const paymentsEndPoints = {
  filterPayments: '/api/CrmFinance/FilterPayments',
  addPayments: '/api/CrmFinance/AddPayments',
  allApplicant: '/api/Enrolments/AllApplicant',
//   filterRegistrations: '/api/Enrolments/FilterTrainingRegistration',
//   addRegistration: '/api/Enrolments/AddTrainingRegistration',
}

export const paymentsQueryKey = 'Payments'


export const useGetAllPayments = (queryParams?: string) => {
  return useQuery({
    queryKey: [paymentsQueryKey, queryParams],
    queryFn: async () => {
      const paramObj: Record<string, string> = {}
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ''))
        parsed.forEach((value, key) => { paramObj[key] = value })
      }
      const response = await api.get<IPaginationCrmResponse<FilterPaymentsResponse>>(
        paymentsEndPoints.filterPayments,
        { params: paramObj }
      )
      return response.data ?? {
        Items: [], TotalItems: 0, PageIndex: 1,
        pageSize: 10, TotalPages: 1, FirstPage: 1, LastPage: 1,
      }
    },
  })
}

export const useAddPayments = () => {
  const queryClient = useQueryClient()
  return useMutation<AddPaymentsResponse, Error, AddPaymentsPayload>({
    mutationFn: async (payload) => {
      const response = await api.post(paymentsEndPoints.addPayments, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [paymentsQueryKey] })
    },
  })
}

// return useQuery({
//     queryKey: [queryKey, params],
//     queryFn: async () => {
//       const url = params
//         ? `${ExamEndPoints.getAllExams}${params}`
//         : `${ExamEndPoints.getAllExams}`;
//       const response = await api.get<IPaginationResponse<IExam>>(url);
//       return (
//         response.data ?? {
//           data: [],
//           PageIndex: 0,
//           isPagination: 1,
//           pageSize: 10,
//         }
//       );
//     },
//   });

export const useGetAllApplicantDropdown = () => {
  return useQuery({
    queryKey: ['AllApplicantDropdown'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<{ id: string; fullName: string }>>(
        paymentsEndPoints.allApplicant
      )
      return response.data?.Items ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}




export const useGetAllApplicants = () => {
  return useQuery({
    queryKey: ['AllApplicants'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<{ id: string; fullName: string }>>(
        '/api/Enrolments/AllApplicant'
      )
      return response.data?.Items ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const usePaymentsMutations = (refetch: () => void) => {
  const handleAdd = async (payload: AddPaymentsResponse) => {
    try {
      await api.post('/api/CrmFinance/AddPayments', payload)
      Toast.success('Payments added successfully!')
      refetch()
    } catch {
      Toast.error('Error Payments.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/CrmFinance/DeletePayments/${id}`)
      Toast.success('InstallmetPlan deleted successfully!')
      refetch()
    } catch {
      Toast.error('Error deleting.')
    }
  }

  const handleEdit = async (id: string) => {
    try {
      await api.patch(`/api/CrmFinance/UpdatePayments/${id}`)
      Toast.success('Update Payments successfully!')
      refetch()
    } catch {
      Toast.error('Error updateing payments.')
    }
  }

  return { handleAdd, handleDelete, handleEdit }
}