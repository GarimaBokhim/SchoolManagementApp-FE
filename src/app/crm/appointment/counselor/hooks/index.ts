import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { IPaginationCrmResponse, IPaginationResponse } from "@/types/IPaginationResponse";
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

      const response = await api.get<IPaginationCrmResponse<Counselor>>(
        CounselorEndPoints.filterCounselors,
        { params: paramObj }
      )
      return response.data
    },

      select: (response) => ({
      items: response?.Data?.Items ?? [],
      pagination: {
        totalItems: response?.Data?.TotalItems ?? 0,
        pageIndex: response?.Data?.PageIndex ?? 1,
        pageSize: response?.Data?.pageSize ?? 10,
        totalPages: response?.Data?.TotalPages ?? 1,
      },
      message: response?.Message ?? '',
      statusCode: response?.StatusCode ?? 200,
    }),

    staleTime: 1000 * 60 * 5,
  })
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