import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationResponse } from "@/types/IPaginationResponse";
import { Counselor, AddCounselorPayload } from "../types/ICounselor";

export const CounselorEndPoints = {
  filterCounselors: "/api/Enrolments/FilterCounselor",
  addCounselor: "/api/Enrolments/AddCounselor",
};

export const counselorQueryKey = "Counselors";

export const useGetAllCounselors = (queryParams?: string) => {
  return useQuery({
    queryKey: [counselorQueryKey, queryParams],
    queryFn: async () => {
      const paramObj: Record<string, string> = {};
      if (queryParams) {
        const parsed = new URLSearchParams(queryParams.replace(/^&/, ""));
        parsed.forEach((value, key) => {
          paramObj[key] = value;
        });
      }

      const response = await api.get<IPaginationResponse<Counselor>>(
        CounselorEndPoints.filterCounselors,
        { params: paramObj }
      );

      return response.data ?? {
        Items: [],
        TotalItems: 0,
        PageIndex: 1,
        pageSize: 10,
        TotalPages: 1,
        FirstPage: 1,
        LastPage: 1,
      };
    },
  });
};

export const useAddCounselor = () => {
  const queryClient = useQueryClient();

  return useMutation<Counselor, Error, AddCounselorPayload>({
    mutationFn: async (payload: AddCounselorPayload): Promise<Counselor> => {
      const response = await api.post(CounselorEndPoints.addCounselor, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [counselorQueryKey] });
    },
    onError: (error) => {
      console.error("Error adding counselor:", error);
    },
  });
};