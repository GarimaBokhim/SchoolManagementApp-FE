import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IFeeType } from "../types/IFeeType";
const FeeTypeEndPoints = {
  getAllFeeTypes: "/api/Finance/Feetype",
  createFeeTypes: "/api/Finance/AddFeetype",
  removeFeeTypes: "/api/Finance/DeleteFeeTypes",
  updateFeeTypes: "/api/Finance/UpdateFeeTypes",
  filterFeeTypeByDate: "/api/Finance/FilterFeetype",
};

const queryKey = "FeeTypes";
const filterQueryKey = "filteredFeeType";
type FeeTypeRequest = {
  id?: string;
  name: string;
  description: string;
  nameOfMonths: number;
};

export const useAddFeeType = () => {
  const queryClient = useQueryClient();

  return useMutation<IFeeType, Error, FeeTypeRequest>({
    mutationFn: async (formData: FeeTypeRequest): Promise<IFeeType> => {
      const response = await api.post(
        FeeTypeEndPoints.createFeeTypes,
        formData
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },

    onError: (error) => {
      console.error("Error adding FeeType:", error);
    },
  });
};

export const useRemoveFeeType = () => {
  const queryClient = useQueryClient();
  return useMutation<IFeeType, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IFeeType> => {
      if (!Id) {
        throw new Error("Id is required to remove a FeeType");
      }
      const response = await api.delete(
        `${FeeTypeEndPoints.removeFeeTypes}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
  });
};

export const useEditFeeType = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IFeeType,
    Error,
    { id: string | unknown; data: FeeTypeRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IFeeType> => {
      if (!id) {
        throw new Error("Ïd is required to edit FeeType");
      }
      const response = await api.patch(
        `${FeeTypeEndPoints.updateFeeTypes}/${id}`,
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

export const useGetAllFeeTypes = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${FeeTypeEndPoints.getAllFeeTypes}${params}`
        : `${FeeTypeEndPoints.getAllFeeTypes}`;
      const response = await api.get<IPaginationResponse<IFeeType>>(url);
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

export const useFilterFeeTypeByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${FeeTypeEndPoints.filterFeeTypeByDate}${params}`
        : FeeTypeEndPoints.filterFeeTypeByDate;
      const response = await api.get<IPaginationResponse<IFeeType>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
