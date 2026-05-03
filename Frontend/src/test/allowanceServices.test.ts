import { describe, test, expect, vi, beforeEach } from "vitest";
import { AllowanceServices } from "@/services/payRollServices/allowanceServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("AllowanceServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllowances", () => {
    test("fetches allowances successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await AllowanceServices.getAllowances();

      expect(api.get).toHaveBeenCalledWith("/api/payroll/allowances", {
        params: { size: 0 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData.data);
    });
  });

  describe("getAllowanceByID", () => {
    test("fetches single allowance successfully", async () => {
      const mockData = { data: { ID: "1" } };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await AllowanceServices.getAllowanceByID("1");

      expect(api.get).toHaveBeenCalledWith("/api/payroll/allowances/1", {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.data);
    });
  });

  describe("createAllowance", () => {
    test("creates allowance successfully", async () => {
      const data = { name: "Test" };
      const mockData = { phuCap: { ID: "new" } };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await AllowanceServices.createAllowance(data as any);

      expect(api.post).toHaveBeenCalledWith("/api/payroll/allowances", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.phuCap);
    });
  });

  describe("updateAllowance", () => {
    test("updates allowance successfully", async () => {
      const data = { name: "Updated" };
      const mockData = { phuCap: { ID: "1", ...data } };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await AllowanceServices.updateAllowance("1", data as any);

      expect(api.put).toHaveBeenCalledWith("/api/payroll/allowances/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.phuCap);
    });
  });

  describe("deleteAllowance", () => {
    test("deletes allowance successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      const result = await AllowanceServices.deleteAllowance("1");

      expect(api.delete).toHaveBeenCalledWith("/api/payroll/allowances/1", {
        withCredentials: true,
      });
      expect(result).toBe(true);
    });
  });

  describe("searchAllowance", () => {
    test("searches allowances successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await AllowanceServices.searchAllowance({ query: "test" });

      expect(api.get).toHaveBeenCalledWith("/api/payroll/allowances/search", {
        params: { query: "test" },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("exportAllowance", () => {
    test("exports allowances successfully", async () => {
      const mockBlob = new Blob(["test"]);
      (api.get as any).mockResolvedValue({ data: mockBlob });

      const result = await AllowanceServices.exportAllowance();

      expect(api.get).toHaveBeenCalledWith("/api/payroll/allowances/export", {
        responseType: "blob",
        withCredentials: true,
      });
      expect(result).toEqual(mockBlob);
    });
  });
});
