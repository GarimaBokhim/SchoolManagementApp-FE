import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import { getBackendBaseUrl } from '@/utils/backendUrl'
import { WaterTariffResponse } from '../types/IWaterTariff'

export const WaterTariffEndpoints = {
    filter: `${getBackendBaseUrl()}/api/KhaneyPaniSetUp/FilterWaterTariff`,
}

export const WaterTariffQueryKeys = {
    all: ['WaterTariff'],
}

export const useGetAllWaterTariff = (queryParams: string) =>
    useQuery({
        queryKey: [...WaterTariffQueryKeys.all, queryParams],
        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<WaterTariffResponse>
            >(`${WaterTariffEndpoints.filter}${queryParams}`)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
