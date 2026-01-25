import { api } from "@/utils/instance";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { Istudentaward } from "../types/Istudentaward";

type IstudentawardRequest = {
    id: string;
    studentId: string;
    awardedAt: string;
    awardedBy: string;
    awardDescriptions: string;
    schoolId: string;
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
    isActive: boolean;
};

const StudentAwardEndPoints = {
    getAllStudentAward: "/api/Certificate/GetAllSchoolsAwards",
    filterStudentAwardByDate: "/api/Certificate/FilterStudentsAwards",
    AddStudentAward: "/api/Certificate/AddStudentsAwards",
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

export const useAddStudentAward = () => {
  const queryClient = useQueryClient();

  return useMutation<Istudentaward, Error, IstudentawardRequest>({
    mutationFn: async (formData: IstudentawardRequest): Promise<Istudentaward> => {
      const response = await api.post(
        StudentAwardEndPoints.AddStudentAward,
        formData
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },

    onError: (error) => {
      console.error("Error adding Student Award:", error);
    },
  });
};
