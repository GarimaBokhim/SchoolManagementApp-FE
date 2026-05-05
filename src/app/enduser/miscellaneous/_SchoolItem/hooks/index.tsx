import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ISchoolItem } from "../types/ISchoolItem";
const SchoolItemEndPoints = {
  getAllSchoolItems: "/api/SchoolAssetsControllers/all-SchoolItems",
  createSchoolItems: "/api/SchoolAssetsControllers/AddSchoolItems",
  removeSchoolItems: "/api/SchoolAssetsControllers/DeleteSchoolItems",
  updateSchoolItems: "/api/SchoolAssetsControllers/UpdateSchoolItems",
  getSchoolItemsById: "/api/SchoolAssetsControllers/SchoolItems",
  filterSchoolItemByDate: "/api/SchoolAssetsControllers/FilterSchoolItems",
  getSchoolItemsByClass: "/api/SchoolAssetsControllers/GetSchoolItemByClass",
};

const queryKey = "SchoolItems";
const filterQueryKey = "filteredSchoolItem";
type SchoolItemRequest = {
  id?: string;
  name: string;
  contributorId: string;
  itemStatus: number;
  itemCondition: number;
  receivedDate: Date;
  estimatedValue: number;
  quantity: number;
  unitType: number;
};

export const useAddSchoolItem = () => {
  const queryClient = useQueryClient();

  return useMutation<ISchoolItem, Error, SchoolItemRequest>({
    mutationFn: async (formData: SchoolItemRequest): Promise<ISchoolItem> => {
      const response = await api.post(
        SchoolItemEndPoints.createSchoolItems,
        formData
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },

    onError: (error) => {
      console.error("Error adding SchoolItem:", error);
    },
  });
};

export const useRemoveSchoolItem = () => {
  const queryClient = useQueryClient();
  return useMutation<ISchoolItem, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<ISchoolItem> => {
      if (!Id) {
        throw new Error("Id is required to remove a SchoolItem");
      }
      const response = await api.delete(
        `${SchoolItemEndPoints.removeSchoolItems}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
  });
};

export const useEditSchoolItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ISchoolItem,
    Error,
    { id: string | unknown; data: SchoolItemRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ISchoolItem> => {
      if (!id) {
        throw new Error("Ïd is required to edit SchoolItem");
      }
      const response = await api.patch(
        `${SchoolItemEndPoints.updateSchoolItems}/${id}`,
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

export const useGetSchoolItemById = (SchoolItemId: string) => {
  return useQuery({
    queryKey: [queryKey, SchoolItemId],
    queryFn: async (): Promise<ISchoolItem> => {
      if (!SchoolItemId) {
        throw new Error("Id is required to get a SchoolItem");
      }
      const response = await api.get<ISchoolItem>(
        `${SchoolItemEndPoints.getSchoolItemsById}/${SchoolItemId}`
      );
      return response.data;
    },
    enabled: !!SchoolItemId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllSchoolItems = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${SchoolItemEndPoints.getAllSchoolItems}${params}`
        : `${SchoolItemEndPoints.getAllSchoolItems}`;
      const response = await api.get<IPaginationResponse<ISchoolItem>>(url);
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

export const useFilterSchoolItemByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${SchoolItemEndPoints.filterSchoolItemByDate}${params}`
        : SchoolItemEndPoints.filterSchoolItemByDate;
      const response = await api.get<IPaginationResponse<ISchoolItem>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
