
import axios from "axios";

// Use relative paths for API calls (Vercel rewrites will proxy to backend)
// This avoids Mixed Content issues when HTTPS frontend talks to HTTP backend
const baseURL = "/api";

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
    console.log(`[API Response] ${response.status} ${response.config.url}`);
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

    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - server took too long to respond");
    } else if (!error.response) {
      console.error("Network error - cannot reach API backend");
    }

);
