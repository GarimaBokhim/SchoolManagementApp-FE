import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationResponse } from '@/types/IPaginationResponse'
import { IPaymentDetailReport } from '../types/IPaymentRecord'
import { IPaymentStatement } from '../types/IPaymentRecord'
const PaymentDetailReportEndPoints = {
  getPaymentDetailsReport: '/api/SchoolReportsControllers/PaymentDetailsReport',
}

const queryKey = 'PaymentDetailReport'

export const useGetPaymentDetailReport = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${PaymentDetailReportEndPoints.getPaymentDetailsReport}${params}`
        : PaymentDetailReportEndPoints.getPaymentDetailsReport
      const response = await api.get<IPaginationResponse<IPaymentDetailReport>>(url)
      return response.data
    },
    staleTime: 0,
    retry: false,
    enabled: !!params,
  })
}


export const useGetPaymentStatements = (studentId: string) => {
  return useQuery({
    queryKey: [queryKey, studentId],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IPaymentStatement>>(
        `/api/SchoolReportsControllers/PaymentStatements?studentId=${studentId}`
      )
      return response.data
    },
    enabled: !!studentId,
    staleTime: 0,
    retry: false,
  })
}