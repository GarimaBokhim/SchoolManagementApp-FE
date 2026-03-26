import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IDocument } from "../model/IDocuments";
import { DocumentEndPoints, documentQueryKey } from "../../hooks";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";

export const useAddDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<IDocument, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await api.post(DocumentEndPoints.addDocument, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [documentQueryKey] });
    },
  });
};
export const useGetAllDocumentTypesList = () => {
  return useQuery({
    queryKey: ['DocumentTypesList'],
    queryFn: async () => {
      const response = await api.get<IPaginationResponse<{ id: string; name: string }>>(
        '/api/AcademicPrograms/AllDocumentsType'
      );
      return response.data?.Items ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
};