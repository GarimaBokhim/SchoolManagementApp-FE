import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IFeeStructure } from "../types/IFeeStructure";
const FeeStructureEndPoints = {
  getAllFeeStructure: "/api/Finance/FeeStructure",
  createFeeStructure: "/api/Finance/AddFeeStructure",
  removeFeeStructure: "/api/Finance/DeleteFeeStructure",
  updateFeeStructure: "/api/Finance/UpdateFeeStructure",
  filterFeeStructureByDate: "/api/Finance/FilterFeeStructure",
  feestructurebyclass: "/api/Finance/FeeStructureByClass",
};

const queryKey = "FeeStructure";
const filterQueryKey = "filteredFeeStructure";
type FeeStructureRequest = {
  id: string;
  amount: number;
  classId: string;
  feeTypeId: string;
};

export const useAddFeeStructure = () => {
  const queryClient = useQueryClient();

  return useMutation<IFeeStructure, Error, FeeStructureRequest>({
    mutationFn: async (
      formData: FeeStructureRequest
    ): Promise<IFeeStructure> => {
      const response = await api.post(
        FeeStructureEndPoints.createFeeStructure,
        formData
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },

    onError: (error) => {
      console.error("Error adding FeeStructure:", error);
    },
  });
};

export const useRemoveFeeStructure = () => {
  const queryClient = useQueryClient();
  return useMutation<IFeeStructure, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IFeeStructure> => {
      if (!Id) {
        throw new Error("Id is required to remove a FeeStructure");
      }
      const response = await api.delete(
        `${FeeStructureEndPoints.removeFeeStructure}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
  });
};

export const useEditFeeStructure = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IFeeStructure,
    Error,
    { id: string | unknown; data: FeeStructureRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IFeeStructure> => {
      if (!id) {
        throw new Error("Ïd is required to edit FeeStructure");
      }
      const response = await api.patch(
        `${FeeStructureEndPoints.updateFeeStructure}/${id}`,
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

export const useGetAllFeeStructure = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${FeeStructureEndPoints.getAllFeeStructure}${params}`
        : `${FeeStructureEndPoints.getAllFeeStructure}`;
      const response = await api.get<IPaginationResponse<IFeeStructure>>(url);
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

export const useFilterFeeStructureByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${FeeStructureEndPoints.filterFeeStructureByDate}${params}`
        : FeeStructureEndPoints.filterFeeStructureByDate;
      const response = await api.get<IPaginationResponse<IFeeStructure>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};

export const useGetFeeStructureByClassId = (classId?: string) => {
  return useQuery({
    queryKey: [queryKey, classId],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IFeeStructure>>(
        `${FeeStructureEndPoints.feestructurebyclass}?classId=${classId}`
      );
      return response.data;
    },
    enabled: !!classId,
    staleTime: 0,
    retry: false,
  });
};
