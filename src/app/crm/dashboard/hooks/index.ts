import { useQuery } from "@tanstack/react-query";
import { QuickActionDetailsResponse } from "../types/IDashboard";
import { api } from "@/utils/instance";


export const DasshboardEndpoints = {
  filter: '/api/Enrolments/QuickActionDetailsCount',
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