import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import { AddHouseholdPayload, Household, WaterTariffPlan } from '../types/household.types'

export const HouseholdEndpoints = {
  filter: '/api/KhaneyPaniHouseHolds/FilterHouseHolds',
  add: '/api/KhaneyPaniHouseHolds/AddHouseHolds',
  filterWaterTariffPlan: '/api/KhaneyPaniSetUp/FilterWaterTariffPlan',
}

export const HouseholdQueryKeys = {
  all: ['elitekhaneypani-households'],
  waterTariffPlans: ['elitekhaneypani-water-tariff-plans'],
}

const normalizeAddHouseholdPayload = (data: AddHouseholdPayload): AddHouseholdPayload => ({
  consumerName: String(data.consumerName ?? '').trim(),
  familyMember: Number(data.familyMember ?? 0),
  contactNumber: String(data.contactNumber ?? '').trim(),
  email: String(data.email ?? '').trim(),
  provinceId: Number(data.provinceId ?? 0),
  districtId: Number(data.districtId ?? 0),
  municipalityId: Number(data.municipalityId ?? 0),
  vdcId: Number(data.vdcId ?? 0),
  wardNumber: Number(data.wardNumber ?? 0),
  waterTrrifPlanId: String(data.waterTrrifPlanId ?? '').trim(),
  latitude: Number(data.latitude ?? 0),
  longitude: Number(data.longitude ?? 0),
  tole: String(data.tole ?? '').trim(),
  registrationDate: String(data.registrationDate ?? '').trim(),
})

export const useGetHouseholds = (queryParams?: string) => {
  return useQuery({
    queryKey: [...HouseholdQueryKeys.all, queryParams],
    queryFn: async () => {
      const url = queryParams ? `${HouseholdEndpoints.filter}${queryParams}` : HouseholdEndpoints.filter
      const response = await api.get<IPaginationCrmResponse<Household>>(url)
      return response.data.Data
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export const useGetWaterTariffPlans = () => {
  return useQuery({
    queryKey: HouseholdQueryKeys.waterTariffPlans,
    queryFn: async () => {
      const response = await api.get<IPaginationCrmResponse<WaterTariffPlan>>(
        HouseholdEndpoints.filterWaterTariffPlan,
        { params: { pageSize: 10, pageIndex: 1, isPagination: true } }
      )
      return response.data
    },
    select: (response) => response?.Data.Items ?? [],
    staleTime: 1000 * 60 * 5,
  })
}

export const useAddHousehold = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddHouseholdPayload) => {
      const response = await api.post<IPaginationCrmResponse<Household>>(
        HouseholdEndpoints.add,
        normalizeAddHouseholdPayload(payload)
      )
      return response.data
    },
    onSuccess: (response) => {
      Toast.success(response?.Message || 'Household added successfully')
      queryClient.invalidateQueries({ queryKey: HouseholdQueryKeys.all })
    },
    onError: (error: any) => {
      Toast.error(error?.response?.data?.Message || 'Failed to add household')
    },
  })
}
