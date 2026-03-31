import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { ICoCurricularResponse } from "../types/Icocurricular";

const CoCurricularEndPoints = {
  getReport: "/api/SchoolReportsControllers/CoCurricularActivitiesReport",
};

const coCurricularQueryKey = "coCurricularActivities";

export const useGetCoCurricularReport = () => {
  return useQuery({
    queryKey: [coCurricularQueryKey],
    queryFn: async (): Promise<ICoCurricularResponse> => {
      const response = await api.get<ICoCurricularResponse>(
        CoCurricularEndPoints.getReport
      );
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};