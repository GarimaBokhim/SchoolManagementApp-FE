import { api } from "@/utils/instance";
import { ISchoolAward } from "../types/Ischoolaward";
import { Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Add from "@/app/SuperAdmin/accessControl/RolePermission/Pages/Add";
import { IPaginationResponse } from "@/types/IPaginationResponse";

const AwardEndPoints = {
    getAllSchoolAward: "/api/Certificate/GetAllSchoolsAwards",
    filterSchoolAwardByDate: "/api/Certificate/FilterStudentsAwards",
    AddSchoolAward: "/api/Communication/AddNotice",
}
const queryKey = "Award";
const filterQueryKey = "filteredAward";export const useFilterSchoolAwardByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params],
    queryFn: async () => {
 const url = params
        ? `${AwardEndPoints.filterSchoolAwardByDate}${params}`
        : AwardEndPoints.filterSchoolAwardByDate;

      const response =
        await api.get<IPaginationResponse<ISchoolAward>>(url);

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
