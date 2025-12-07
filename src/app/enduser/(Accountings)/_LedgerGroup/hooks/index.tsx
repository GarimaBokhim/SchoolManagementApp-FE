import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ILedgerGroup } from "../types/ILedgerGroup";
const LedgerGroupEndPoints = {
  getAllLedgerGroups: "/api/AccountControllers/all-LedgerGroup",
  addLedgerGroups: "/api/AccountControllers/AddLedgerGroup",
  deleteLedgerGroups: "/api/AccountControllers/DeleteLedgerGroup",
  updateLedgerGroups: "/api/AccountControllers/UpdateLedgerGroup",
  getLedgerGroupsById: "/api/AccountControllers/LedgerGroup",
  filterLedgerGroup: "/api/AccountControllers/FilterLedgerGroup",
};

const queryKey = "LedgerGroups";
const queryFilterKey = "FilteredLedgerGroup";
type LedgerGroupRequest = {
  id?: string;
  name: string;
  isCustom?: boolean;
  isSeeded?: boolean;
  masterId: string;
  isPrimary?: boolean;
};

export const useGetAllLedgerGroups = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${LedgerGroupEndPoints.getAllLedgerGroups}${params}`
        : `${LedgerGroupEndPoints.getAllLedgerGroups}`;
      const response = await api.get<IPaginationResponse<ILedgerGroup>>(url);
      return response.data;
    },
  });
};

export const useAddLedgerGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<ILedgerGroup, Error, LedgerGroupRequest>({
    mutationFn: async (data: LedgerGroupRequest): Promise<ILedgerGroup> => {
      const response = await api.post(
        LedgerGroupEndPoints.addLedgerGroups,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [queryFilterKey],
      });
    },
    onError: (error) => {
      console.log("Error adding LedgerGroup", error);
    },
  });
};
export const useRemoveLedgerGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<ILedgerGroup, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<ILedgerGroup> => {
      if (!Id) {
        throw new Error("Id is required to delete LedgerGroup");
      }
      const response = await api.delete(
        `${LedgerGroupEndPoints.deleteLedgerGroups}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [queryFilterKey],
      });
    },
  });
};

export const useEditLedgerGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ILedgerGroup,
    Error,
    { id: string | unknown; data: LedgerGroupRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ILedgerGroup> => {
      if (!id) {
        throw new Error("Id is required to edit a LedgerGroup");
      }
      const response = await api.patch(
        `${LedgerGroupEndPoints.updateLedgerGroups}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [queryFilterKey],
      });
    },
  });
};
export const useGetLedgerGroupById = (LedgerGroupId: string | undefined) => {
  return useQuery({
    queryKey: [queryKey, LedgerGroupId],
    queryFn: async (): Promise<ILedgerGroup> => {
      if (!LedgerGroupId) {
        throw new Error("Id is required to get a LedgerGroup");
      }
      const response = await api.get<ILedgerGroup>(
        `${LedgerGroupEndPoints.getLedgerGroupsById}/${LedgerGroupId}`
      );
      return response.data;
    },
    enabled: !!LedgerGroupId,
    staleTime: 0,
    retry: false,
  });
};

export const useFilterLedgerGroupByDate = (params?: string) => {
  return useQuery({
    queryKey: [queryFilterKey, params],

    queryFn: async () => {
      try {
        const url = params
          ? `${LedgerGroupEndPoints.filterLedgerGroup}${params}`
          : LedgerGroupEndPoints.filterLedgerGroup;
        const response = await api.get<IPaginationResponse<ILedgerGroup>>(url);
        return response.data;
      } catch {
        throw new Error("Failed to fetch Ledger Group ");
      }
    },
    staleTime: 0,
    retry: false,
  });
};
