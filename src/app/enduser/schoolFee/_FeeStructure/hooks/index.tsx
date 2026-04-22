import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IFeeStructure, IFeeStructureDTO } from "../types/IFeeStructure";

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

// Updated to match new API schema
type FeeStructureRequest = {
  classId: string;
  feeCategoryId: string;
  feeStructureDTOs: IFeeStructureDTO[];
};

const normalizeFeeStructureDto = (raw: Record<string, unknown>): IFeeStructureDTO => ({
  id: String(raw.id ?? raw.Id ?? ""),
  feeTypeId: String(raw.feeTypeId ?? raw.FeeTypeId ?? ""),
  amount: Number(raw.amount ?? raw.Amount ?? 0),
  discountAmount: Number(raw.discountAmount ?? raw.DiscountAmount ?? 0),
  times: Number(raw.times ?? raw.Times ?? 1),
  totalAmount: Number(raw.totalAmount ?? raw.TotalAmount ?? 0),
  feePaidType: Number(raw.feePaidType ?? raw.FeePaidType ?? 1),
  discountPercentage: Number(raw.discountPercentage ?? raw.DiscountPercentage ?? 0),
  feeTypeName: String(raw.feeTypeName ?? raw.FeeTypeName ?? ""),
});

const normalizeFeeStructure = (data: unknown): IFeeStructure => {
  const raw = data as Record<string, unknown>;
  const dtoRaw =
    raw.feeStructureDTOs ??
    raw.FeeStructureDTOs ??
    raw.feeStructureDtos ??
    [];
  const dtoArray = Array.isArray(dtoRaw) ? dtoRaw : [];

  return {
    ...(data as IFeeStructure),
    id: String(raw.id ?? raw.Id ?? ""),
    classId: String(raw.classId ?? raw.ClassId ?? ""),
    feeCategoryId: String(raw.feeCategoryId ?? raw.FeeCategoryId ?? ""),
    feeCategoryName: String(raw.feeCategoryName ?? raw.FeeCategoryName ?? ""),
    totalAmount: Number(raw.totalAmount ?? raw.TotalAmount ?? 0),
    discountAmount: Number(raw.discountAmount ?? raw.DiscountAmount ?? 0),
    isActive:
      typeof (raw.isActive ?? raw.IsActive) === "boolean"
        ? (raw.isActive ?? raw.IsActive) as boolean
        : true,
    feeStructureDTOs: dtoArray.map((item) =>
      normalizeFeeStructureDto(item as Record<string, unknown>)
    ),
  };
};

export const useAddFeeStructure = () => {
  const queryClient = useQueryClient();
  return useMutation<IFeeStructure, Error, FeeStructureRequest>({
    mutationFn: async (formData: FeeStructureRequest): Promise<IFeeStructure> => {
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
      if (!Id) throw new Error("Id is required to remove a FeeStructure");
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
      if (!id) throw new Error("Id is required to edit FeeStructure");
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
        : FeeStructureEndPoints.getAllFeeStructure;
      const response = await api.get<IPaginationResponse<IFeeStructure>>(url);
      return response.data ?? { data: [], PageIndex: 0, isPagination: 1, pageSize: 10 };
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

export const useGetFeeStructureById = (id?: string) => {
  return useQuery({
    queryKey: [queryKey, "byId", id],
    queryFn: async () => {
      const response = await api.get<unknown>(
        `${FeeStructureEndPoints.getAllFeeStructure}/${id}`
      );
      return normalizeFeeStructure(response.data);
    },
    enabled: !!id,
    staleTime: 0,
    retry: false,
  });
};
