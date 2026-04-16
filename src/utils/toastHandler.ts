
import { toast } from "react-hot-toast";
import { handleError } from "./handleError";
import { handleSuccess } from "./handleSuccess";

export const toastPromiseHandler = async <T>(
  promise: Promise<T>,
  loadingMessage = "Processing..."
): Promise<T> => {
  return toast.promise(promise, {
    loading: loadingMessage,
    success: (res: any) => handleSuccess(res),
    error: (err) => handleError(err),
  });
};