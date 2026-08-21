import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationCrmResponse } from "@/types/IPaginationResponse";
import {
  BillingRegisterItem,
  ConsumerStatementResponse,
  DailyCollectionItem,
  DueReportsResponse,
} from "../types/reports.types";

// Same backend endpoints used by khaneypaniadmin/(reports) - self-contained for scalability.
export const ReportEndpoints = {
  billingRegister: "/api/KhaneyPaniReport/BillingRegisterReport",
  dailyCollection: "/api/KhaneyPaniReport/DailyCollectionReport",
  dueReports: "/api/KhaneyPaniReport/DueReports",
  consumerStatement: "/api/KhaneyPaniReport/ConsumerStatementReport",
};

export const ReportQueryKeys = {
  billingRegister: ["elitekhaneypani-billing-register"],
  dailyCollection: ["elitekhaneypani-daily-collection"],
  dueReports: ["elitekhaneypani-due-reports"],
  consumerStatement: (houseHoldId: string) => ["elitekhaneypani-consumer-statement", houseHoldId],
};

export const useGetBillingRegister = (queryParams?: string) => {
  return useQuery({
    queryKey: [...ReportQueryKeys.billingRegister, queryParams],
    queryFn: async () => {
      const url = queryParams ? `${ReportEndpoints.billingRegister}${queryParams}` : ReportEndpoints.billingRegister;
      const response = await api.get<IPaginationCrmResponse<BillingRegisterItem>>(url);
      return response.data.Data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useGetDailyCollection = (queryParams?: string) => {
  return useQuery({
    queryKey: [...ReportQueryKeys.dailyCollection, queryParams],
    queryFn: async () => {
      const url = queryParams ? `${ReportEndpoints.dailyCollection}${queryParams}` : ReportEndpoints.dailyCollection;
      const response = await api.get<IPaginationCrmResponse<DailyCollectionItem>>(url);
      return response.data.Data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useGetDueReports = (queryParams?: string) => {
  return useQuery<DueReportsResponse>({
    queryKey: [...ReportQueryKeys.dueReports, queryParams],
    queryFn: async () => {
      const url = queryParams ? `${ReportEndpoints.dueReports}${queryParams}` : ReportEndpoints.dueReports;
      const response = await api.get(url);
      return response.data.Data as DueReportsResponse;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};

export const useGetConsumerStatement = (houseHoldId?: string) => {
  return useQuery<ConsumerStatementResponse>({
    queryKey: ReportQueryKeys.consumerStatement(houseHoldId ?? ""),
    queryFn: async () => {
      if (!houseHoldId) throw new Error("Household ID is required.");
      const response = await api.get(ReportEndpoints.consumerStatement, {
        params: { houseHoldId },
      });
      return response.data.Data;
    },
    enabled: Boolean(houseHoldId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
