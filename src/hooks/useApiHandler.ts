import { toast } from "react-hot-toast";
import { handleError } from "@/utils/handleError";
import { handleSuccess } from "@/utils/handleSuccess";
import { parseApiResponse } from "@/utils/apiResponseHandler";

export const useApiHandler = () => {
  const execute = async <TPayload, TResponse>(
    apiFunc: (payload: TPayload) => Promise<any>,
    payload: TPayload,
    options?: {
      loadingMessage?: string;
      onSuccess?: (data: TResponse) => void;
      onError?: (err: any) => void;
    }
  ): Promise<TResponse | undefined> => {
    try {
      const rawResponse = await toast.promise(apiFunc(payload), {
        loading: options?.loadingMessage || "Processing...",
        success: (res) => handleSuccess(res),
        error: (err) => handleError(err),
      });

      const parsed = parseApiResponse<TResponse>(rawResponse);

      if (!parsed.success) {
        throw parsed;
      }

      options?.onSuccess?.(parsed.data);

      return parsed.data;
    } catch (error) {
      options?.onError?.(error);
      return undefined;
    }
  };

  return { execute };
};