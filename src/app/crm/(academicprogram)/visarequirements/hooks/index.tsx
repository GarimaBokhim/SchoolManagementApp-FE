import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { Toast } from '@/components/Toast/toast'
import { AddVisaRequirementResponse, VisaRequirementResponse, UpdateVisaRequirementPayload } from '../types/IVisaRequirements'
import { IPaginationCrmResponse } from '@/types/IPaginationResponse'
import { AddVisaRequirementPayload } from '../types/IVisaRequirements'


export const VisaRequirementEndpoints = {
    filter: '/api/AcademicPrograms/FilterVisaRequirements',
    add: '/api/AcademicPrograms/AddVisaRequirements',
    update: '/api/AcademicPrograms/UploadApplicantVisaRequirement',
    delete: '/api/AcademicPrograms/DeleteVisaRequirement',
    getById: '/api/AcademicPrograms/VisaRequirement',
    filterVisaStatus: '/api/VisaApplication/FilterVisaStatus',
    country: '/api/AcademicPrograms/GetAllCountry',
    CourseByUniversity: '/api/AcademicPrograms/CourseByUniversity',
    UniversityByCountry: '/api/AcademicPrograms/UniversityByCountry',

}

export const VisaRequirementQueryKeys = {
    all: ['VisaRequirement'],
    visaStatus: ['docType'],
    filterVisaStatus: ['FilterApplicant'],
    country: ['Country'],
    university: ['University'],
    course: ['Course'],
}


const normalizeUpdateVisaRequirementPayload = (data: UpdateVisaRequirementPayload): UpdateVisaRequirementPayload => ({
    id: String(data.id ?? '').trim(),
    countryId: String(data.countryId ?? '').trim(),
    universityId: String(data.universityId ?? '').trim(),
    courseId: String(data.courseId ?? '').trim(),
    updatevisaRequirementsDetailsDTOs: (data.updatevisaRequirementsDetailsDTOs ?? []).map(item => ({
        id: String(item.id ?? '').trim(),
        step: Number(item.step ?? 0),
        visaStatusId: String(item.visaStatusId ?? '').trim(),
        visaRequirementStatus: Number(item.visaRequirementStatus ?? 0),
    })),
});


const normalizeVisaRequirementPayload = (data: AddVisaRequirementPayload): AddVisaRequirementPayload => ({
    countryId: String(data.countryId ?? '').trim(),
    universityId: String(data.universityId ?? '').trim(),
    courseId: String(data.courseId ?? '').trim(),
    visaRequirementsDetailsDTOs: (data.visaRequirementsDetailsDTOs ?? []).map(item => ({
        step: Number(item.step ?? 0),
        visaStatusId: String(item.visaStatusId ?? 0),
        visaRequirementStatus: Number(item.visaRequirementStatus ?? 0),
    })),
});

export const useGetAllVisaRequirement = (queryParams?: string) => {
    return useQuery({
        queryKey: [...VisaRequirementQueryKeys.all, queryParams],
        queryFn: async () => {
            const url = queryParams
                ? `${VisaRequirementEndpoints.filter}${queryParams}`
                : VisaRequirementEndpoints.filter
            const response =
                await api.get<IPaginationCrmResponse<VisaRequirementResponse>>(url)
            return response.data.Data
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}


export const useAddVisaRequirement = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (payload: AddVisaRequirementPayload) => {
            const normalizedPayload = normalizeVisaRequirementPayload(payload)

            const response = await api.post<IPaginationCrmResponse<AddVisaRequirementResponse>>(
                VisaRequirementEndpoints.add,
                normalizedPayload
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'VisaRequirements added successfully')

            queryClient.invalidateQueries({
                queryKey: VisaRequirementQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to add VisaRequirements'
            )
        },
    })
};


export const useDeleteVisaRequirement = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(
                `${VisaRequirementEndpoints.delete}/${id}`
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'VisaRequirement deleted successfully')

            queryClient.invalidateQueries({
                queryKey: VisaRequirementQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to delete VisaRequirement'
            )
        },
    })
}

export const useUpdateVisaRequirement = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: string
            payload: UpdateVisaRequirementPayload
        }) => {
            const response = await api.patch(
                `${VisaRequirementEndpoints.update}/${id}`,
                normalizeUpdateVisaRequirementPayload(payload)
            )

            return response.data
        },

        onSuccess: (response) => {
            Toast.success(response?.Message || 'Visa Requirements updated successfully')

            queryClient.invalidateQueries({
                queryKey: VisaRequirementQueryKeys.all,
            })
        },

        onError: (error: any) => {
            Toast.error(
                error?.response?.data?.Message || 'Failed to update Visa Requirements'
            )
        },
    })
};


export const useVisaRequirementById = (VisaRequirementId: string) => {
    return useQuery({
        queryKey: ["VisaRequirementId", VisaRequirementId],

        queryFn: async (): Promise<VisaRequirementIdResponse> => {
            if (!VisaRequirementId) {
                throw new Error("Id is required to get VisaRequirement");
            }

            const response = await api.get<VisaRequirementIdResponse>(
                `${VisaRequirementEndpoints.getById}/${VisaRequirementId}`
            );

            return response.data;
        },

        staleTime: 0,
        gcTime: 0, // 
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
};



export const useGetAllVisaStatus = () => {
    return useQuery({
        queryKey: VisaRequirementQueryKeys.visaStatus,

        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<{
                    id: string
                    name: string
                }>
            >(VisaRequirementEndpoints.filterVisaStatus)

            return response.data
        },

        select: (response) => response?.Data.Items ?? [],

        staleTime: 1000 * 60 * 5,
    })
}



export const useGetAllCountry = () => {
    return useQuery({
        queryKey: VisaRequirementQueryKeys.country,

        queryFn: async () => {
            const response = await api.get<
                IPaginationCrmResponse<{
                    id: string
                    name: string
                }>
            >(VisaRequirementEndpoints.country)

            return response.data
        },

        select: (response) => response?.Data.Items ?? [],

        staleTime: 1000 * 60 * 5,
    })
}



export const useGetCourseByUniversity = (UniversityId?: string | null) => {
    return useQuery({
        queryKey: VisaRequirementQueryKeys.course,

        queryFn: async () => {
            if (!UniversityId) {
                throw new Error("Id is required to get Course");
            }
            const response = await api.get<
                IPaginationCrmResponse<{
                    id: string;
                    title: string;
                }>
            >(
                `${VisaRequirementEndpoints.CourseByUniversity}/${UniversityId}`,
                {
                    params: {
                        pageSize: 10,
                        pageIndex: 1,
                        isPagination: false,
                    },
                }
            );

            return response.data;
        },

        select: (response) => response?.Data.Items ?? [],
        enabled: !!UniversityId,
        staleTime: 1000 * 60 * 5,
    });
};




export const useGetUniversityByCountry = (CountryId?: string | null) => {
    return useQuery({
        queryKey: VisaRequirementQueryKeys.university,

        queryFn: async () => {
            if (!CountryId) {
                throw new Error("Id is required to get University");
            }
            const response = await api.get<
                IPaginationCrmResponse<{
                    id: string
                    name: string
                }>
            >(
                `${VisaRequirementEndpoints.UniversityByCountry}/${CountryId}`, {
                params: {
                    pageSize: 10,
                    pageIndex: 1,
                    isPagination: false,
                },
            });

            return response.data;
        },

        select: (response) => response?.Data.Items ?? [],
        enabled: !!CountryId,
        staleTime: 1000 * 60 * 5,
    });
};



