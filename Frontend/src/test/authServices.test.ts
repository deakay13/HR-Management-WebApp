import { describe, test, expect, vi, beforeEach } from "vitest";
import { authServices } from "@/services/userServices/authServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("authServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signIn", () => {
    test("signs in successfully", async () => {
      const mockData = { token: "123" };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await authServices.signIn("user", "pass");

      expect(api.post).toHaveBeenCalledWith(
        "/api/auth/signin",
        { TenTaiKhoan: "user", MatKhau: "pass" },
        { withCredentials: true }
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("signOut", () => {
    test("signs out successfully", async () => {
      const mockData = { success: true };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await authServices.signOut();

      expect(api.post).toHaveBeenCalledWith("/api/auth/signout", {}, { withCredentials: true });
      expect(result).toEqual({ data: mockData });
    });
  });

  describe("getCurrentAccount", () => {
    test("gets current account successfully", async () => {
      const mockData = { user: "test" };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await authServices.getCurrentAccount();

      expect(api.get).toHaveBeenCalledWith("/api/current/currentA", {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("refresh", () => {
    test("refreshes token successfully", async () => {
      const mockData = { accessToken: "new_token" };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await authServices.refresh();

      expect(api.post).toHaveBeenCalledWith("/api/auth/refresh", null, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.accessToken);
    });
  });
});
