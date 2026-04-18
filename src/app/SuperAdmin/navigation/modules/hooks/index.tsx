import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IModules, IModulesByRoleId } from "../types/IModules";

const modulesEndPoints = {
  getAllModules: "/api/RoleModuleControllers/all-modules",
  createModules: "/api/RoleModuleControllers/AddModules",
  getModuleById: "/api/RoleModuleControllers/Modules",
  getModuleByRoleId: "/api/RoleModuleControllers/GetModulesByRoleId",
  removeModules: "api/RoleModuleControllers/Delete",
  updateModules: "/api/RoleModuleControllers/UpdateModules",
  assignModules: "/api/RoleModuleControllers/AssignModules",
  filterModulesByDate: "/api/RoleModuleControllers/FilterModulesByDate",
  getAppNames: "/api/RoleModuleControllers/AppNames",
};

const queryKey = "modules";

type ModuleRequest = {
  id?: string;
  name: string;
  description: string;
  targetUrl: string;
  isActive: boolean;
  iconUrl: string;
  rank: string;
  appId: string;
};

export const useGetAppNames = () => {
  return useQuery({
    queryKey: ["appNames"],
    queryFn: async () => {
      const response = await api.get<{
        Items: { Id: string; Name: string }[];
      }>(modulesEndPoints.getAppNames);
      return response.data.Items;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetModuleByRoleId = (id: string) => {
  return useQuery({
    queryKey: [queryKey + id],
    queryFn: async () => {
      const response = await api.get<IModulesByRoleId[]>(
        `${modulesEndPoints.getModuleByRoleId}/${id}`
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllModules = (params?: string) => {
  return useQuery({
    queryKey: ["modules", params], // Include params in query key
    queryFn: async () => {
      const url = params
        ? `${modulesEndPoints.getAllModules}${params}`
        : `${modulesEndPoints.getAllModules}`;
      const response = await api.get<IPaginationResponse<IModules>>(url);
      console.log("API Response:", response.data); // Debug log
      return response.data;
    },
    staleTime: 0, // Set to 0 to always fetch fresh data
    retry: 1,
  });
};

export const useGetModulesById = (Id: string) => {
  return useQuery({
    queryKey: [queryKey, Id],
    queryFn: async () => {
      const response = await api.get(
        `${modulesEndPoints.getModuleById}/${Id}`
      );
      return response.data;
    },
    enabled: !!Id,
    staleTime: 0,
    retry: false,
  });
};

export const useAddModule = () => {
  const queryClient = useQueryClient();
  return useMutation<IModules, Error, ModuleRequest>({
    mutationFn: async (data: ModuleRequest): Promise<IModules> => {
      const response = await api.post(modulesEndPoints.createModules, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.refetchQueries({ queryKey: ["modules"] });
    },
    onError: (error: Error) => {
      console.error("Error adding module:", error);
    },
  });
};

// CORRECTED VERSION - Fixed the syntax error
export const useEditModule = () => {
  const queryClient = useQueryClient();
  return useMutation<IModules, Error, { id: string | unknown; data: ModuleRequest }>({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | unknown;
      data: ModuleRequest;
    }): Promise<IModules> => {
      if (!id) {
        throw new Error("Id is required to edit a module");
      }
      const response = await api.patch(
        `${modulesEndPoints.updateModules}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.refetchQueries({ queryKey: ["modules"] });
    },
    onError: (error: Error) => {
      console.error("Error editing module:", error);
    },
  });
};

export const useRemoveModule = () => {
  const queryClient = useQueryClient();
  return useMutation<IModules, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IModules> => {
      if (!Id) {
        throw new Error("Id is required to delete a module");
      }
      const response = await api.delete(
        `${modulesEndPoints.removeModules}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.refetchQueries({ queryKey: ["modules"] });
    },
    onError: (error: Error) => {
      console.error("Error removing module:", error);
    },
  });
};

export const useGetFilterModulesByDate = (
  startDate: string,
  endDate: string,
  name: string | null
) => {
  return useQuery({
    queryKey: [queryKey, name, startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate || !name) {
        throw new Error("StartDate and EndDate are required to get Modules");
      }
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        name,
      });
      const response = await api.get<IModules[]>(
        `${modulesEndPoints.filterModulesByDate}?${queryParams.toString()}`
      );
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};