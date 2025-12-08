import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { ILedgerStatementDetails } from "../types/ILedgerStatement";
import { IPaginationResponse } from "@/types/IPaginationResponse";
const queryKey = "ledger Statement";
const PartiesDetailEndPoint = {
  getPartyDetails: "/api/Report/FilterPartyStatement",
};

export const useGetPartiesDetails = (params?: string) => {
  return useQuery({
    queryKey: [queryKey, params],

    queryFn: async () => {
      try {
        const url = params
          ? `${PartiesDetailEndPoint.getPartyDetails}${params}`
          : PartiesDetailEndPoint.getPartyDetails;
        const response = await api.get<
          IPaginationResponse<ILedgerStatementDetails>
        >(url);
        return response.data;
      } catch {
        throw new Error("Failed to fetch parties ");
      }
    },
    staleTime: 0,
    retry: false,
  });
};
