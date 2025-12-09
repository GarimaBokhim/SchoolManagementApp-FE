import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import {
  IAllExamSession,
  IExamSession,
  IHall,
  ISeatPlanning,
} from "../types/IExamSession";
const ExamSessionEndPoints = {
  getAllExamSessions: "/api/Academics/all-ExamSessions",
  createExamSessions: "/api/Academics/AddExamSession",
  filterExamSessionByDate: "/api/Academics/FilterExamSession",
  generateSeatPlanning: "/api/Academics/GenerateSeatPlanning",
};

const queryKey = "ExamSessions";
const seatPlanningQueryKey = "SeatPlanning";
const filterExamSessionQueryKey = "filteredExamSession";
type ExamSessionRequest = {
  id?: string;
  name: string;
  examDate: Date;
  examHallDTOs: IHall[];
};

type SeatPlanningRequest = {
  examSessionId: string;
  classIds: string[];
};
export const useAddExamSession = () => {
  const queryClient = useQueryClient();
  return useMutation<IExamSession, Error, ExamSessionRequest>({
    mutationFn: async (data: ExamSessionRequest): Promise<IExamSession> => {
      console.log("Add ExamSession", data);
      const response = await api.post(
        ExamSessionEndPoints.createExamSessions,
        data
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({
        queryKey: [filterExamSessionQueryKey],
      });
    },
    onError: (error) => {
      console.error("Error adding ExamSession:", error);
    },
  });
};

export const useGetAllExamSessions = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${ExamSessionEndPoints.getAllExamSessions}${params}`
        : `${ExamSessionEndPoints.getAllExamSessions}`;
      const response = await api.get<IPaginationResponse<IExamSession>>(url);
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

export const useFilterExamSessionByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterExamSessionQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${ExamSessionEndPoints.filterExamSessionByDate}${params}`
        : ExamSessionEndPoints.filterExamSessionByDate;
      const response = await api.get<IPaginationResponse<IAllExamSession>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};

export const useGenerateSeatPlanning = () => {
  const queryClient = useQueryClient();
  return useMutation<ISeatPlanning, Error, SeatPlanningRequest>({
    mutationFn: async (data: SeatPlanningRequest): Promise<ISeatPlanning> => {
      const response = await api.post(
        ExamSessionEndPoints.generateSeatPlanning,
        data
      );
      console.log(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [seatPlanningQueryKey],
      });
    },
    onError: (error) => {
      console.error("Error adding ExamSession:", error);
    },
  });
};
