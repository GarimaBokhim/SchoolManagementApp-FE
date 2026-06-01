import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationCrmResponse, IPaginationResponse } from "@/types/IPaginationResponse";
import { Appointment, AddAppointmentPayload } from "../types/IAppointment";

export const AppointmentEndPoints = {
  filterAppointments: "/api/Enrolments/FilterAppointments",
  addAppointment: "/api/Enrolments/AddAppointment",
};

export const appointmentQueryKey = "Appointments";

export const useGetAllAppointments = (queryParams?: string) => {
  return useQuery({
    queryKey: [appointmentQueryKey, queryParams],
    queryFn: async () => {
      const paramObj: Record<string, string> = {};
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ""));
        parsed.forEach((value, key) => {
          paramObj[key] = value;
        });
      }

      const response = await api.get<IPaginationCrmResponse<Appointment>>(
        AppointmentEndPoints.filterAppointments,
        { params: paramObj }
      )
      return response.data
    },
  select: (response) => ({
      items: response?.Data?.Items ?? [],
      pagination: {
        totalItems: response?.Data?.TotalItems ?? 0,
        pageIndex: response?.Data?.PageIndex ?? 1,
        pageSize: response?.Data?.pageSize ?? 10,
        totalPages: response?.Data?.TotalPages ?? 1,
      },
      message: response?.Message ?? '',
      statusCode: response?.StatusCode ?? 200,
    }),

    staleTime: 1000 * 60 * 5,
  })
};

export const useAddAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<Appointment, Error, AddAppointmentPayload>({
    mutationFn: async (payload: AddAppointmentPayload): Promise<Appointment> => {
      const response = await api.post(AppointmentEndPoints.addAppointment, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [appointmentQueryKey] });
    },
    onError: (error) => {
      console.error("Error adding appointment:", error);
    },
  });
};export const useGetAllLeads = () => {
  return useQuery({
    queryKey: ["AllLeads"],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<{ id: string; userId: string; fullName: string }>>(
        "/api/Enrolments/AllInquiry"
      );
      return response.data?.Items ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAllCounselorDetails = () => {
  return useQuery({
    queryKey: ["AllCounselorDetails"],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<{ id: string; fullName: string; email: string }>>(
        "/api/Enrolments/AllCounselor"
      );
      return response.data?.Items ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetLeadEnquiryDetails = (leadId: string) => {
  return useQuery({
    queryKey: ['LeadEnquiryDetails', leadId],
    queryFn: async () => {
      const response = await api.get(
        `/api/Enrolments/ShowLeadEnqueryDetails?leadId=${leadId}`
      )
      return response.data
    },
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000,
  })
}