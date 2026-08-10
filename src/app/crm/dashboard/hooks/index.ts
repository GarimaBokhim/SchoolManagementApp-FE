import { useQuery } from "@tanstack/react-query";
import { QuickActionDetailsResponse } from "../types/IDashboard";
import { api } from "@/utils/instance";
import { AnnouncementResponse } from "@/app/crmadmin/(communication)/announcement/types/IAnnouncement";
import { IPaginationCrmResponse } from "@/types/IPaginationResponse";


export const DasshboardEndpoints = {
  filter: '/api/Enrolments/QuickActionDetailsCount',
  displayAnnouncement: '/api/CrmCommunication/FilterAnnouncement'
}

export const AnnouncementQueryKeys = {
  all: ['Announcement']
}

export const useGetAllAnnouncement = (queryParams?: string) => {
  return useQuery({
    queryKey: [...AnnouncementQueryKeys.all, queryParams],

    queryFn: async () => {
      const params = Object.fromEntries(
        new URLSearchParams(queryParams?.replace(/^&/, '') || '')
      )

      const response = await api.get<IPaginationCrmResponse<AnnouncementResponse>>(
        DasshboardEndpoints.displayAnnouncement,
        { params }
      )

      return response.data
    },

    select: (response) => ({
      items: response?.Data?.Items ?? [],
      pagination: {
        totalItems: response?.Data?.TotalItems ?? 0,
        pageIndex: response?.Data?.PageIndex ?? 1,
        pageSize: response?.Data?.pageSize ?? 10,
        totalPages: response?.Data?.TotalPages ?? 1,
      },
      message: response?.Message ?? '',
      statusCode: response?.StatusCode ?? 200,
    }),

    staleTime: 1000 * 60 * 5,
  })
}


export const useQuickActionDetailsCounts = () => {
  return useQuery({
    queryKey: ["QuickActionDetailsCounts"],

    queryFn: async (): Promise<QuickActionDetailsResponse> => {
      const response = await api.get<QuickActionDetailsResponse>(
        DasshboardEndpoints.filter
      );

      return response.data;
    },

    staleTime: 1000 * 60 * 5, // 5 min cache
    gcTime: 1000 * 60 * 10,   // keep in memory
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};