import { describe, test, expect, vi, beforeEach } from "vitest";
import { BaseSalaryServices } from "@/services/payRollServices/baseSalaryServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("BaseSalaryServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBaseSalaries", () => {
    test("fetches base salaries successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await BaseSalaryServices.getBaseSalaries();

      expect(api.get).toHaveBeenCalledWith("/api/payroll/basesalary", {
        params: { size: 0 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData.data);
    });
  });

  describe("createBaseSalary", () => {
    test("creates base salary successfully", async () => {
      const data = { amount: 1000 };
      const mockData = { luong: { ID: "new" } };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await BaseSalaryServices.createBaseSalary(data as any);

      expect(api.post).toHaveBeenCalledWith("/api/payroll/basesalary", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.luong);
    });
  });

  describe("updateBaseSalary", () => {
    test("updates base salary successfully", async () => {
      const data = { amount: 2000 };
      const mockData = { luong: { ID: "1", ...data } };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await BaseSalaryServices.updateBaseSalary("1", data as any);

      expect(api.put).toHaveBeenCalledWith("/api/payroll/basesalary/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.luong);
    });
  });

  describe("deleteBaseSalary", () => {
    test("deletes base salary successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      const result = await BaseSalaryServices.deleteBaseSalary("1");

      expect(api.delete).toHaveBeenCalledWith("/api/payroll/basesalary/1", {
        withCredentials: true,
      });
      expect(result).toBe(true);
    });
  });

  describe("searchBaseSalary", () => {
    test("searches base salaries successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await BaseSalaryServices.searchBaseSalary({ query: "test" });

      expect(api.get).toHaveBeenCalledWith("/api/payroll/basesalary/search", {
        params: { query: "test" },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("exportBaseSalary", () => {
    test("exports base salaries successfully", async () => {
      const mockBlob = new Blob(["test"]);
      (api.get as any).mockResolvedValue({ data: mockBlob });

      const result = await BaseSalaryServices.exportBaseSalary();

      expect(api.get).toHaveBeenCalledWith("/api/payroll/basesalary/export", {
        responseType: "blob",
        withCredentials: true,
      });
      expect(result).toEqual(mockBlob);
    });
  });
});
