import { describe, test, expect, vi, beforeEach } from "vitest";
import { EmployeeServices } from "@/services/informationServices/employeeServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("EmployeeServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getEmployees", () => {
    test("fetches employees successfully", async () => {
      const mockData = { data: [{ MaNV: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await EmployeeServices.getEmployees();

      expect(api.get).toHaveBeenCalledWith("/api/information/employees", {
        params: { size: 0 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("getEmployee", () => {
    test("fetches single employee successfully", async () => {
      const mockData = { MaNV: "1" };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await EmployeeServices.getEmployee("1");

      expect(api.get).toHaveBeenCalledWith("/api/information/employees/1", {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("createEmployee", () => {
    test("creates employee successfully", async () => {
      const data = { MaNV: "new", HoTen: "Test" };
      const mockData = { ...data };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await EmployeeServices.createEmployee(data as any);

      expect(api.post).toHaveBeenCalledWith("/api/information/employees", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("updateEmployee", () => {
    test("updates employee successfully", async () => {
      const data = { HoTen: "Updated" };
      const mockData = { MaNV: "1", ...data };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await EmployeeServices.updateEmployee("1", data as any);

      expect(api.put).toHaveBeenCalledWith("/api/information/employees/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("deleteEmployee", () => {
    test("deletes employee successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      await EmployeeServices.deleteEmployee("1");

      expect(api.delete).toHaveBeenCalledWith("/api/information/employees/1", {
        withCredentials: true,
      });
    });
  });

  describe("searchEmployees", () => {
    test("searches employees successfully", async () => {
      const mockData = { data: [{ MaNV: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await EmployeeServices.searchEmployees({ keyword: "test" });

      expect(api.get).toHaveBeenCalledWith("/api/information/employees/search", {
        params: { keyword: "test" },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("exportEmployees", () => {
    test("exports employees successfully", async () => {
      const mockBlob = new Blob(["test"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      (api.get as any).mockResolvedValue({ data: mockBlob });

      const result = await EmployeeServices.exportEmployees();

      expect(api.get).toHaveBeenCalledWith("/api/information/employees/export", {
        responseType: "blob",
        withCredentials: true,
      });
      expect(result).toEqual(mockBlob);
    });
  });
});
