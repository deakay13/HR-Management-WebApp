import { describe, test, expect, vi, beforeEach } from "vitest";
import { useRolesStore } from "@/stores/permissionStores/rolesStore";
import { RolesServices } from "@/services/permissionServices/rolesServices";
import { toast } from "sonner";
import i18n from "@/i18n";

vi.mock("@/services/permissionServices/rolesServices", () => ({
  RolesServices: {
    createRoles: vi.fn(),
    getRoles: vi.fn(),
    updateRoles: vi.fn(),
    deleteRole: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

describe("rolesStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useRolesStore.getState().clearState();
  });

  describe("clearState", () => {
    test("resets state to initial values", () => {
      useRolesStore.setState({
        Roles: [{ MaVT: "1", TenVT: "test" } as any],
      });

      useRolesStore.getState().clearState();

      const state = useRolesStore.getState();
      expect(state.Roles).toEqual([]);
    });
  });

  describe("createRoles", () => {
    test("creates role and refreshes list", async () => {
      const newRole = { MaVT: "1", TenVT: "new" };
      (RolesServices.createRoles as any).mockResolvedValue(newRole);
      (RolesServices.getRoles as any).mockResolvedValue([newRole]);

      await useRolesStore.getState().createRoles(newRole as any);

      expect(RolesServices.createRoles).toHaveBeenCalledWith(newRole);
      expect(RolesServices.getRoles).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Thêm Vai trò thành công");
      expect(useRolesStore.getState().initializing).toBe(false);
    });

    test("handles create error", async () => {
      const error = new Error("Create failed");
      (RolesServices.createRoles as any).mockRejectedValue(error);

      await useRolesStore.getState().createRoles({} as any);
      
      expect(toast.error).toHaveBeenCalledWith("Không thể tạo vai trò");
      expect(useRolesStore.getState().initializing).toBe(false);
    });
  });

  describe("getRoles", () => {
    test("fetches roles and updates state", async () => {
      const mockData = [{ MaVT: "1" }];
      (RolesServices.getRoles as any).mockResolvedValue(mockData);

      await useRolesStore.getState().getRoles();

      const state = useRolesStore.getState();
      expect(state.Roles).toEqual(mockData);
      expect(state.initializing).toBe(false);
    });

    test("handles fetch error", async () => {
      (RolesServices.getRoles as any).mockRejectedValue(new Error("Fetch error"));

      await useRolesStore.getState().getRoles();

      expect(toast.error).toHaveBeenCalledWith("Không thể lấy danh sách Vai trò");
      expect(useRolesStore.getState().initializing).toBe(false);
    });
  });

  describe("updateRoles", () => {
    test("updates role and refreshes list", async () => {
      const updatedRole = { MaVT: "1", TenVT: "updated" };
      (RolesServices.updateRoles as any).mockResolvedValue(updatedRole);
      (RolesServices.getRoles as any).mockResolvedValue([updatedRole]);

      await useRolesStore.getState().updateRoles("1", updatedRole as any);

      expect(RolesServices.updateRoles).toHaveBeenCalledWith("1", updatedRole);
      expect(RolesServices.getRoles).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Lưu thay đổi vai trò thành công");
    });

    test("handles update error", async () => {
      const error = new Error("Update failed");
      (RolesServices.updateRoles as any).mockRejectedValue(error);

      await useRolesStore.getState().updateRoles("1", {} as any);
      
      expect(toast.error).toHaveBeenCalledWith("Không thể lưu thay đổi vai trò");
    });
  });

  describe("deleteRole", () => {
    test("deletes role and removes from state", async () => {
      useRolesStore.setState({
        Roles: [{ MaVT: "1" }, { MaVT: "2" }] as any,
      });
      (RolesServices.deleteRole as any).mockResolvedValue({});
      (RolesServices.getRoles as any).mockResolvedValue([{ MaVT: "2" }]);

      await useRolesStore.getState().deleteRole("1");

      expect(RolesServices.deleteRole).toHaveBeenCalledWith("1");
      expect(RolesServices.getRoles).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Xoá Vai trò thành công");
    });

    test("handles delete error", async () => {
      (RolesServices.deleteRole as any).mockRejectedValue(new Error("Delete failed"));

      await useRolesStore.getState().deleteRole("1");

      expect(toast.error).toHaveBeenCalledWith("Không thể xoá Vai trò");
    });
  });
});
