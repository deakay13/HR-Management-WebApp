import { describe, test, expect, vi, beforeEach } from "vitest";
import { GrantPermissionsServices } from "@/services/permissionServices/grantPermissionsServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("GrantPermissionsServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getGrantPermissions", () => {
    test("fetches grant permissions successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await GrantPermissionsServices.getGrantPermissions();

      expect(api.get).toHaveBeenCalledWith("/api/permissions/Permission_Role", {
        params: { size: 0 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData.data);
    });
  });

  describe("assigGrantPermissions", () => {
    test("assigns grant permissions successfully", async () => {
      const data = { IDR: "1", IDP: "2", Quyen: "Read" };
      const mockData = { id: "new" };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await GrantPermissionsServices.assigGrantPermissions(data);

      expect(api.post).toHaveBeenCalledWith("/api/permissions/Permission_Role", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("updateGrantPermissions", () => {
    test("updates grant permissions successfully", async () => {
      const data = { MaVT: "1", oldQuyen: "Read", newQuyen: "Write" };
      const mockData = { id: "updated" };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await GrantPermissionsServices.updateGrantPermissions("1", data);

      expect(api.put).toHaveBeenCalledWith("/api/permissions/Permission_Role/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("deleteAllGrantPermissions", () => {
    test("deletes all grant permissions successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      const result = await GrantPermissionsServices.deleteAllGrantPermissions("1");

      expect(api.delete).toHaveBeenCalledWith("/api/permissions/Permission_Role/1", {
        withCredentials: true,
      });
      expect(result).toBe(true);
    });
  });

  describe("deleteOneGrantPermissions", () => {
    test("deletes one grant permission successfully", async () => {
      const mockData = { id: "deleted" };
      (api.delete as any).mockResolvedValue({ data: mockData });

      const result = await GrantPermissionsServices.deleteOneGrantPermissions("1", "2");

      expect(api.delete).toHaveBeenCalledWith("/api/permissions/Permission_Role/1/2", {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });
});
