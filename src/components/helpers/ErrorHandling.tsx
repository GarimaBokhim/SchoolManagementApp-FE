/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

function useErrorHandler(initialState: string | null = null) {
  const [error, setError] = useState<string | null>(initialState);

  const handleError = (err: any): string => {
    let message = "An unexpected error occurred.";

    if (err?.response) {
      const { status, data } = err.response;
      message =
        data?.message ||
        data?.error ||
        (status >= 400 && status < 500
          ? `Client Error (${status}): ${err.response?.data.errors}.`
          : status >= 500
          ? `Server Error (${status}): Please try again later.`
          : message);
    } else if (err?.status) {
      const { status, statusText } = err;
      message =
        err?.message ||
        (status >= 400 && status < 500
          ? `Client Error (${status}): ${statusText || "Invalid request"}`
          : status >= 500
          ? `Server Error (${status}): ${statusText || "Server issue"}`
          : message);
    } else if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "string") {
      message = err; // just in case backend throws plain string
    }

    console.error("Handled by hook:", err);
    setError(message);

    return message;
  };

  return { error, handleError, clearError: () => setError(null) };
}

export default useErrorHandler;
