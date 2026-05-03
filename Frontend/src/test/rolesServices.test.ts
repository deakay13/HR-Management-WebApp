import { describe, test, expect, vi, beforeEach } from "vitest";
import { RolesServices } from "@/services/permissionServices/rolesServices";
import api from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("RolesServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRoles", () => {
    test("fetches roles successfully", async () => {
      const mockData = { data: [{ ID: "1" }] };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await RolesServices.getRoles();

      expect(api.get).toHaveBeenCalledWith("/api/permissions/roles", {
        params: { size: 0 },
        withCredentials: true,
      });
      expect(result).toEqual(mockData.data);
    });
  });

  describe("createRoles", () => {
    test("creates role successfully", async () => {
      const data = { name: "Test" };
      const mockData = { id: "new" };
      (api.post as any).mockResolvedValue({ data: mockData });

      const result = await RolesServices.createRoles(data as any);

      expect(api.post).toHaveBeenCalledWith("/api/permissions/roles", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("updateRoles", () => {
    test("updates role successfully", async () => {
      const data = { name: "Updated" };
      const mockData = { id: "1" };
      (api.put as any).mockResolvedValue({ data: mockData });

      const result = await RolesServices.updateRoles("1", data as any);

      expect(api.put).toHaveBeenCalledWith("/api/permissions/roles/1", data, {
        withCredentials: true,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe("deleteRole", () => {
    test("deletes role successfully", async () => {
      (api.delete as any).mockResolvedValue({});

      const result = await RolesServices.deleteRole("1");

      expect(api.delete).toHaveBeenCalledWith("/api/permissions/roles/1", {
        withCredentials: true,
      });
      expect(result).toBe(true);
    });
  });
});
