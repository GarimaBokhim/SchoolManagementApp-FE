
import axios from "axios";

// Determine base URL based on environment
// Local: Use direct API URL
// Vercel Production: Use rewrites (/api proxies to backend via next.config.ts)
const getBaseURL = () => {
  if (typeof window === "undefined") {
    // Server-side: use full URL
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Client-side
  const isProduction = process.env.NODE_ENV === "production";
  const isVercel = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  if (isProduction && isVercel) {
    // On Vercel production: use rewrites
    return "/api";
  }

  // Local development or preview: use full URL
  return process.env.NEXT_PUBLIC_API_URL;
};

const baseURL = getBaseURL();
console.log("[API] Base URL:", baseURL, "| Environment:", process.env.NODE_ENV);

export const api = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);

    if (config.url?.includes("/Authentication/login")) {
      return config;
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("[API] Token found and added to request");
    }
    return config;
  },
  (err) => {
    console.error("[API Request Error]", err.message);
    return Promise.reject(err);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    const errorDetails = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      code: error.code,
      data: error.response?.data,
    };

    console.error("[API Response Error]", errorDetails);

    if (error.code === "ECONNABORTED") {
      console.error("🔴 Request timeout - server took too long to respond");
    } else if (error.code === "ERR_NETWORK" || !error.response) {
      console.error("🔴 Network error - cannot reach API at:", baseURL);
      console.error("Make sure:", {
        "API is running": process.env.NEXT_PUBLIC_API_URL,
        "Local dev uses direct URL": "http://khaneypaniapp.runasp.net",
        "Vercel uses rewrites": "through next.config.ts",
      });
    } else if (error.response?.status === 404) {
      console.error("🔴 Endpoint not found - check API path");
    } else if (error.response?.status === 401) {
      console.error("🔴 Unauthorized - token expired or invalid");
    } else if (error.response?.status === 403) {
      console.error("🔴 Forbidden - you don't have permission");
    }

    return Promise.reject(error);
  }
);
