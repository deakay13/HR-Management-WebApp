import { describe, test, expect, vi, beforeEach } from "vitest";
import { DeductionServices } from "@/services/payRollServices/deductionServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("DeductionServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDeductions", () => {
    test("fetches deductions successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await DeductionServices.getDeductions();

      expect(api.get).toHaveBeenCalledWith("/api/payroll/deductions", {
        params: { size: 0 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData.data);
    });
  });

  describe("createDeduction", () => {
    test("creates deduction successfully", async () => {
      const data = { amount: 1000 };
      const mockData = { deduction: { ID: "new" } };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await DeductionServices.createDeduction(data as any);

      expect(api.post).toHaveBeenCalledWith("/api/payroll/deductions", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.deduction);
    });
  });

  describe("updateDeduction", () => {
    test("updates deduction successfully", async () => {
      const data = { amount: 2000 };
      const mockData = { deduction: { ID: "1", ...data } };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await DeductionServices.updateDeduction("1", data as any);

      expect(api.put).toHaveBeenCalledWith("/api/payroll/deductions/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.deduction);
    });
  });

  describe("deleteDeduction", () => {
    test("deletes deduction successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      const result = await DeductionServices.deleteDeduction("1");

      expect(api.delete).toHaveBeenCalledWith("/api/payroll/deductions/1", {
        withCredentials: true,
      });
      expect(result).toBe(true);
    });
  });

  describe("searchDeduction", () => {
    test("searches deductions successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await DeductionServices.searchDeduction({ query: "test" });

      expect(api.get).toHaveBeenCalledWith("/api/payroll/deductions/search", {
        params: { query: "test" },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("exportDeduction", () => {
    test("exports deductions successfully", async () => {
      const mockBlob = new Blob(["test"]);
      (api.get as any).mockResolvedValue({ data: mockBlob });

      const result = await DeductionServices.exportDeduction();

      expect(api.get).toHaveBeenCalledWith("/api/payroll/deductions/export", {
        responseType: "blob",
        withCredentials: true,
      });
      expect(result).toEqual(mockBlob);
    });
  });
});
