import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IDocument, IDocumentFormData } from "../_document/model/IDocuments";
import { IDocumentType, IDocumentTypeFormData } from "../_documentType/types/IDoucumentTypes";
import { IApplicant } from "../types/IApplicants";


export const DocumentEndPoints = {
  filterDocuments: "/api/AcademicPrograms/FilterDocuments",
  addDocument: "/api/AcademicPrograms/AddDocuments",
  filterDocumentTypes: "/api/AcademicPrograms/FilterDocumentsType",
  addDocumentType: "/api/AcademicPrograms/AddDocumentsType",
  getAllApplicants: "/api/Enrolments/AllApplicant",
};

export const documentQueryKey = "Documents";
export const documentTypeQueryKey = "DocumentTypes";
export const applicantQueryKey = "Applicants";

// --- Documents ---
export const useGetAllDocuments = (queryParams?: string) => {
  return useQuery({
    queryKey: [documentQueryKey, queryParams],
    queryFn: async () => {
      const paramObj: Record<string, string> = {};
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ""));
        parsed.forEach((value, key) => { paramObj[key] = value; });
      }
      const response = await api.get<IPaginationResponse<IDocument>>(
        DocumentEndPoints.filterDocuments,
        { params: paramObj }
      );
      return response.data ?? {
        Items: [], TotalItems: 0, PageIndex: 1,
        pageSize: 9, TotalPages: 1, FirstPage: 1, LastPage: 1,
      };
    },
  });
};

export const useAddDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<IDocument, Error, IDocumentFormData>({
    mutationFn: async (data) => {
      const response = await api.post(DocumentEndPoints.addDocument, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [documentQueryKey] });
    },
  });
};

// --- Document Types ---
export const useGetAllDocumentTypes = (queryParams?: string) => {
  return useQuery({
    queryKey: [documentTypeQueryKey, queryParams],
    queryFn: async () => {
      const paramObj: Record<string, string> = {};
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ""));
        parsed.forEach((value, key) => { paramObj[key] = value; });
      }
      const response = await api.get<IPaginationResponse<IDocumentType>>(
        DocumentEndPoints.filterDocumentTypes,
        { params: paramObj }
      );
      return response.data ?? {
        Items: [], TotalItems: 0, PageIndex: 1,
        pageSize: 9, TotalPages: 1, FirstPage: 1, LastPage: 1,
      };
    },
  });
};

export const useAddDocumentType = () => {
  const queryClient = useQueryClient();
  return useMutation<IDocumentType, Error, IDocumentTypeFormData>({
    mutationFn: async (data) => {
      const response = await api.post(DocumentEndPoints.addDocumentType, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [documentTypeQueryKey] });
    },
  });
};

// --- Applicants ---
export const useGetAllApplicants = () => {
  return useQuery({
    queryKey: [applicantQueryKey],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<IApplicant>>(
        DocumentEndPoints.getAllApplicants
      );
      return response.data?.Items ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
};