import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IAcademicYear, IRegistration } from "../types/IRegistration";
const RegistrationEndPoints = {
  getAllRegistration: "/api/Student/all-Registration",
  createRegistration: "/api/Student/StudentRegistration",
  removeRegistration: "/api/Student/DeleteRegistration",
  updateRegistration: "/api/Student/UpdateRegistration",
  getRegistrationById: "/api/Student/GetRegistrationBy",
  getAllAcademicYear:"/api/Student/AllAcademicYear",
  filterRegistrationByDate: "/api/Student/FilterRegisterStudents",
};

const queryKey = "Registration";
const filterRegistrationQueryKey = "filteredRegistration";
type RegistrationRequest = {
  id?: string;
  studentId: string;
  classId: string;
  academicYearId: string;
};

export const useAddRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation<IRegistration, Error, RegistrationRequest>({
    mutationFn: async (data: RegistrationRequest): Promise<IRegistration> => {
      console.log("Add Registration", data);
      const response = await api.post(
        RegistrationEndPoints.createRegistration,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterRegistrationQueryKey] });
    },
    onError: (error) => {
      console.error("Error adding Registration:", error);
    },
  });
};

export const useRemoveRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation<IRegistration, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IRegistration> => {
      if (!Id) {
        throw new Error("Id is required to remove a Registration");
      }
      const response = await api.delete(
        `${RegistrationEndPoints.removeRegistration}/${Id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterRegistrationQueryKey] });
    },
  });
};

export const useEditRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IRegistration,
    Error,
    { id: string | unknown; data: RegistrationRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IRegistration> => {
      if (!id) {
        throw new Error("Ïd is required to edit Registration");
      }
      const response = await api.patch(
        `${RegistrationEndPoints.updateRegistration}/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filterRegistrationQueryKey] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetRegistrationById = (RegistrationId: string) => {
  return useQuery({
    queryKey: [queryKey, RegistrationId],
    queryFn: async (): Promise<IRegistration> => {
      if (!RegistrationId) {
        throw new Error("Id is required to get a Registration");
      }
      const response = await api.get<IRegistration>(
        `${RegistrationEndPoints.getRegistrationById}/${RegistrationId}`,
      );
      return response.data;
    },
    enabled: !!RegistrationId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllRegistration = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${RegistrationEndPoints.getAllRegistration}${params}`
        : `${RegistrationEndPoints.getAllRegistration}`;
      const response = await api.get<IPaginationResponse<IRegistration>>(url);
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

export const useFilterRegistrationByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterRegistrationQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${RegistrationEndPoints.filterRegistrationByDate}${params}`
        : RegistrationEndPoints.filterRegistrationByDate;
      const response = await api.get<IPaginationResponse<IRegistration>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
}

export const useGetAllAcademicYear = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${RegistrationEndPoints.getAllAcademicYear}${params}`
        : `${RegistrationEndPoints.getAllAcademicYear}`;
      const response = await api.get<IPaginationResponse<IAcademicYear>>(url);
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
