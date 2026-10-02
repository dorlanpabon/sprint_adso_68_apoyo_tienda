import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      // No borramos en 403 de registro público (rol no permitido), solo en rutas protegidas
      const url = err.config?.url || "";
      if (!url.includes("/api/auth/")) {
        // Deja que el caller decida; AuthContext hace logout en 401 de /me
      }
    }
    return Promise.reject(err);
  }
);

export default api;
