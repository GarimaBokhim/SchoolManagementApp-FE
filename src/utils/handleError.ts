// utils/handleError.ts

export const handleError = (error: any): string => {
  const res = error?.response?.data;

  if (!res) return "Network error. Please try again.";

  const status = res.statusCode || res.StatusCode;

  switch (status) {
    case 400:
      return res.message || "Bad request";
    case 401:
      return "Unauthorized. Please login again.";
    case 403:
      return "You do not have permission.";
    case 404:
      return res.message || "Resource not found.";
    case 500:
      return "Server error. Please try later.";
    default:
      return res.message || "Something went wrong.";
  }
};