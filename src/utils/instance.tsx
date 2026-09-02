
import axios from "axios";

const baseURL = (process.env.NEXT_PUBLIC_API_URL ?? "http://khaneypaniapp.runasp.net").replace(/\/+$/, "");

console.log("[API] Using backend base URL:", baseURL);

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
