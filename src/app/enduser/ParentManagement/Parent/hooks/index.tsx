import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IParent } from "../types/IParents";
const ParentEndPoints = {
  getAllParents: "/api/Student/all-Parents",
  createParents: "/api/Student/AddParent",
  removeParents: "/api/Student/DeleteParents",
  updateParents: "/api/Student/UpdateParents",
  getParentsById: "/api/Student/ParentsBy",
  filterParentByDate: "/api/Student/FilterParents",
};

const queryKey = "Parents";
const filterParentQueryKey = "filteredParent";
type ParentRequest = {
  id?: string;
  fullName: string;
  parentType: 0;
  phoneNumber: string;
  email: string;
  address: string;
  occupation: string;
  imageUrl: string;
};

export const useAddParent = () => {
  const queryClient = useQueryClient();
  return useMutation<IParent, Error, ParentRequest>({
    mutationFn: async (data: ParentRequest): Promise<IParent> => {
      console.log("Add Parent", data);
      const response = await api.post(ParentEndPoints.createParents, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterParentQueryKey] });
    },
    onError: (error) => {
      console.error("Error adding Parent:", error);
    },
  });
};

export const useRemoveParent = () => {
  const queryClient = useQueryClient();
  return useMutation<IParent, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IParent> => {
      if (!Id) {
        throw new Error("Id is required to remove a Parent");
      }
      const response = await api.delete(
        `${ParentEndPoints.removeParents}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterParentQueryKey] });
    },
  });
};

export const useEditParent = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IParent,
    Error,
    { id: string | unknown; data: ParentRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IParent> => {
      if (!id) {
        throw new Error("Ïd is required to edit Parent");
      }
      const response = await api.patch(
        `${ParentEndPoints.updateParents}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filterParentQueryKey] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetParentById = (ParentId: string) => {
  return useQuery({
    queryKey: [queryKey, ParentId],
    queryFn: async (): Promise<IParent> => {
      if (!ParentId) {
        throw new Error("Id is required to get a Parent");
      }
      const response = await api.get<IParent>(
        `${ParentEndPoints.getParentsById}/${ParentId}`
      );
      return response.data;
    },
    enabled: !!ParentId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllParents = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${ParentEndPoints.getAllParents}${params}`
        : `${ParentEndPoints.getAllParents}`;
      const response = await api.get<IPaginationResponse<IParent>>(url);
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

export const useFilterParentByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterParentQueryKey, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${ParentEndPoints.filterParentByDate}${params}`
        : ParentEndPoints.filterParentByDate;
      const response = await api.get<IPaginationResponse<IParent>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
