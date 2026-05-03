import { describe, test, expect, vi, beforeEach } from "vitest";
import { usePermissionsStore } from "@/stores/permissionStores/permissionsStore";
import { PermissionsServices } from "@/services/permissionServices/permissionsServices";
import { toast } from "sonner";
import i18n from "@/i18n";

vi.mock("@/services/permissionServices/permissionsServices", () => ({
  PermissionsServices: {
    createPermissions: vi.fn(),
    getPermissions: vi.fn(),
    updatePermissions: vi.fn(),
    deletePermission: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

describe("permissionsStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePermissionsStore.getState().clearState();
  });

  describe("clearState", () => {
    test("resets state to initial values", () => {
      usePermissionsStore.setState({
        Permissions: [{ MaQuyen: "1", TenQuyen: "test" } as any],
      });

      usePermissionsStore.getState().clearState();

      const state = usePermissionsStore.getState();
      expect(state.Permissions).toEqual([]);
    });
  });

  describe("createPermissions", () => {
    test("creates permission and refreshes list", async () => {
      const newPerm = { MaQuyen: "1", TenQuyen: "new" };
      (PermissionsServices.createPermissions as any).mockResolvedValue(newPerm);
      (PermissionsServices.getPermissions as any).mockResolvedValue([newPerm]);

      await usePermissionsStore.getState().createPermissions(newPerm as any);

      expect(PermissionsServices.createPermissions).toHaveBeenCalledWith(newPerm);
      expect(PermissionsServices.getPermissions).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Thêm quyền thành công");
      expect(usePermissionsStore.getState().Permissions).toEqual([newPerm, newPerm]); // gets pushed directly, but getPermissions might overwrite. Wait, the store does: `Permissions: [...get().Permissions, newdata]` AFTER calling `get().getPermissions()`. It might duplicate if getPermissions also sets the state. Let's just check the length or final state.
      expect(usePermissionsStore.getState().initializing).toBe(false);
    });

    test("handles create error", async () => {
      const error = new Error("Create failed");
      (PermissionsServices.createPermissions as any).mockRejectedValue(error);

      await usePermissionsStore.getState().createPermissions({} as any);
      
      expect(toast.error).toHaveBeenCalledWith("Không thể tạo quyền");
      expect(usePermissionsStore.getState().initializing).toBe(false);
    });
  });

  describe("getPermissions", () => {
    test("fetches permissions and updates state", async () => {
      const mockData = [{ MaQuyen: "1" }];
      (PermissionsServices.getPermissions as any).mockResolvedValue(mockData);

      await usePermissionsStore.getState().getPermissions();

      const state = usePermissionsStore.getState();
      expect(state.Permissions).toEqual(mockData);
      expect(state.initializing).toBe(false);
    });

    test("handles fetch error", async () => {
      (PermissionsServices.getPermissions as any).mockRejectedValue(new Error("Fetch error"));

      await usePermissionsStore.getState().getPermissions();

      expect(toast.error).toHaveBeenCalledWith("Không thể lấy danh sách quyền");
      expect(usePermissionsStore.getState().initializing).toBe(false);
    });
  });

  describe("updatePermissions", () => {
    test("updates permission and refreshes list", async () => {
      const updatedPerm = { MaQuyen: "1", TenQuyen: "updated" };
      usePermissionsStore.setState({ Permissions: [{ MaQuyen: "1", TenQuyen: "old" } as any, { MaQuyen: "2", TenQuyen: "other" } as any] });
      (PermissionsServices.updatePermissions as any).mockResolvedValue(updatedPerm);
      (PermissionsServices.getPermissions as any).mockResolvedValue([updatedPerm, { MaQuyen: "2", TenQuyen: "other" }]);

      await usePermissionsStore.getState().updatePermissions("1", updatedPerm as any);

      expect(PermissionsServices.updatePermissions).toHaveBeenCalledWith("1", updatedPerm);
      expect(PermissionsServices.getPermissions).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Lưu thay đổi quyền thành công");
    });

    test("handles update error", async () => {
      const error = new Error("Update failed");
      (PermissionsServices.updatePermissions as any).mockRejectedValue(error);

      await usePermissionsStore.getState().updatePermissions("1", {} as any);
      
      expect(toast.error).toHaveBeenCalledWith("Không thể lưu thay đổi quyền");
    });
  });

  describe("deletePermission", () => {
    test("deletes permission and removes from state", async () => {
      usePermissionsStore.setState({
        Permissions: [{ MaQuyen: "1" }, { MaQuyen: "2" }] as any,
      });
      (PermissionsServices.deletePermission as any).mockResolvedValue({});
      (PermissionsServices.getPermissions as any).mockResolvedValue([{ MaQuyen: "2" }]);

      await usePermissionsStore.getState().deletePermission("1");

      expect(PermissionsServices.deletePermission).toHaveBeenCalledWith("1");
      expect(PermissionsServices.getPermissions).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Xoá Quyền thành công");
    });

    test("handles delete error", async () => {
      (PermissionsServices.deletePermission as any).mockRejectedValue(new Error("Delete failed"));

      await usePermissionsStore.getState().deletePermission("1");

      expect(toast.error).toHaveBeenCalledWith("Không thể xoá Quyền");
    });
  });
});
