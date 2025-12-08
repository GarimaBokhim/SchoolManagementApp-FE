import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { IJournal, IJournalStatus } from "../types/IJournal";
const JournalEndPoints = {
  getAllJournals: "/api/AccountControllers/all-journal-entry",
  createJournals: "/api/AccountControllers/AddJournal",
  removeJournals: "/api/AccountControllers/DeleteJournalEntry",
  addJournalEntryDetails: "/api/AccountControllers/AddJournalEntryDetails",
  updateJournals: "/api/AccountControllers/UpdateJournalEntry",
  getJournalsById: "/api/AccountControllers/Journal",
  filterJournalByDate: "/api/AccountControllers/FilterJournalByDate",
  getJournalCurrentRefNumber:
    "/api/AccountControllers/CurrentJournalReferenceNumber",
  getJournalStatusByCompany: "/api/Settings/GetJournalRefByCompany",
  updateJournalStatusByCompany: "/api/Settings/UpdateJournalRefByCompany",
};

const queryKey = "journals";
const filterQueryKey = "filterJournal";
type JournalRequest = {
  id?: string;
  referenceNumber?: string;
  transactionDate: string;
  description: string;
  journalEntries?: JournalEntryDetail[];
};
type JournalStatusRequest = {
  journalReferences: number;
  companyId: string;
};

type JournalEntryDetail = {
  id?: string;
  ledgerId: string;
  debitAmount: number;
  creditAmount: number;
};

export const useGetAllJournals = (params?: string) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const url = params
        ? `${JournalEndPoints.getAllJournals}${params}`
        : `${JournalEndPoints.getAllJournals}`;
      const response = await api.get<IPaginationResponse<IJournal>>(url);
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

export const useAddJournal = () => {
  const queryClient = useQueryClient();
  return useMutation<IJournal, Error, JournalRequest>({
    mutationFn: async (data: JournalRequest): Promise<IJournal> => {
      console.log("Add journal", data);
      const response = await api.post(JournalEndPoints.createJournals, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [filterQueryKey],
      });
    },
    onError: (error) => {
      console.error("Error adding journal:", error);
    },
  });
};

export const useRemoveJournal = () => {
  const queryClient = useQueryClient();
  return useMutation<IJournal, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<IJournal> => {
      if (!Id) {
        throw new Error("Id is required to remove a journal");
      }
      const response = await api.delete(
        `${JournalEndPoints.removeJournals}/${Id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [filterQueryKey],
      });
    },
  });
};

export const useEditJournal = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IJournal,
    Error,
    { id: string | unknown; data: JournalRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IJournal> => {
      if (!id) {
        throw new Error("Ïd is required to edit Journal");
      }
      const response = await api.patch(
        `${JournalEndPoints.updateJournals}/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [filterQueryKey],
      });
    },
  });
};

export const useGetJournalById = (journalId: string) => {
  return useQuery({
    queryKey: [queryKey, journalId],
    queryFn: async (): Promise<IJournal> => {
      if (!journalId) {
        throw new Error("Id is required to get a Journal");
      }
      const response = await api.get<IJournal>(
        `${JournalEndPoints.getJournalsById}/${journalId}`
      );
      return response.data;
    },
    enabled: !!journalId,
    staleTime: 0,
    retry: false,
  });
};

export const useFilterJournalByDate = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],

    queryFn: async () => {
      try {
        const url = params
          ? `${JournalEndPoints.filterJournalByDate}${params}`
          : JournalEndPoints.filterJournalByDate;
        const response = await api.get<IPaginationResponse<IJournal>>(url);
        return response.data;
      } catch {
        throw new Error("Failed to fetch Receipt");
      }
    },
    staleTime: 0,
    retry: false,
  });
};

export const useGetJournalRefByCompany = (CompanyId: string | null) => {
  return useQuery({
    queryKey: ["reference"],
    queryFn: async () => {
      const response = await api.get(
        `${JournalEndPoints.getJournalStatusByCompany}/${CompanyId}`
      );
      return response.data;
    },
  });
};

export const useUpdateJournalRefByCompany = () => {
  return useMutation<
    IJournalStatus,
    Error,
    { id: string | null; data: JournalStatusRequest }
  >({
    mutationFn: async ({ id, data }): Promise<IJournalStatus> => {
      if (!id) {
        throw new Error("Ïd is required to edit bill number generation");
      }
      const response = await api.patch(
        `${JournalEndPoints.updateJournalStatusByCompany}/${id}`,
        data
      );
      return response.data;
    },
  });
};
