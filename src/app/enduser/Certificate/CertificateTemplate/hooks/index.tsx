import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ITemplate } from "../types/ITemplate";
const TemplateEndPoints = {
  getAllTemplate: "/api/Certificate/all-certificateTemplate",
  createTemplate: "/api/Certificate/AddCertificateTemplate",
  removeTemplate: "/api/Certificate/Delete",
  updateTemplate: "/api/Certificate/UpdateCertificateTemplate",
  getTemplateById: "/api/Certificate/CertificateTemplate",
  filterTemplateByDate: "/api/Certificate/FilterCertificateTemplate",
};

const queryKey = "Template";
const filteredTemplateQuery = "FilteredTemplate";
type TemplateRequest = {
  id?: string;
  templateName: string;
  templateType: string;
  htmlTemplate: string;
  templateVersion: string;
};

export const useAddTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<ITemplate, Error, TemplateRequest>({
    mutationFn: async (data: TemplateRequest): Promise<ITemplate> => {
      const response = await api.post(TemplateEndPoints.createTemplate, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({
        queryKey: [filteredTemplateQuery],
      });
    },
    onError: (error) => {
      console.error("Error adding Template:", error);
    },
  });
};

export const useRemoveTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<ITemplate, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<ITemplate> => {
      if (!Id) {
        throw new Error("Id is required to remove a Template");
      }
      const response = await api.delete(
        `${TemplateEndPoints.removeTemplate}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({
        queryKey: [filteredTemplateQuery],
      });
    },
  });
};

export const useEditTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ITemplate,
    Error,
    { id: string | unknown; data: TemplateRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ITemplate> => {
      if (!id) {
        throw new Error("Ïd is required to edit Template");
      }
      const response = await api.patch(
        `${TemplateEndPoints.updateTemplate}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [filteredTemplateQuery],
      });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetTemplateById = (TemplateId: string) => {
  return useQuery({
    queryKey: [queryKey, TemplateId],
    queryFn: async (): Promise<ITemplate> => {
      if (!TemplateId) {
        throw new Error("Id is required to get a Template");
      }
      const response = await api.get<ITemplate>(
        `${TemplateEndPoints.getTemplateById}/${TemplateId}`
      );
      return response.data;
    },
    enabled: !!TemplateId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllTemplate = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${TemplateEndPoints.getAllTemplate}${params}`
        : `${TemplateEndPoints.getAllTemplate}`;
      const response = await api.get<IPaginationResponse<ITemplate>>(url);
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

export const useFilterTemplateByDate = (params?: string) => {
  return useQuery({
    queryKey: [filteredTemplateQuery, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${TemplateEndPoints.filterTemplateByDate}${params}`
        : TemplateEndPoints.filterTemplateByDate;
      const response = await api.get<IPaginationResponse<ITemplate>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
