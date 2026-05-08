import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationCrmResponse, IPaginationResponse } from '@/types/IPaginationResponse'
import { AddInstallmentPlanPayload, InstallmentPlan, InstallmentPlanResponse } from '../types/IInstallments'
import { Toast } from '@/components/Toast/toast'


export const InstallmentEndPoints = {
  filterInstallmentPlan: '/api/CrmFinance/FilterInstallmentPlan',
  addInstallmentPlan: '/api/CrmFinance/AddInstallmentsPlan',
  allApplicant: '/api/Enrolments/AllApplicant',
//   filterRegistrations: '/api/Enrolments/FilterTrainingRegistration',
//   addRegistration: '/api/Enrolments/AddTrainingRegistration',
}

export const installmentQueryKey = 'InstallmentPlan'


export const useGetAllInstallments = (queryParams?: string) => {
  return useQuery({
    queryKey: [installmentQueryKey, queryParams],
    queryFn: async () => {
      const paramObj: Record<string, string> = {}
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ''))
        parsed.forEach((value, key) => { paramObj[key] = value })
      }
      const response = await api.get<IPaginationCrmResponse<InstallmentPlan>>(
        InstallmentEndPoints.filterInstallmentPlan,
        { params: paramObj }
      )
      return response.data ?? {
        Items: [], TotalItems: 0, PageIndex: 1,
        pageSize: 10, TotalPages: 1, FirstPage: 1, LastPage: 1,
      }
    },
  })
}

export const useAddInstallmentsPlan = () => {
  const queryClient = useQueryClient()
  return useMutation<InstallmentPlanResponse, Error, AddInstallmentPlanPayload>({
    mutationFn: async (payload) => {
      const response = await api.post(InstallmentEndPoints.addInstallmentPlan, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [installmentQueryKey] })
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
      const response = await api.get<IPaginationResponse<{ id: string; name: string }>>(
        InstallmentEndPoints.allApplicant
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

export const useInstallmentPlanMutations = (refetch: () => void) => {
  const handleAdd = async (payload: AddInstallmentPlanPayload) => {
    try {
      await api.post('/api/CrmFinance/AddInstallmentsPlan', payload)
      Toast.success('InstallmentPlan added successfully!')
      refetch()
    } catch {
      Toast.error('Error InstallmentPlan class.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/CrmFinance/DeleteInstallmentsPlan/${id}`)
      Toast.success('InstallmetPlan deleted successfully!')
      refetch()
    } catch {
      Toast.error('Error deleting class.')
    }
  }

  const handleEdit = async (id: string) => {
    try {
      await api.patch(`/api/CrmFinance/UpdateInstallmentsPlan/${id}`)
      Toast.success('Update installmentPlan successfully!')
      refetch()
    } catch {
      Toast.error('Error updateing installmentPlan.')
    }
  }

  return { handleAdd, handleDelete, handleEdit }
}