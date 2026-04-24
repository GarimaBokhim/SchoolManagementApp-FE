import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";

export interface IFeeStructureByStudent {
  feeStructureId: string;
  StudentId: string;
  categoryName: string;
}

const queryKey = "FeeStructureByStudent";

export const useGetFeeStructureByStudent = (studentId?: string) => {
  return useQuery({
    queryKey: [queryKey, studentId],
    queryFn: async (): Promise<IFeeStructureByStudent> => {
      const response = await api.get<IFeeStructureByStudent>(
        `/api/Finance/FeeStructureByStudent?studentId=${studentId}`
      );
      return response.data;
    },
    enabled: !!studentId?.trim(),
    staleTime: 0,
    retry: false,
  });
};