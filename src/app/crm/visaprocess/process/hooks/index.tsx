import { IPaginationResponse } from '@/types/IPaginationResponse'
import { useQuery } from '@tanstack/react-query'

export const VisaApplicationEndPoints = {
  filterVisaApplications: '/api/VisaApplication/FilterVisaApplication',
}
export const visaApplicationQueryKey = 'VisaApplications'
export const useGetAllVisaApplications = (queryParams?: string) => {
  return useQuery({
    queryKey: [visaApplicationQueryKey, queryParams],

    queryFn: async () => {
      const paramObj: Record<string, string> = {}
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ''))
        parsed.forEach((value, key) => {
          paramObj[key] = value
        })
      }
      const response = await api.get<IPaginationResponse<TrainingRegistration>>(
        VisaApplicationEndPoints.filterVisaApplications,
        { params: paramObj }
      )
      return (
        response.data ?? {
          Items: [],
          TotalItems: 0,
          PageIndex: 1,
          pageSize: 10,
          TotalPages: 1,
          FirstPage: 1,
          LastPage: 1,
        }
      )
    },
  })
}
