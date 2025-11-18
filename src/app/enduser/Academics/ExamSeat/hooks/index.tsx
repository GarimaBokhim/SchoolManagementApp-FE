import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IExamSeat } from "../types/IExamSeat";
const ExamSeatEndPoints = {
  getAllExamSeat: "/api/Academics/all-ExamSeat",
  createExamSeat: "/api/Academics/AddExamSeat",
  removeExamSeat: "/api/Academics/Delete",
  updateExamSeat: "/api/Academics/UpdateExamSeat",
  getExamSeatsById: "/api/Academics/ExamSeat",
  generateMarkSheet: "/api/Academics/MarkSheet",
  filterExamSeatByDate: "/api/Academics/FilterExamSeat",
};

const queryKey = "ExamSeats";
const filteredExamSeatQuery = "FilteredExamSeats";
type ExamSeatRequest = {
  id?: string;
  examId: string;
  studentId: string;
  remarks?: string;
  marksObtained: {
    subjectId: string;
    marksObtained: number;
  }[];
};

export const useAddExamSeat = () => {
  const queryClient = useQueryClient();
  return useMutation<IExamSeat, Error, ExamSeatRequest>({
    mutationFn: async (data: ExamSeatRequest): Promise<IExamSeat> => {
      console.log("Add ExamSeat", data);
      const response = await api.post(ExamSeatEndPoints.createExamSeat, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["filteredExamSeat"] });
    },
    onError: (error) => {
      console.error("Error adding ExamSeat:", error);
    },
  });
};

export const useRemoveExamSeat = () => {
  const queryClient = useQueryClient();
  return useMutation<IExamSeat, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IExamSeat> => {
      if (!Id) {
        throw new Error("Id is required to remove a ExamSeat");
      }
      const response = await api.delete(
        `${ExamSeatEndPoints.removeExamSeat}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["filteredExamSeat"] });
    },
  });
};

export const useEditExamSeat = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IExamSeat,
    Error,
    { id: string | unknown; data: ExamSeatRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IExamSeat> => {
      if (!id) {
        throw new Error("Ïd is required to edit ExamSeat");
      }
      const response = await api.patch(
        `${ExamSeatEndPoints.updateExamSeat}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filteredExamSeat"] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetExamSeatById = (ExamSeatId: string) => {
  return useQuery({
    queryKey: [queryKey, ExamSeatId],
    queryFn: async (): Promise<IExamSeat> => {
      if (!ExamSeatId) {
        throw new Error("Id is required to get a ExamSeat");
      }
      const response = await api.get<IExamSeat>(
        `${ExamSeatEndPoints.getExamSeatsById}/${ExamSeatId}`
      );
      return response.data;
    },
    enabled: !!ExamSeatId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllExamSeats = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${ExamSeatEndPoints.getAllExamSeat}${params}`
        : `${ExamSeatEndPoints.getAllExamSeat}`;
      const response = await api.get<IPaginationResponse<IExamSeat>>(url);
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

export const useFilterExamSeatByDate = (params?: string) => {
  return useQuery({
    queryKey: [filteredExamSeatQuery, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${ExamSeatEndPoints.filterExamSeatByDate}${params}`
        : ExamSeatEndPoints.filterExamSeatByDate;
      const response = await api.get<IPaginationResponse<IExamSeat>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};

// export const useGenerateMarkSheet = (studentId: string, examId: string) => {
//   return useQuery({
//     queryKey: [queryKey, studentId],
//     queryFn: async (): Promise<IMarkSheet> => {
//       if (!studentId) {
//         throw new Error("Id is required to get a IssuedCertificate");
//       }
//       const response = await api.get<IMarkSheet>(
//         `${ExamSeatEndPoints.generateMarkSheet}?studentId=${studentId}&examId=${examId}`
//       );
//       return response.data;
//     },
//     enabled: !!studentId,
//     staleTime: 0,
//     retry: false,
//   });
// };
