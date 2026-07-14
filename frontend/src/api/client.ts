import axios from "axios";

// In dev, "/api" is proxied to the local backend (see vite.config.ts). In production,
// set VITE_API_BASE_URL to the deployed backend's URL (e.g. https://internsync-api.onrender.com/api).
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.detail ??
      error?.message ??
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(typeof message === "string" ? message : "Request failed"));
  }
);
