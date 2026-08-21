import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddHouseHoldsResponse, HouseHoldsResponse, UpdateHouseHoldsPayload, AddHouseHoldsPayload } from '../types/IHouseHolds'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'


export const HouseHoldsEndpoints = {
    filter: '/api/KhaneyPaniHouseHolds/FilterHouseHolds',
    add: '/api/KhaneyPaniHouseHolds/AddHouseHolds',
    update: '/api/KhaneyPaniHouseHolds/UpdateHousehold',
    delete: '/api/KhaneyPaniHouseHolds/DeleteHousehold',

    filterWaterTariffPlan: '/api/KhaneyPaniSetUp/FilterWaterTariffPlan',
}

export const HouseHoldsQueryKeys = {
    all: ['HouseHolds'],
}


const normalizeHouseHoldsPayload = (
    data: AddHouseHoldsPayload
): AddHouseHoldsPayload => ({
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
    registrationDate: String(data.registrationDate ?? '').trim()
});



const normalizeUpdateHouseHoldsPayload = (
    data: UpdateHouseHoldsPayload
): UpdateHouseHoldsPayload => ({
    id: String(data.id ?? '').trim(),
    consumerName: String(data.consumerName ?? '').trim(),
    contactNumber: String(data.contactNumber ?? '').trim(),
    familyMember: Number(data.familyMember ?? 0),
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
    registrationDate: String(data.registrationDate ?? '').trim()

});


export const useGetAllWaterTariffPlan = () => {
    return useQuery({
        queryKey: [...HouseHoldsQueryKeys.all],

        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<{
                    id: string
                    name: string
                }>
            >(HouseHoldsEndpoints.filterWaterTariffPlan, {
                params: {
                    pageSize: 10,
                    pageIndex: 1,
                    isPagination: true,
                },
            })

            return response.data
        },

        select: (response) => response?.Data.Items ?? [],

        staleTime: 1000 * 60 * 5,
    })
}



export const useGetAllHouseHolds = (queryParams?: string) => {
    return useQuery({
        queryKey: [...HouseHoldsQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${HouseHoldsEndpoints.filter}${queryParams}`
                : HouseHoldsEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<HouseHoldsResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}



export const useAddHouseHolds = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: AddHouseHoldsPayload) => {
            const normalizedPayload = normalizeHouseHoldsPayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddHouseHoldsResponse>>(
                HouseHoldsEndpoints.add,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'HouseHolds added successfully')

            queryClient.invalidateQueries({
                queryKey: HouseHoldsQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add HouseHolds'
            )
        },
    })
}


export const useDeleteHouseHolds = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(
                `${HouseHoldsEndpoints.delete}/${id}`
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'HouseHolds deleted successfully')

            queryClient.invalidateQueries({
                queryKey: HouseHoldsQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to delete HouseHolds'
            )
        },
    })
}

export const useUpdateHouseHolds = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateHouseHoldsPayload
        }) => {
            const response = await api.patch(
                `${HouseHoldsEndpoints.update}/${id}`,
                normalizeUpdateHouseHoldsPayload(payload)
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'HouseHolds updated successfully')

            queryClient.invalidateQueries({
                queryKey: HouseHoldsQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to update HouseHolds'
            )
        },
    })
}
