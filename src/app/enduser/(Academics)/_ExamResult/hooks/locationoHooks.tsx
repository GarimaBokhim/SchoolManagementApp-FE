import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationResponse } from '@/types/IPaginationResponse'

const LocationEndPoints = {
  getAllDistricts: '/api/SetupControllers/all-district',
  getAllProvinces: '/api/SetupControllers/all-province',
}

export interface IDistrict {
  Id: number
  districtNameInNepali: string
  districtNameInEnglish: string
}

export interface IProvince {
  Id: number
  provinceNameInNepali: string
  provinceNameInEnglish: string
}

export const useGetAllDistricts = () => {
  return useQuery({
    queryKey: ['districts'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IDistrict>>(
        LocationEndPoints.getAllDistricts
      )
      return response.data
    },
    staleTime: 1000 * 60 * 10, // cache for 10 mins since this data rarely changes
  })
}

export const useGetAllProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IProvince>>(
        LocationEndPoints.getAllProvinces
      )
      return response.data
    },
    staleTime: 1000 * 60 * 10,
  })
}