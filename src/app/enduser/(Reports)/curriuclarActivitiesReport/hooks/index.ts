import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { ICoCurricularResponse } from "../types/Icocurricular";
import { IPaginationResponse } from "@/types/IPaginationResponse";

const CoCurricularEndPoints = {
  getReport: "/api/SchoolReportsControllers/CoCurricularActivitiesReport",
  getAllEvents: "/api/Academics/GetAllEvents",
};

const coCurricularQueryKey = "coCurricularActivities";
const allEventsQueryKey = "allEvents";

export interface IEvent {
  id: string;
  title: string;
  descriptions: string;
  eventsType: string;
  eventsDate: string;
  participants: string;
  eventTime: string;
  venue: string;
  chiefGuest: string;
  organizer: string;
  mentor: string;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
  isActive: boolean;
}

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

export const useGetAllEvents = () => {
  return useQuery({
    queryKey: [allEventsQueryKey],
    queryFn: async (): Promise<IEvent[]> => {
      const response = await api.get<IPaginationResponse<IEvent>>(
        CoCurricularEndPoints.getAllEvents
      );
      return response.data?.Items ?? [];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};