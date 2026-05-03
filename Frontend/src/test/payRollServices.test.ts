import { describe, test, expect, vi, beforeEach } from "vitest";
import { PayRollServices } from "@/services/payRollServices/payRollServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("PayRollServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPayRolls", () => {
    test("fetches payrolls successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await PayRollServices.getPayRolls();

      expect(api.get).toHaveBeenCalledWith("/api/payroll/payrolls", {
        params: { size: 0 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("createPayRoll", () => {
    test("creates payroll successfully", async () => {
      const data = { amount: 1000 };
      const mockData = { payroll: { ID: "new" } };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await PayRollServices.createPayRoll(data as any);

      expect(api.post).toHaveBeenCalledWith("/api/payroll/payrolls", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.payroll);
    });
  });

  describe("updatePayRoll", () => {
    test("updates payroll successfully", async () => {
      const data = { amount: 2000 };
      const mockData = { payroll: { ID: "1", ...data } };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await PayRollServices.updatePayRoll("1", data as any);

      expect(api.put).toHaveBeenCalledWith("/api/payroll/payrolls/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.payroll);
    });
  });

  describe("deletePayRoll", () => {
    test("deletes payroll successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      const result = await PayRollServices.deletePayRoll("1");

      expect(api.delete).toHaveBeenCalledWith("/api/payroll/payrolls/1", {
        withCredentials: true,
      });
      expect(result).toBe(true);
    });
  });

  describe("searchPayRolls", () => {
    test("searches payrolls successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await PayRollServices.searchPayRolls({ query: "test" });

      expect(api.get).toHaveBeenCalledWith("/api/payroll/payrolls/search", {
        params: { query: "test" },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("exportPayRoll", () => {
    test("exports payrolls successfully", async () => {
      const mockBlob = new Blob(["test"]);
      (api.get as any).mockResolvedValue({ data: mockBlob });

      const result = await PayRollServices.exportPayRoll();

      expect(api.get).toHaveBeenCalledWith("/api/payroll/payrolls/export", {
        responseType: "blob",
        withCredentials: true,
      });
      expect(result).toEqual(mockBlob);
    });
  });

  describe("getPayrollByEmployee", () => {
    test("fetches payroll by employee successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await PayRollServices.getPayrollByEmployee("E1");

      expect(api.get).toHaveBeenCalledWith("/api/payroll/payrolls/employee/E1", {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });
});
