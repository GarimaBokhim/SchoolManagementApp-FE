import { useQuery } from "@tanstack/react-query";
import { IAssetsReportResponse } from "../types/IAssetReport";
import { api } from "@/utils/instance";

const AssetsreportEndPoints = {
    getAllAssetsreport: "/api/SchoolAssetsControllers/SchoolAssetsReport",
};
    const queryKey = "assetsreport";
export const useGetAssetsReportByFyId = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${AssetsreportEndPoints.getAllAssetsreport}${params}`
        : AssetsreportEndPoints.getAllAssetsreport;

      const response = await api.get<IAssetsReportResponse>(url);
      return response.data;
    },
    enabled: !!params,
    staleTime: 0,
    retry: false,
  });
};
