import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IClass } from "../types/IClass";
const ClassEndPoints = {
  getAllClass: "/api/Academics/all-SchoolClass",
  createClass: "/api/Academics/AddSchoolClass",
  removeClass: "/api/Academics/DeleteClass",
  updateClass: "/api/Academics/UpdateSchoolClass",
  getClassById: "/api/Academics/SchoolClass",
  filterClassByDate: "/api/Academics/FilterSchoolClass",
};

const queryKey = "Class";
const filteredClassQuery = "FilteredClass";
type ClassRequest = {
  classId?: string;
  name: string;
};

export const useAddClass = () => {
  const queryClient = useQueryClient();
  return useMutation<IClass, Error, ClassRequest>({
    mutationFn: async (data: ClassRequest): Promise<IClass> => {
      const response = await api.post(ClassEndPoints.createClass, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filteredClassQuery] });
    },
    onError: (error) => {
      console.error("Error adding Class:", error);
    },
  });
};

export const useRemoveClass = () => {
  const queryClient = useQueryClient();
  return useMutation<IClass, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IClass> => {
      if (!Id) {
        throw new Error("Id is required to remove a Class");
      }
      const response = await api.delete(`${ClassEndPoints.removeClass}/${Id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filteredClassQuery] });
    },
  });
};

export const useEditClass = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IClass,
    Error,
    { id: string | unknown; data: ClassRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IClass> => {
      if (!id) {
        throw new Error("Ïd is required to edit Class");
      }
      const response = await api.patch(
        `${ClassEndPoints.updateClass}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [filteredClassQuery] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetClassById = (ClassId: string) => {
  return useQuery({
    queryKey: [queryKey, ClassId],
    queryFn: async (): Promise<IClass> => {
      if (!ClassId) {
        throw new Error("Id is required to get a Class");
      }
      const response = await api.get<IClass>(
        `${ClassEndPoints.getClassById}/${ClassId}`
      );
      return response.data;
    },
    enabled: !!ClassId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllClass = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${ClassEndPoints.getAllClass}${params}`
        : `${ClassEndPoints.getAllClass}`;
      const response = await api.get<IPaginationResponse<IClass>>(url);
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

export const useFilterClassByDate = (params?: string) => {
  return useQuery({
    queryKey: [filteredClassQuery, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${ClassEndPoints.filterClassByDate}${params}`
        : ClassEndPoints.filterClassByDate;
      const response = await api.get<IPaginationResponse<IClass>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
