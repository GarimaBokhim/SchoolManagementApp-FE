// utils/handleError.ts

export const handleError = (error: any): string => {
  console.log("Full error object:", error); // Debug log
  
  // Check for network error (no response at all)
  if (!error?.response) {
    return `Network error: ${error?.message || "Unable to reach server"}. Check if API is running at ${process.env.NEXT_PUBLIC_API_URL}`;
  }

  const res = error.response.data;
  const status = error.response.status; // Use status from response object

  switch (status) {
    case 0:
      return `Connection refused. API not accessible at ${process.env.NEXT_PUBLIC_API_URL}`;
    case 400:
      return res?.message || res?.Message || "Bad request";
    case 401:
      return "Unauthorized. Please login again.";
    case 403:
      return "You do not have permission.";
    case 404:
      return res?.message || res?.Message || "Resource not found.";
    case 500:
      return "Server error. Please try later.";
    case 503:
      return "Service unavailable. Server is down.";
    default:
      return res?.message || res?.Message || `Error ${status}: ${error?.message}`;
  }
};