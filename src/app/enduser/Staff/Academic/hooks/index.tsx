import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IAcademicTeam } from "../types/IAcademicTeam";
const AcademicTeamEndPoints = {
  getAllAcademicTeams: "/api/Student/all-AcademicTeams",
  createAcademicTeams: "/api/Student/AddAcademicTeam",
  removeAcademicTeams: "/api/Student/DeleteAcademicTeams",
  updateAcademicTeams: "/api/Student/UpdateAcademicTeams",
  getAcademicTeamsById: "/api/Student/GetAcademicTeamsBy",
  filterAcademicTeamByDate: "/api/Student/FilterAcademicTeams",
};

const queryKey = "AcademicTeams";
const filterAcademicTeamQueryKey = "filteredAcademicTeam";
type AcademicTeamRequest = {
  id?: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  rolesId: [string];
};

export const useAddAcademicTeam = () => {
  const queryClient = useQueryClient();
  return useMutation<IAcademicTeam, Error, AcademicTeamRequest>({
    mutationFn: async (data: AcademicTeamRequest): Promise<IAcademicTeam> => {
      console.log("Add AcademicTeam", data);
      const response = await api.post(
        AcademicTeamEndPoints.createAcademicTeams,
        data
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterAcademicTeamQueryKey] });
    },
    onError: (error) => {
      console.error("Error adding AcademicTeam:", error);
    },
  });
};

export const useRemoveAcademicTeam = () => {
  const queryClient = useQueryClient();
  return useMutation<IAcademicTeam, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IAcademicTeam> => {
      if (!Id) {
        throw new Error("Id is required to remove a AcademicTeam");
      }
      const response = await api.delete(
        `${AcademicTeamEndPoints.removeAcademicTeams}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterAcademicTeamQueryKey] });
    },
  });
};

export const useEditAcademicTeam = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAcademicTeam,
    Error,
    { id: string | unknown; data: AcademicTeamRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IAcademicTeam> => {
      if (!id) {
        throw new Error("Ïd is required to edit AcademicTeam");
      }
      const response = await api.patch(
        `${AcademicTeamEndPoints.updateAcademicTeams}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filterAcademicTeamQueryKey] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetAcademicTeamById = (AcademicTeamId: string) => {
  return useQuery({
    queryKey: [queryKey, AcademicTeamId],
    queryFn: async (): Promise<IAcademicTeam> => {
      if (!AcademicTeamId) {
        throw new Error("Id is required to get a AcademicTeam");
      }
      const response = await api.get<IAcademicTeam>(
        `${AcademicTeamEndPoints.getAcademicTeamsById}/${AcademicTeamId}`
      );
      return response.data;
    },
    enabled: !!AcademicTeamId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllAcademicTeams = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${AcademicTeamEndPoints.getAllAcademicTeams}${params}`
        : `${AcademicTeamEndPoints.getAllAcademicTeams}`;
      const response = await api.get<IPaginationResponse<IAcademicTeam>>(url);
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

export const useFilterAcademicTeamByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterAcademicTeamQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${AcademicTeamEndPoints.filterAcademicTeamByDate}${params}`
        : AcademicTeamEndPoints.filterAcademicTeamByDate;
      const response = await api.get<IPaginationResponse<IAcademicTeam>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
