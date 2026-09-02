
import axios from "axios";

// Simple approach: Always use empty baseURL
// Endpoints already have /api prefix (e.g., /api/SetupControllers/all-school)
// - Locally: rewrites proxy /api/* through next.config.ts
// - Vercel: rewrites proxy /api/* through next.config.ts
// No environment checks needed - one config works everywhere
const baseURL = "";

console.log("[API] Using relative paths with rewrites via next.config.ts");

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
      console.log("[API] Token added to Authorization header");
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
    console.log(`[API Response] ✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("[API Response Error]", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      code: error.code,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);
