import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ISubject, ISubjectByClass } from "../types/ISubjects";
const SubjectEndPoints = {
  getAllSubjects: "/api/Academics/all-subject",
  createSubjects: "/api/Academics/AddSubject",
  removeSubjects: "/api/Academics/DeleteSubject",
  updateSubjects: "/api/Academics/UpdateSubjects",
  getSubjectsById: "/api/Academics",
  getSubjectByClass: "/api/Academics/SubjectByClass",
  filterSubjectByDate: "/api/Academics/FilterSubject",
};

const queryKey = "Subjects";
const queryKeyForClassID = "SubjectsByClass";
const filteredSubjectQuery = "FilteredSubjects";
type SubjectRequest = {
  id?: string;
  name: string;
  code: string;
  creditHours: number;
  description: string;
  classId: string;
  examId: string;
  fullMarks: number;
  passMarks: number;
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
      queryClient.invalidateQueries({ queryKey: [filteredSubjectQuery] });
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
      queryClient.invalidateQueries({ queryKey: [filteredSubjectQuery] });
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
      queryClient.invalidateQueries({ queryKey: [filteredSubjectQuery] });
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

export const useGetSubjectByClassId = (params?: { classId: string; examId: string }) => {
  return useQuery({
    queryKey: ['subjectByClass', params],
    queryFn: async (): Promise<ISubjectByClass[]> => {
      if (!params?.classId || !params?.examId) {
        throw new Error("Both classId and examId are required");
      }

      const queryString = `?examId=${params.examId}&classId=${params.classId}`;
      const response = await api.get<ISubjectByClass[]>(`${SubjectEndPoints.getSubjectByClass}${queryString}`);
      return response.data;
    },
    enabled: !!params?.classId && !!params?.examId,
    staleTime: 0,
    retry: false,
  });
};
