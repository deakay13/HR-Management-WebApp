import { describe, test, expect, vi, beforeEach } from "vitest";
import { PermissionsServices } from "@/services/permissionServices/permissionsServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("PermissionsServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPermissions", () => {
    test("fetches permissions successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await PermissionsServices.getPermissions();

      expect(api.get).toHaveBeenCalledWith("/api/permissions/permission", {
        params: { size: 0 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData.data);
    });
  });

  describe("createPermissions", () => {
    test("creates permission successfully", async () => {
      const data = { name: "Test" };
      const mockData = { id: "new" };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await PermissionsServices.createPermissions(data as any);

      expect(api.post).toHaveBeenCalledWith("/api/permissions/permission", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("updatePermissions", () => {
    test("updates permission successfully", async () => {
      const data = { name: "Updated" };
      const mockData = { id: "1" };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await PermissionsServices.updatePermissions("1", data as any);

      expect(api.put).toHaveBeenCalledWith("/api/permissions/permission/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("deletePermission", () => {
    test("deletes permission successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      const result = await PermissionsServices.deletePermission("1");

      expect(api.delete).toHaveBeenCalledWith("/api/permissions/permission/1", {
        withCredentials: true,
      });
      expect(result).toBe(true);
    });
  });
});
