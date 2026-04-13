import { api } from "@/utils/instance";
import { ISchoolAward } from "../types/Ischoolaward";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IPaginationResponse } from "@/types/IPaginationResponse";

export interface ISchoolAwardRequest {
  Id: string;
  awardedAt: string;        
  awardedBy: string;
  awardDescriptions: string;
  schoolId: string;
  createdBy: string;
  createdAt: string;          
  modifiedBy: string;
  modifiedAt: string;  
  isActive: boolean;
}
const AwardEndPoints = {
    getAllSchoolAward: "/api/Certificate/FilterSchoolAwards",
    filterSchoolAwardByDate: "/api/Certificate/FilterSchoolAwards",
    AddSchoolAward: "/api/Certificate/AddSchoolsAwards",
    deleteSchoolAwards: "/api/Certificate/DeleteSchoolAwards",
    getSchoolawardsbyAwardId: "/api/Certificate/SchoolAwards",
}
const queryKey = "Award";
const filterQueryKey = "filteredAward";
export const useFilterSchoolAwardByDate = (params?: string) => {
  return useQuery({
    queryKey: [filterQueryKey, params],
    queryFn: async () => {
 const url = params
        ? `${AwardEndPoints.filterSchoolAwardByDate}${params}`
        : AwardEndPoints.filterSchoolAwardByDate;

      const response =
        await api.get<IPaginationResponse<ISchoolAward>>(url);
      return response.data;
    },
    staleTime: 0,
    retry: false,
  });
};


export const useAddSchoolAward = () => {
  const queryClient = useQueryClient();

  return useMutation<ISchoolAward, Error,ISchoolAwardRequest>({
    mutationFn: async (formData: ISchoolAwardRequest): Promise<ISchoolAward> => {
      const response = await api.post(
        AwardEndPoints.AddSchoolAward,
        formData
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },

    onError: (error) => {
      console.error("Error adding School Award:", error);
    },
  });
};
export const useRemoveSchoolAward = () => {
  const queryClient = useQueryClient();
  return useMutation<ISchoolAward, Error, string | undefined>({
    mutationFn: async (Id: string | undefined): Promise<ISchoolAward> => {
      if (!Id) {
        throw new Error("Id is required to remove a School award");
      }
      const response = await api.delete(`${AwardEndPoints.deleteSchoolAwards}/${Id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      queryClient.invalidateQueries({ queryKey: [filterQueryKey] });
    },
  });
};
export const useGetSchoolAwardById = (awardsId: string) => {
  return useQuery({
    queryKey: [queryKey, awardsId],
    queryFn: async (): Promise<ISchoolAward> => {
      if (!awardsId) {
        throw new Error("Id is required to get a IssuedCertificate");
      }
      const response = await api.get<ISchoolAward>(
        `${AwardEndPoints.getSchoolawardsbyAwardId}/${awardsId}`
      );
      return response.data;
    },
    enabled: !!awardsId,
    staleTime: 0,
    retry: false,
  });
};