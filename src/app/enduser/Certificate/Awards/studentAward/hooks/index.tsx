import { api } from "@/utils/instance";

import { useQuery } from "@tanstack/react-query";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { Istudentaward } from "../types/Istudentaward";

const StudentAwardEndPoints = {
    getAllStudentAward: "/api/Certificate/GetAllSchoolsAwards",
    filterStudentAwardByDate: "/api/Certificate/FilterStudentsAwards",
    AddStudentAward: "/api/Communication/AddNotice",
}
const queryKey = "studentAward";
const filterQueryKey = "filteredstudentAward";
export const useFilterStudentAwardByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params],
    queryFn: async () => {
 const url = params
        ? `${StudentAwardEndPoints.filterStudentAwardByDate}${params}`
        : StudentAwardEndPoints.filterStudentAwardByDate;

      const response =
        await api.get<IPaginationResponse<Istudentaward>>(url);

      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
