import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/utils/instance"
import { Toast } from "@/components/Toast/toast"
import { IPaginationCrmResponse } from "@/types/IPaginationResponse"
import {
    AddVisaPortalPayload,
    CountryOption,
    UpdateVisaPortalPayload,
    UniversityOption,
    VisaPortalMutationResponse,
    VisaPortalResponse,
} from "../types/IVisaPortal"

export const VisaPortalEndpoints = {
    filter: "/api/VisaApplication/FilterVisaPortal",
    add: "/api/VisaApplication/AddVisaPortal",
    update: "/api/VisaApplication/UpdateVisaPortal",
    delete: "/api/VisaApplication/DeleteVisaPortal",
    byId: "/api/VisaApplication/VisaPortalById",
    countries: "/api/AcademicPrograms/GetAllCountry",
    universitiesByCountry: "/api/AcademicPrograms/UniversityByCountry",
}

export const VisaPortalQueryKeys = {
    all: ["VisaPortal"],
    byId: ["VisaPortalById"],
    countries: ["VisaPortalCountries"],
    universities: ["VisaPortalUniversities"],
}

const normalizeVisaPortalPayload = (
    payload: AddVisaPortalPayload | UpdateVisaPortalPayload
): AddVisaPortalPayload => ({
    name: payload.name.trim(),
    countryId: payload.countryId.trim(),
    universityId: payload.universityId.trim(),
    url: payload.url.trim(),
    processingTimeInDays: Number(payload.processingTimeInDays),
    note: payload.note.trim(),
})

export const useGetAllVisaPortal = (queryParams?: string) =>
    useQuery({
        queryKey: [...VisaPortalQueryKeys.all, queryParams],
        queryFn: async () => {
            const response = await api.get<IPaginationCrmResponse<VisaPortalResponse>>(
                queryParams
                    ? `${VisaPortalEndpoints.filter}${queryParams}`
                    : VisaPortalEndpoints.filter
            )
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })

export const useVisaPortalById = (id: string | null) =>
    useQuery({
        queryKey: [...VisaPortalQueryKeys.byId, id],
        queryFn: async () => {
            if (!id) throw new Error("Visa portal id is required")
            const response = await api.get<VisaPortalResponse>(
                `${VisaPortalEndpoints.byId}/${id}`
            )
            return response.data
        },
        enabled: Boolean(id),
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: true,
    })

export const useGetVisaPortalCountries = () =>
    useQuery({
        queryKey: VisaPortalQueryKeys.countries,
        queryFn: async () => {
            const response = await api.get<IPaginationCrmResponse<CountryOption>>(
                VisaPortalEndpoints.countries
            )
            return response.data.Data.Items
        },
        staleTime: 1000 * 60 * 5,
    })

export const useGetVisaPortalUniversities = (countryId: string) =>
    useQuery({
        queryKey: [...VisaPortalQueryKeys.universities, countryId],
        queryFn: async () => {
            const response = await api.get<IPaginationCrmResponse<UniversityOption>>(
                `${VisaPortalEndpoints.universitiesByCountry}/${countryId}`,
                { params: { pageSize: 10, pageIndex: 1, isPagination: false } }
            )
            return response.data.Data.Items
        },
        enabled: Boolean(countryId),
        staleTime: 1000 * 60 * 5,
    })

export const useAddVisaPortal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (payload: AddVisaPortalPayload) => {
            const response = await api.post<IPaginationCrmResponse<VisaPortalMutationResponse>>(
                VisaPortalEndpoints.add,
                normalizeVisaPortalPayload(payload)
            )
            return response.data
        },
        onSuccess: (response) => {
            Toast.success(response?.Message || "Visa portal added successfully")
            queryClient.invalidateQueries({ queryKey: VisaPortalQueryKeys.all })
        },
        onError: (error: { response?: { data?: { Message?: string } } }) => {
            Toast.error(error.response?.data?.Message || "Failed to add visa portal")
        },
    })
}

export const useUpdateVisaPortal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateVisaPortalPayload
        }) => {
            const response = await api.patch<IPaginationCrmResponse<VisaPortalMutationResponse>>(
                `${VisaPortalEndpoints.update}/${id}`,
                normalizeVisaPortalPayload(payload)
            )
            return response.data
        },
        onSuccess: (response, variables) => {
            Toast.success(response?.Message || "Visa portal updated successfully")
            queryClient.invalidateQueries({ queryKey: VisaPortalQueryKeys.all })
            queryClient.invalidateQueries({
                queryKey: [...VisaPortalQueryKeys.byId, variables.id],
            })
        },
        onError: (error: { response?: { data?: { Message?: string } } }) => {
            Toast.error(error.response?.data?.Message || "Failed to update visa portal")
        },
    })
}

export const useDeleteVisaPortal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete<VisaPortalMutationResponse>(
                `${VisaPortalEndpoints.delete}/${id}`
            )
            return response.data
        },
        onSuccess: (response) => {
            Toast.success(response?.Message || "Visa portal deleted successfully")
            queryClient.invalidateQueries({ queryKey: VisaPortalQueryKeys.all })
        },
        onError: (error: { response?: { data?: { Message?: string } } }) => {
            Toast.error(error.response?.data?.Message || "Failed to delete visa portal")
        },
    })
}
