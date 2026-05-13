import { ApiResponse } from "@/types/apiResponse";

export const parseApiResponse = <T>(response: any): ApiResponse<T> => {
  return {
    success: response?.success ?? true,
    statusCode: response?.statusCode ?? 200,
    message: response?.message ?? "Success",
    data: response?.data ?? response,
    errors: response?.errors ?? null,
  };
};