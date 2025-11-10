import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IExam } from "../types/IExams";
const ExamEndPoints = {
  getAllExams: "/api/Academics/all-exam",
  createExams: "/api/Academics/AddExam",
  removeExams: "/api/Academics/Delete",
  updateExams: "/api/Academics/UpdateExams",
  getExamsById: "/api/Academics/Exam",
  filterExamByDate: "/api/Academics/FilterExam",
};

const queryKey = "Exams";
const filteredExamQuery = "FilteredExams";
type ExamRequest = {
  id?: string;
  name: string;
  examDate: Date;
  totalMarks: number;
  passingMarks: number;
  isfinalExam: boolean;
};

export const useAddExam = () => {
  const queryClient = useQueryClient();
  return useMutation<IExam, Error, ExamRequest>({
    mutationFn: async (data: ExamRequest): Promise<IExam> => {
      console.log("Add Exam", data);
      const response = await api.post(ExamEndPoints.createExams, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["filteredExam"] });
    },
    onError: (error) => {
      console.error("Error adding Exam:", error);
    },
  });
};

export const useRemoveExam = () => {
  const queryClient = useQueryClient();
  return useMutation<IExam, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IExam> => {
      if (!Id) {
        throw new Error("Id is required to remove a Exam");
      }
      const response = await api.delete(`${ExamEndPoints.removeExams}/${Id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["filteredExam"] });
    },
  });
};

export const useEditExam = () => {
  const queryClient = useQueryClient();
  return useMutation<IExam, Error, { id: string | unknown; data: ExamRequest }>(
    {
      mutationFn: async ({ id, data }): Promise<IExam> => {
        if (!id) {
          throw new Error("Ïd is required to edit Exam");
        }
        const response = await api.patch(
          `${ExamEndPoints.updateExams}/${id}`,
          data
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["filteredExam"] });
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    }
  );
};

export const useGetExamById = (ExamId: string) => {
  return useQuery({
    queryKey: [queryKey, ExamId],
    queryFn: async (): Promise<IExam> => {
      if (!ExamId) {
        throw new Error("Id is required to get a Exam");
      }
      const response = await api.get<IExam>(
        `${ExamEndPoints.getExamsById}/${ExamId}`
      );
      return response.data;
    },
    enabled: !!ExamId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllExams = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${ExamEndPoints.getAllExams}${params}`
        : `${ExamEndPoints.getAllExams}`;
      const response = await api.get<IPaginationResponse<IExam>>(url);
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

export const useFilterExamByDate = (params?: string) => {
  return useQuery({
    queryKey: [filteredExamQuery, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${ExamEndPoints.filterExamByDate}${params}`
        : ExamEndPoints.filterExamByDate;
      const response = await api.get<IPaginationResponse<IExam>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
