import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ISubLedgerGroup } from "../types/ISubLedgerGroup";
const SubLedgerGroupEndPoints = {
  getAllSubLedgerGroups: "/api/AccountControllers/all-subLedgerGroup",
  addSubLedgerGroups: "/api/AccountControllers/AddSubledgerGroup",
  deleteSubLedgerGroups: "/api/AccountControllers/DeleteSubLedgerGroup",
  updateSubLedgerGroups: "/api/AccountControllers/UpdateSubLedgerGroup",
  getSubLedgerGroupsById: "/api/AccountControllers/SubLedgerGroup",
  filterSubLedgerGroup: "/api/AccountControllers/FilterSubLedgerGroup",
};

const queryKey = "SubLedgerGroups";
const filterQueryKey = "filterSubLedgerGroup";

type SubLedgerGroupRequest = {
  id?: string;
  name: string;
  isSeeded?: boolean;
  ledgerGroupId: string;
};

export const useGetAllSubLedgerGroups = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${SubLedgerGroupEndPoints.getAllSubLedgerGroups}${params}`
        : `${SubLedgerGroupEndPoints.getAllSubLedgerGroups}`;
      const response = await api.get<IPaginationResponse<ISubLedgerGroup>>(url);
      return response.data;
    },
  });
};

export const useAddSubLedgerGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<ISubLedgerGroup, Error, SubLedgerGroupRequest>({
    mutationFn: async (
      data: SubLedgerGroupRequest
    ): Promise<ISubLedgerGroup> => {
      const response = await api.post(
        SubLedgerGroupEndPoints.addSubLedgerGroups,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [filterQueryKey],
      });
    },
    onError: (error) => {
      console.log("Error adding SubLedgerGroup", error);
    },
  });
};
export const useRemoveSubLedgerGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<ISubLedgerGroup, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<ISubLedgerGroup> => {
      if (!Id) {
        throw new Error("Id is required to delete SubLedgerGroup");
      }
      const response = await api.delete(
        `${SubLedgerGroupEndPoints.deleteSubLedgerGroups}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [filterQueryKey],
      });
    },
  });
};

export const useEditSubLedgerGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ISubLedgerGroup,
    Error,
    { id: string | unknown; data: SubLedgerGroupRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ISubLedgerGroup> => {
      if (!id) {
        throw new Error("Id is required to edit a SubLedgerGroup");
      }
      const response = await api.patch(
        `${SubLedgerGroupEndPoints.updateSubLedgerGroups}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [filterQueryKey],
      });
    },
  });
};
export const useGetSubLedgerGroupById = (
  SubLedgerGroupId: string | undefined
) => {
  return useQuery({
    queryKey: [queryKey, SubLedgerGroupId],
    queryFn: async (): Promise<ISubLedgerGroup> => {
      if (!SubLedgerGroupId) {
        throw new Error("Id is required to get a SubLedgerGroup");
      }
      const response = await api.get<ISubLedgerGroup>(
        `${SubLedgerGroupEndPoints.getSubLedgerGroupsById}/${SubLedgerGroupId}`
      );
      return response.data;
    },
    enabled: !!SubLedgerGroupId,
    staleTime: 0,
    retry: false,
  });
};

export const useFilterSubLedgerGroupByDate = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],

    queryFn: async () => {
      try {
        const url = params
          ? `${SubLedgerGroupEndPoints.filterSubLedgerGroup}${params}`
          : SubLedgerGroupEndPoints.filterSubLedgerGroup;
        const response = await api.get<IPaginationResponse<ISubLedgerGroup>>(
          url
        );
        return response.data;
      } catch {
        throw new Error("Failed to fetch SubLedger Group ");
      }
    },
    staleTime: 0,
    retry: false,
  });
};
