import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { ICertificate, IIssuedCertificate } from "../types/IIssuedCertificate";
const IssuedCertificateEndPoints = {
  getAllIssuedCertificate: "/api/Certificate/all-issuedCertificate",
  createIssuedCertificate: "/api/Certificate/AddIssuedCertificate",
  removeIssuedCertificate: "/api/Certificate/DeleteIssuedCertificate",
  updateIssuedCertificate: "/api/Certificate/UpdateIssuedCertificate",
  getIssuedCertificateById: "/api/Certificate/IssuedCertificateById",
  filterIssuedCertificateByDate: "/api/Certificate/FilterIssuedCertificate",
  generateCertificate: "/api/Certificate/GenerateCertificateByStudent",
};

const queryKey = "IssuedCertificate";
const filteredIssuedCertificateQuery = "FilteredIssuedCertificate";
type IssuedCertificateRequest = {
  id?: string;
  templateId: string;
  studentId: string;
  certificateNumber: string;
  issuedDate: Date;
  issuedBy: string;
  pdfPath: string;
  remarks: string;
  status: number;
  yearOfCompletion: Date;
  program: string;
  symbolNumber: string;
};

export const useAddIssuedCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation<IIssuedCertificate, Error, IssuedCertificateRequest>({
    mutationFn: async (
      data: IssuedCertificateRequest
    ): Promise<IIssuedCertificate> => {
      const response = await api.post(
        IssuedCertificateEndPoints.createIssuedCertificate,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({
        queryKey: [filteredIssuedCertificateQuery],
      });
    },
    onError: (error) => {
      console.error("Error adding IssuedCertificate:", error);
    },
  });
};

export const useRemoveIssuedCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation<IIssuedCertificate, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IIssuedCertificate> => {
      if (!Id) {
        throw new Error("Id is required to remove a IssuedCertificate");
      }
      const response = await api.delete(
        `${IssuedCertificateEndPoints.removeIssuedCertificate}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({
        queryKey: [filteredIssuedCertificateQuery],
      });
    },
  });
};

export const useEditIssuedCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IIssuedCertificate,
    Error,
    { id: string | unknown; data: IssuedCertificateRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IIssuedCertificate> => {
      if (!id) {
        throw new Error("Ïd is required to edit IssuedCertificate");
      }
      const response = await api.patch(
        `${IssuedCertificateEndPoints.updateIssuedCertificate}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [filteredIssuedCertificateQuery],
      });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};

export const useGetIssuedCertificateById = (IssuedCertificateId: string) => {
  return useQuery({
    queryKey: [queryKey, IssuedCertificateId],
    queryFn: async (): Promise<IIssuedCertificate> => {
      if (!IssuedCertificateId) {
        throw new Error("Id is required to get a IssuedCertificate");
      }
      const response = await api.get<IIssuedCertificate>(
        `${IssuedCertificateEndPoints.getIssuedCertificateById}/${IssuedCertificateId}`
      );
      return response.data;
    },
    enabled: !!IssuedCertificateId,
    staleTime: 0,
    retry: false,
  });
};

export const useGetAllIssuedCertificate = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const url = params
        ? `${IssuedCertificateEndPoints.getAllIssuedCertificate}${params}`
        : `${IssuedCertificateEndPoints.getAllIssuedCertificate}`;
      const response = await api.get<IPaginationResponse<IIssuedCertificate>>(
        url
      );
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

export const useFilterIssuedCertificateByDate = (params?: string) => {
  return useQuery({
    queryKey: [filteredIssuedCertificateQuery, params, queryKey],
    queryFn: async () => {
      const url = params
        ? `${IssuedCertificateEndPoints.filterIssuedCertificateByDate}${params}`
        : IssuedCertificateEndPoints.filterIssuedCertificateByDate;
      const response = await api.get<IPaginationResponse<IIssuedCertificate>>(
        url
      );
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};
export const useGenerateCertificateByStudent = (studentId: string) => {
  return useQuery({
    queryKey: [queryKey, studentId],
    queryFn: async (): Promise<ICertificate> => {
      if (!studentId) {
        throw new Error("Id is required to get a IssuedCertificate");
      }
      const response = await api.get<ICertificate>(
        `${IssuedCertificateEndPoints.generateCertificate}/${studentId}`
      );
      return response.data;
    },
    enabled: !!studentId,
    staleTime: 0,
    retry: false,
  });
};
