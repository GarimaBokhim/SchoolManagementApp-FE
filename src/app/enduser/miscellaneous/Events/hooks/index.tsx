import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IEvents } from "../types/IEvents";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";

const EventsEndPoints = {
  getAllEvents: "/api/Academics/GetAllEvents",
  filterEventsByDate: "/api/Academics/FilterEvents",
  getEventById: "/api/Academics/Events",
  addEvent: "/api/Academics/AddEvents",
  updateEvent: "/api/Academics/UpdateEvents",
  deleteEvent: "/api/Academics/DeleteEvents",
};

const queryKey = "Events";
const filteredEventQuery = "FilteredEvents";

type IEventRequest = {
  title: string;
  descriptions: string;
  eventsType: number;
  eventsDate: string;
  participants: string;
  eventTime: string;
  venue: string;
  chiefGuest: string;
  organizer: string;
  mentor: string;
  schoolId?: string;
};

export const useAddEvents = () => {
  const queryClient = useQueryClient();

  return useMutation<IEvents, Error, IEventRequest>({
    mutationFn: async (formData: IEventRequest): Promise<IEvents> => {
      const response = await api.post(EventsEndPoints.addEvent, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filteredEventQuery] });
    },
    onError: (error) => {
      console.error("Error adding Events:", error);
    },
  });
};

export const useRemoveEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<IEvents, Error, string | undefined>({
    mutationFn: async (id: string | undefined): Promise<IEvents> => {
      if (!id) throw new Error("Id is required to remove a Event");
      const response = await api.delete(`${EventsEndPoints.deleteEvent}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filteredEventQuery] });
    },
  });
};

export const useEditEvents = () => {
  const queryClient = useQueryClient();

  return useMutation<IEvents, Error, { Id: string; data: IEventRequest }>({
    mutationFn: async ({ Id, data }) => {
      if (!Id) throw new Error("Id is required to edit event");
      const response = await api.patch(`${EventsEndPoints.updateEvent}/${Id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filteredEventQuery] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetEventsById = (eventsId: string) => {
  return useQuery({
    queryKey: [queryKey, eventsId],
    queryFn: async (): Promise<IEvents> => {
      if (!eventsId) throw new Error("Id is required to get a Events");
      const response = await api.get<IEvents>(`${EventsEndPoints.getEventById}/${eventsId}`);
      return response.data;
    },
    enabled: !!eventsId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllEvents = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params ? `${EventsEndPoints.getAllEvents}${params}` : EventsEndPoints.getAllEvents;
      const response = await api.get<IPaginationResponse<IEvents>>(url);
      return response.data ?? { data: [], PageIndex: 0, isPagination: 1, pageSize: 10 };
    },
  });
};

export const useFilterEventsByDate = (params?: string) => {
  return useQuery({
    queryKey: [filteredEventQuery, params, queryKey],
    queryFn: async () => {
      const url = params ? `${EventsEndPoints.filterEventsByDate}${params}` : EventsEndPoints.filterEventsByDate;
      const response = await api.get<IPaginationResponse<IEvents>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};