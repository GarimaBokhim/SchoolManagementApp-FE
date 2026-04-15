import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IFeeCategory } from "../types/IFeeCatory";

const FeeCategoryEndPoints = {
  getAllFeeCategories: "/api/Finance/FeeCategory",
  createFeeCategory: "/api/Finance/AddFeeCategory",
  removeFeeCategory: "/api/Finance/DeleteFeeCategory",
  updateFeeCategory: "/api/Finance/UpdateFeeCategory",
  filterFeeCategory: "/api/Finance/FilterFeeCategory",
};

const queryKey = "FeeCategories";
const filterQueryKey = "filteredFeeCategory";

type UpdateFeeCategoryRequest = {
  name: string;
  description: string;
};

// Full FeeCategory request for create
type FeeCategoryRequest = {
  id?: string;
  name: string;
  description: string;
  fyId: string;
  isActive: boolean;
};

export const useAddFeeCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<IFeeCategory, Error, FeeCategoryRequest>({
    mutationFn: async (formData: FeeCategoryRequest): Promise<IFeeCategory> => {
      const response = await api.post(
        FeeCategoryEndPoints.createFeeCategory,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
    onError: (error) => {
      console.error("Error adding FeeCategory:", error);
    },
  });
};

export const useRemoveFeeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<IFeeCategory, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IFeeCategory> => {
      if (!Id) throw new Error("Id is required to remove a FeeCategory");
      const response = await api.delete(
        `${FeeCategoryEndPoints.removeFeeCategory}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
  });
};

// Updated useEditFeeCategory hook that only sends name and description
export const useEditFeeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IFeeCategory,
    Error,
    { id: string | unknown; data: UpdateFeeCategoryRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IFeeCategory> => {
      if (!id) throw new Error("Id is required to edit FeeCategory");
      const response = await api.patch(
        `${FeeCategoryEndPoints.updateFeeCategory}/${id}`,
        data // Now only sends { name, description }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {
      console.error("Error updating FeeCategory:", error);
    },
  });
};

// Alias for useEditFeeCategory to match your naming convention
export const useUpdateFeeCategory = useEditFeeCategory;

export const useGetAllFeeCategories = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${FeeCategoryEndPoints.getAllFeeCategories}${params}`
        : FeeCategoryEndPoints.getAllFeeCategories;
      const response = await api.get<IPaginationResponse<IFeeCategory>>(url);
      return response.data ?? { data: [], PageIndex: 0, isPagination: 1, pageSize: 10 };
    },
  });
};

export const useFilterFeeCategoryByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${FeeCategoryEndPoints.filterFeeCategory}${params}`
        : FeeCategoryEndPoints.filterFeeCategory;
      const response = await api.get<IPaginationResponse<IFeeCategory>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};