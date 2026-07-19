import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ISubject, ISubjectByClass, IUpdateSubject } from "../types/ISubjects";
const SubjectEndPoints = {
  getAllSubjects: "/api/Academics/all-subject",
  createSubjects: "/api/Academics/AddSubject",
  removeSubjects: "/api/Academics/DeleteSubject",
  updateSubjects: "/api/Academics/UpdateSubject",
  getSubjectsById: "/api/Academics",
  getSubjectByClass: "/api/Academics/SubjectByClass",
  filterSubjectByDate: "/api/Academics/FilterSubject",
};

const queryKey = "Subjects";
const queryKeyForClassID = "SubjectsByClass";
const filteredSubjectQuery = "FilteredSubjects";
type SubjectRequest = {
  name: string;
  code: string;
  creditHours: number;
  description: string;
  classId: string;
};

const normalizeAddSubjectPayload = (data: SubjectRequest): SubjectRequest => ({
  name: String(data.name ?? "").trim(),
  code: String(data.code ?? "").trim(),
  creditHours: Number(data.creditHours) || 0,
  description: String(data.description ?? "").trim(),
  classId: String(data.classId ?? "").trim(),
});

export const useAddSubject = () => {
  const queryClient = useQueryClient();
  return useMutation<ISubject, Error, SubjectRequest>({
    mutationFn: async (data: SubjectRequest): Promise<ISubject> => {
      const payload = normalizeAddSubjectPayload(data);
      const response = await api.post(
        SubjectEndPoints.createSubjects,
        payload
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filteredSubjectQuery] });
      queryClient.invalidateQueries({ queryKey: [queryKeyForClassID] });
    },
    onError: (error) => {
      console.error("Error adding Subject:", error);
    },
  });
};

export const useDeleteSubject = () => {
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
    onError: (error: any) => {
      console.error("Error deleting Subject:", error);
      // Throw the error so it can be caught in the component
      throw error;
    },
  });
};


export const useEditSubject = () => {
  return useMutation({
    mutationFn: async (data: ISubject) => {
      // ✅ Normalize ID
      const id = data.id ?? data.Id;

      if (!id) {
        throw new Error("Id is required to edit Subject");
      }
      const payload: IUpdateSubject = {
        id,
        name: data.name ?? "",
        code: data.code ?? "",
        creditHours: Number(data.creditHours) || 0,
        description: data.description ?? "",
        classId: data.classId ?? "",
      };

      console.log("PATCH Payload:", payload); // 🔍 debug

      const response = await api.patch(
        `${SubjectEndPoints.updateSubjects}/${id}`,
        payload
      );

      return response.data;
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

export const useGetSubjectByClassId = (classId?: string, examId?: string) => {
  return useQuery({
    queryKey: [queryKeyForClassID, classId, examId],
    queryFn: async (): Promise<ISubjectByClass[]> => {
      if (!classId && !examId) {
        throw new Error("At least classId or examId is required to get Subjects");
      }

      const params = new URLSearchParams();
      if (classId) params.append("classId", classId);
      if (examId) params.append("examId", examId);

      const response = await api.get<ISubjectByClass[]>(
        `${SubjectEndPoints.getSubjectByClass}?${params.toString()}`
      );

      return response.data;
    },
    enabled: !!classId || !!examId,
    staleTime: 0,
    retry: false,
  });
};