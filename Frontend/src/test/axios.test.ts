import { describe, test, expect, vi, beforeEach } from "vitest";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/authStores/useAuthStore";

// Access the interceptor handlers
const requestInterceptor = (api.interceptors.request as any).handlers[0].fulfilled;
const responseInterceptorFulfilled = (api.interceptors.response as any).handlers[0].fulfilled;
const responseInterceptorRejected = (api.interceptors.response as any).handlers[0].rejected;

describe("axios interceptors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ accessToken: null });
  });

  describe("request interceptor", () => {
    test("adds Authorization header if accessToken exists", () => {
      useAuthStore.setState({ accessToken: "fake-token" });
      const config = { headers: {} };
      const newConfig = requestInterceptor(config);
      expect(newConfig.headers.Authorization).toBe("Bearer fake-token");
    });

    test("does not add Authorization header if no accessToken", () => {
      const config = { headers: {} };
      const newConfig = requestInterceptor(config);
      expect(newConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe("response interceptor", () => {
    test("returns response if fulfilled", () => {
      const res = { data: "ok" };
      expect(responseInterceptorFulfilled(res)).toEqual(res);
    });

    test("rejects directly if URL is auth/signin", async () => {
      const error = { config: { url: "/api/auth/signin" } };
      await expect(responseInterceptorRejected(error)).rejects.toEqual(error);
    });

    test("rejects directly if URL is auth/refresh", async () => {
      const error = { config: { url: "/api/auth/refresh" } };
      await expect(responseInterceptorRejected(error)).rejects.toEqual(error);
    });

    test("rejects directly if not 403", async () => {
      const error = { config: { url: "/api/users" }, response: { status: 401 } };
      await expect(responseInterceptorRejected(error)).rejects.toEqual(error);
    });

    test("rejects directly if 403 is permission denied", async () => {
      const error = {
        config: { url: "/api/users" },
        response: { status: 403, data: { message: "Không có quyền truy cập" } },
      };
      await expect(responseInterceptorRejected(error)).rejects.toEqual(error);
    });

    test("retries with refresh token on 403 JWT expired and succeeds", async () => {
      const originalRequest = { url: "/api/users", headers: {}, _retryCount: 0 };
      const error = {
        config: originalRequest,
        response: { status: 403, data: { message: "JWT Expired" } },
      };

      // Mock api.post for the refresh call
      const postSpy = vi.spyOn(api, "post").mockResolvedValue({
        data: { accessToken: "refreshed-token" },
      } as any);

      // Mock api.defaults.adapter to prevent real network call on retry
      const originalAdapter = api.defaults.adapter;
      api.defaults.adapter = vi.fn().mockResolvedValue({
        data: { users: [] },
        status: 200,
        statusText: "OK",
        headers: {},
        config: originalRequest,
      }) as any;

      const setTokenSpy = vi.spyOn(useAuthStore.getState(), "setAccessToken");

      const result = await responseInterceptorRejected(error);

      // Restore adapter
      api.defaults.adapter = originalAdapter;

      expect(postSpy).toHaveBeenCalledWith("/api/auth/refresh", null, { withCredentials: true });
      expect(setTokenSpy).toHaveBeenCalledWith("refreshed-token");
      expect(originalRequest.headers.Authorization).toBe("Bearer refreshed-token");
      expect(result).toBeDefined();
    });

    test("clears state if refresh token fails", async () => {
      const originalRequest = { url: "/api/users", headers: {}, _retryCount: 0 };
      const error = {
        config: originalRequest,
        response: { status: 403, data: { message: "JWT Expired" } },
      };

      vi.spyOn(api, "post").mockRejectedValue(new Error("Refresh failed"));
      
      const clearSpy = vi.spyOn(useAuthStore.getState(), "clearState");

      await expect(responseInterceptorRejected(error)).rejects.toThrow("Refresh failed");
      expect(clearSpy).toHaveBeenCalled();
    });
  });
});
