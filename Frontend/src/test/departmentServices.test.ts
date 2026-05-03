import { describe, test, expect, vi, beforeEach } from "vitest";
import { DepartmentServices } from "@/services/informationServices/departmentServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("DepartmentServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDepartments", () => {
    test("fetches departments successfully with default size 10", async () => {
      const mockData = { data: [{ MaPB: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await DepartmentServices.getDepartments({ page: 1 });

      expect(api.get).toHaveBeenCalledWith("/api/information/departments", {
        params: { size: 10, page: 1 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("searchDepartment", () => {
    test("searches departments successfully with default size 10", async () => {
      const mockData = { data: [{ MaPB: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await DepartmentServices.searchDepartment({ query: "test" });

      expect(api.get).toHaveBeenCalledWith("/api/information/departments/search", {
        params: { size: 10, query: "test" },
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("exportDepartment", () => {
    test("exports departments successfully", async () => {
      const mockBlob = new Blob(["test"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      (api.get as any).mockResolvedValue({ data: mockBlob });

      const result = await DepartmentServices.exportDepartment();

      expect(api.get).toHaveBeenCalledWith("/api/information/departments/export", {
        responseType: "blob",
        withCredentials: true,
      });
      expect(result).toEqual(mockBlob);
    });
  });

  describe("getDepartment", () => {
    test("fetches single department successfully", async () => {
      const mockData = { MaPB: "1" };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await DepartmentServices.getDepartment("1");

      expect(api.get).toHaveBeenCalledWith("/api/information/departments/1", {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("createDepartment", () => {
    test("creates department successfully", async () => {
      const data = { MaPB: "new", TenPB: "Test" };
      const mockData = { ...data };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await DepartmentServices.createDepartment(data as any);

      expect(api.post).toHaveBeenCalledWith("/api/information/departments", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("updateDepartment", () => {
    test("updates department successfully", async () => {
      const data = { TenPB: "Updated" };
      const mockData = { MaPB: "1", ...data };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await DepartmentServices.updateDepartment("1", data as any);

      expect(api.put).toHaveBeenCalledWith("/api/information/departments/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("deleteDepartment", () => {
    test("deletes department successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      await DepartmentServices.deleteDepartment("1");

      expect(api.delete).toHaveBeenCalledWith("/api/information/departments/1", {
        withCredentials: true,
      });
    });
  });
});
