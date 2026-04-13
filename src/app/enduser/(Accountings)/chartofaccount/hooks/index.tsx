import { api } from '@/utils/instance'
import { useQuery } from '@tanstack/react-query'
import { IChart } from '../types/Ichartofaccount'

const ChartOfAccountEndPoint = {
  getchartOfAccount: '/api/AccountControllers/ChartOfAccounts',
}
const query_Key = 'ChartOfAccount'

export const useGetChartOfAccount = () => {
  return useQuery({
    queryKey: [query_Key],

    queryFn: async () => {
      const url = `${ChartOfAccountEndPoint.getchartOfAccount}`
      const response = await api.get<IChart[]>(url)
      return response.data
    },
    staleTime: 0,
    retry: false,
  })
}
