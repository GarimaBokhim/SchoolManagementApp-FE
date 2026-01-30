import { api } from "@/utils/instance";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { Istudentaward } from "../types/Istudentaward";

type IstudentawardRequest = {
    Id: string;
    studentId: string;
    awardedAt: string;
    awardedBy: string;
    awardDescriptions: string;
    certificateTemplateId: string;
    eventsId: string;
    contentHtml: string;
    
    
};

const StudentAwardEndPoints = {
    getAllStudentAward: "/api/Certificate/GetAllSchoolsAwards",
    filterStudentAwardByDate: "/api/Certificate/FilterStudentsAwards",
    AddStudentAward: "/api/Certificate/AddStudentsAwards",
    deleteStudentAwards: "/api/Certificate/DeleteAwards",
    getStudentAwardbyAwardId: "/api/Certificate/StudentsAwards",
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

export const useRemoveStudentAward = () => {
  const queryClient = useQueryClient();
  return useMutation<Istudentaward, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<Istudentaward> => {
      if (!Id) {
        throw new Error("Id is required to remove a School award");
      }
      const response = await api.delete(`${StudentAwardEndPoints.deleteStudentAwards}/${Id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
  });
};
export const useGetStudentAwardById = (awardsId: string) => {
  return useQuery({
    queryKey: [queryKey, awardsId],
    queryFn: async (): Promise<Istudentaward> => {
      if (!awardsId) {
        throw new Error("Id is required to get a StudentAward");
      }
      const response = await api.get<Istudentaward>(
        `${StudentAwardEndPoints.getStudentAwardbyAwardId}/${awardsId}`
      );
      return response.data;
    },
    enabled: !!awardsId,
    staleTime: 0,
    retry: false,
  });
};