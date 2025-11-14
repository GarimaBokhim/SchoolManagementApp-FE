import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IExamResult } from "../types/IExamResults";
const ExamResultEndPoints = {
  getAllExamResults: "/api/Academics/all-examResult",
  createExamResults: "/api/Academics/AddExamResult",
  removeExamResults: "/api/Academics/Delete",
  updateExamResults: "/api/Academics/UpdateExamResult",
  getExamResultsById: "/api/Academics/ExamResult",
  filterExamResultByDate: "/api/Academics/FilterExamResult",
};

const queryKey = "ExamResults";
const filteredExamResultQuery = "FilteredExamResults";
type ExamResultRequest = {
  id?: string;
  examId: string;
  studentId: string;
  subjectId: string;
  marksObtained: number;
  grade: string;
  remarks: string;
  isActive: boolean;
  schoolId: string;
};

export const useAddExamResult = () => {
  const queryClient = useQueryClient();
  return useMutation<IExamResult, Error, ExamResultRequest>({
    mutationFn: async (data: ExamResultRequest): Promise<IExamResult> => {
      console.log("Add ExamResult", data);
      const response = await api.post(
        ExamResultEndPoints.createExamResults,
        data
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["filteredExamResult"] });
    },
    onError: (error) => {
      console.error("Error adding ExamResult:", error);
    },
  });
};

export const useRemoveExamResult = () => {
  const queryClient = useQueryClient();
  return useMutation<IExamResult, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IExamResult> => {
      if (!Id) {
        throw new Error("Id is required to remove a ExamResult");
      }
      const response = await api.delete(
        `${ExamResultEndPoints.removeExamResults}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["filteredExamResult"] });
    },
  });
};

export const useEditExamResult = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IExamResult,
    Error,
    { id: string | unknown; data: ExamResultRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IExamResult> => {
      if (!id) {
        throw new Error("Ïd is required to edit ExamResult");
      }
      const response = await api.patch(
        `${ExamResultEndPoints.updateExamResults}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filteredExamResult"] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetExamResultById = (ExamResultId: string) => {
  return useQuery({
    queryKey: [queryKey, ExamResultId],
    queryFn: async (): Promise<IExamResult> => {
      if (!ExamResultId) {
        throw new Error("Id is required to get a ExamResult");
      }
      const response = await api.get<IExamResult>(
        `${ExamResultEndPoints.getExamResultsById}/${ExamResultId}`
      );
      return response.data;
    },
    enabled: !!ExamResultId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllExamResults = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${ExamResultEndPoints.getAllExamResults}${params}`
        : `${ExamResultEndPoints.getAllExamResults}`;
      const response = await api.get<IPaginationResponse<IExamResult>>(url);
      return (
        response.data ?? {
          data: [],
          PageIndex: 0,
          isPagination: 1,
          pageSize: 10,
        }
      );
    },
  });
};

export const useFilterExamResultByDate = (params?: string) => {
  return useQuery({
    queryKey: [filteredExamResultQuery, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${ExamResultEndPoints.filterExamResultByDate}${params}`
        : ExamResultEndPoints.filterExamResultByDate;
      const response = await api.get<IPaginationResponse<IExamResult>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
