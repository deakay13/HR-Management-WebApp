import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "@/stores/authStores/useAuthStore";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development" ? "http://localhost:5000/" : "/api/",
  withCredentials: true,
});

//Refresh page with accesstoken
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

//auto refresh when expires
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    //check api - skip auth endpoints
    if (
      originalRequest.url.includes("/api/auth/signin") ||
      originalRequest.url.includes("/api/auth/refresh")
    ) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    // 403 from JWT expired (not permission denied) — retry with refresh
    const is403 = error.response?.status === 403;
    const isPermissionDenied =
      error.response?.data?.message === "Không có quyền truy cập";

    if (is403 && !isPermissionDenied && originalRequest._retryCount < 1) {
      originalRequest._retryCount += 1;
      try {
        const res = await api.post("/api/auth/refresh", null, {
          withCredentials: true,
        });
        const newAccessToken = res.data.accessToken;
        useAuthStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }
    
    // Global Error Handling: Show toast for bad requests, server errors, permission denied, etc.
    const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi hệ thống";
    
    // Check if error response has 'errors' array (Zod validation error from backend)
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
       const firstError = error.response.data.errors[0];
       toast.error(`Lỗi dữ liệu: ${firstError.message || errorMessage}`);
    } else {
       toast.error(errorMessage);
    }

    return Promise.reject(error);
  },
);

export default api;
