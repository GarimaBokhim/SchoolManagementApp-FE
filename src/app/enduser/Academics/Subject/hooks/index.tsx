import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ISubject } from "../types/ISubjects";
const SubjectEndPoints = {
  getAllSubjects: "/api/Academics/all-subject",
  createSubjects: "/api/Academics/AddSubject",
  removeSubjects: "/api/Academics/DeleteSubject",
  updateSubjects: "/api/Academics/UpdateSubjects",
  getSubjectsById: "/api/Academics",
  filterSubjectByDate: "/api/Academics/FilterSubject",
};

const queryKey = "Subjects";
const filteredSubjectQuery = "FilteredSubjects";
type SubjectRequest = {
  id?: string;
  name: string;
  code: string;
  creditHours: number;
  description: string;
  classId: string;
};

export const useAddSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<ISubject, Error, SubjectRequest>({
    mutationFn: async (data: SubjectRequest): Promise<ISubject> => {
      console.log("Add Subject", data);
      const response = await api.post(SubjectEndPoints.createSubjects, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["filteredSubject"] });
    },
    onError: (error) => {
      console.error("Error adding Subject:", error);
    },
  });
};

export const useRemoveSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<ISubject, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<ISubject> => {
      if (!Id) {
        throw new Error("Id is required to remove a Subject");
      }
      const response = await api.delete(
        `${SubjectEndPoints.removeSubjects}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: ["filteredSubject"] });
    },
  });
};

export const useEditSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ISubject,
    Error,
    { id: string | unknown; data: SubjectRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ISubject> => {
      if (!id) {
        throw new Error("Ïd is required to edit Subject");
      }
      const response = await api.patch(
        `${SubjectEndPoints.updateSubjects}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filteredSubject"] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetSubjectById = (SubjectId: string) => {
  return useQuery({
    queryKey: [queryKey, SubjectId],
    queryFn: async (): Promise<ISubject> => {
      if (!SubjectId) {
        throw new Error("Id is required to get a Subject");
      }
      const response = await api.get<ISubject>(
        `${SubjectEndPoints.getSubjectsById}/${SubjectId}`
      );
      return response.data;
    },
    enabled: !!SubjectId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllSubjects = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${SubjectEndPoints.getAllSubjects}${params}`
        : `${SubjectEndPoints.getAllSubjects}`;
      const response = await api.get<IPaginationResponse<ISubject>>(url);
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

export const useFilterSubjectByDate = (params?: string) => {
  return useQuery({
    queryKey: [filteredSubjectQuery, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${SubjectEndPoints.filterSubjectByDate}${params}`
        : SubjectEndPoints.filterSubjectByDate;
      const response = await api.get<IPaginationResponse<ISubject>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
