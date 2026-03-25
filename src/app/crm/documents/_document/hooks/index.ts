import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IDocument } from "../model/IDocuments";
import { DocumentEndPoints, documentQueryKey } from "../../hooks";
import { api } from "@/utils/instance";

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