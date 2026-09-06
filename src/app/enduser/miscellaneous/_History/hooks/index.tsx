import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationResponse } from '@/types/IPaginationResponse'
import { IHistory } from '../types/IHistory'
const HistoryEndPoints = {
  getAllHistory: '/api/SchoolAssetsControllers/all-History',
  createHistory: '/api/SchoolAssetsControllers/AddSchoolItemHistory',
  removeHistory: '/api/SchoolAssetsControllers/DeleteSchoolItemHistory',
  updateHistory: '/api/SchoolAssetsControllers/UpdateSchoolItemHistory',
  getHistoryById: '/api/SchoolAssetsControllers/SchoolItemshistory',
  filterHistoryByDate: '/api/SchoolAssetsControllers/FilterSchoolItemsHistory',
  getHistoryByClass: '/api/SchoolAssetsControllers/GetHistoryByClass',
}

const queryKey = 'History'
const filterQueryKey = 'filteredHistory'
type HistoryRequest = {
  id?: string
  schoolItemId: string
  previousStatus: number
  currentStatus: number
  remarks: string
}

export const useAddHistory = () => {
  const queryClient = useQueryClient()

  return useMutation<IHistory, Error, HistoryRequest>({
    mutationFn: async (formData: HistoryRequest): Promise<IHistory> => {
      const response = await api.post(HistoryEndPoints.createHistory, formData)
      return response.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] })
    },

    onError: (error) => {
      console.error('Error adding History:', error)
    },
  })
}

export const useRemoveHistory = () => {
  const queryClient = useQueryClient()
  return useMutation<IHistory, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IHistory> => {
      if (!Id) {
        throw new Error('Id is required to remove a History')
      }
      const response = await api.delete(
        `${HistoryEndPoints.removeHistory}/${Id}`
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] })
    },
  })
}

export const useEditHistory = () => {
  const queryClient = useQueryClient()
  return useMutation<
    IHistory,
    Error,
    { id: string | unknown; data: HistoryRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IHistory> => {
      if (!id) {
        throw new Error('Ïd is required to edit History')
      }
      const response = await api.patch(
        `${HistoryEndPoints.updateHistory}/${id}`,
        data
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] })
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })
}

export const useGetHistoryById = (HistoryId: string) => {
  return useQuery({
    queryKey: [queryKey, HistoryId],
    queryFn: async (): Promise<IHistory> => {
      if (!HistoryId) {
        throw new Error('Id is required to get a History')
      }
      const response = await api.get<IHistory>(
        `${HistoryEndPoints.getHistoryById}/${HistoryId}`
      )
      return response.data
    },
    enabled: !!HistoryId,
    retry: false,
  })
}

export const useGetAllHistory = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${HistoryEndPoints.getAllHistory}${params}`
        : `${HistoryEndPoints.getAllHistory}`
      const response = await api.get<IPaginationResponse<IHistory>>(url)
      return (
        response.data ?? {
          data: [],
          PageIndex: 0,
          isPagination: 1,
          pageSize: 10,
        }
      )
    },
  })
}

export const useFilterHistoryByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${HistoryEndPoints.filterHistoryByDate}${params}`
        : HistoryEndPoints.filterHistoryByDate
      const response = await api.get<IPaginationResponse<IHistory>>(url)
      return response.data
    },
    staleTime: 0,
    retry: false,
  })
}
