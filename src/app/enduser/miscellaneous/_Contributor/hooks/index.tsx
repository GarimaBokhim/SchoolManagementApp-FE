import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IContributor } from "../types/IContributor";
const ContributorEndPoints = {
  getAllContributors: "/api/SchoolAssetsControllers/all-Contributors",
  createContributors: "/api/SchoolAssetsControllers/AddContributors",
  removeContributors: "/api/SchoolAssetsControllers/DeleteContributors",
  updateContributors: "/api/SchoolAssetsControllers/UpdateContributors",
  getContributorsById: "/api/SchoolAssetsControllers/ContributorsBy",
  filterContributorByDate: "/api/SchoolAssetsControllers/FilterContributors",
  getContributorsByClass: "/api/SchoolAssetsControllers/GetContributorByClass",
};

const queryKey = "Contributors";
const filterQueryKey = "filteredContributor";
type ContributorRequest = {
  id?: string;
  name: string;
  organization: string;
  contactNumber: string;
  email: string;
};

export const useAddContributor = () => {
  const queryClient = useQueryClient();

  return useMutation<IContributor, Error, ContributorRequest>({
    mutationFn: async (formData: ContributorRequest): Promise<IContributor> => {
      const response = await api.post(
        ContributorEndPoints.createContributors,
        formData
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },

    onError: (error) => {
      console.error("Error adding Contributor:", error);
    },
  });
};

export const useRemoveContributor = () => {
  const queryClient = useQueryClient();
  return useMutation<IContributor, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IContributor> => {
      if (!Id) {
        throw new Error("Id is required to remove a Contributor");
      }
      const response = await api.delete(
        `${ContributorEndPoints.removeContributors}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
  });
};

export const useEditContributor = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IContributor,
    Error,
    { id: string | unknown; data: ContributorRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IContributor> => {
      if (!id) {
        throw new Error("Ïd is required to edit Contributor");
      }
      const response = await api.patch(
        `${ContributorEndPoints.updateContributors}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetContributorById = (ContributorId: string) => {
  return useQuery({
    queryKey: [queryKey, ContributorId],
    queryFn: async (): Promise<IContributor> => {
      if (!ContributorId) {
        throw new Error("Id is required to get a Contributor");
      }
      const response = await api.get<IContributor>(
        `${ContributorEndPoints.getContributorsById}/${ContributorId}`
      );
      return response.data;
    },
    enabled: !!ContributorId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllContributors = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${ContributorEndPoints.getAllContributors}${params}`
        : `${ContributorEndPoints.getAllContributors}`;
      const response = await api.get<IPaginationResponse<IContributor>>(url);
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

export const useFilterContributorByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${ContributorEndPoints.filterContributorByDate}${params}`
        : ContributorEndPoints.filterContributorByDate;
      const response = await api.get<IPaginationResponse<IContributor>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
