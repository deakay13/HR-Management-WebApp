import { describe, test, expect, vi, beforeEach } from "vitest";
import { HoursServices } from "@/services/payRollServices/hoursServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("HoursServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getHours", () => {
    test("fetches hours successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await HoursServices.getHours();

      expect(api.get).toHaveBeenCalledWith("/api/payroll/hours", {
        params: { size: 0 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData.data);
    });
  });

  describe("createHours", () => {
    test("creates hours successfully", async () => {
      const data = { hours: 8 };
      const mockData = { hour: { ID: "new" } };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await HoursServices.createHours(data as any);

      expect(api.post).toHaveBeenCalledWith("/api/payroll/hours", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.hour);
    });
  });

  describe("updateHours", () => {
    test("updates hours successfully", async () => {
      const data = { hours: 10 };
      const mockData = { hour: { ID: "1", ...data } };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await HoursServices.updateHours("1", data as any);

      expect(api.put).toHaveBeenCalledWith("/api/payroll/hours/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData.hour);
    });
  });

  describe("deleteHour", () => {
    test("deletes hour successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      const result = await HoursServices.deleteHour("1");

      expect(api.delete).toHaveBeenCalledWith("/api/payroll/hours/1", {
        withCredentials: true,
      });
      expect(result).toBe(true);
    });
  });

  describe("searchHours", () => {
    test("searches hours successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await HoursServices.searchHours({ query: "test" });

      expect(api.get).toHaveBeenCalledWith("/api/payroll/hours/search", {
        params: { query: "test" },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("exportHours", () => {
    test("exports hours successfully", async () => {
      const mockBlob = new Blob(["test"]);
      (api.get as any).mockResolvedValue({ data: mockBlob });

      const result = await HoursServices.exportHours();

      expect(api.get).toHaveBeenCalledWith("/api/payroll/hours/export", {
        responseType: "blob",
        withCredentials: true,
      });
      expect(result).toEqual(mockBlob);
    });
  });
});
