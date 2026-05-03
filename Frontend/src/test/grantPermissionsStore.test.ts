import { describe, test, expect, vi, beforeEach } from "vitest";
import { useGrantPermissionsStore } from "@/stores/permissionStores/grantPermissionsStore";
import { GrantPermissionsServices } from "@/services/permissionServices/grantPermissionsServices";
import { toast } from "sonner";
import i18n from "@/i18n";

vi.mock("@/services/permissionServices/grantPermissionsServices", () => ({
  GrantPermissionsServices: {
    assigGrantPermissions: vi.fn(),
    getGrantPermissions: vi.fn(),
    updateGrantPermissions: vi.fn(),
    deleteAllGrantPermissions: vi.fn(),
    deleteOneGrantPermissions: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

describe("grantPermissionsStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGrantPermissionsStore.getState().clearState();
  });

  describe("clearState", () => {
    test("resets state to initial values", () => {
      useGrantPermissionsStore.setState({
        GrantPermissions: [
          { MaVT: "1", permissions: [{ id: "p1" }, { id: "p2" }] },
          { MaVT: "2", permissions: [{ id: "p3" }] },
        ] as any,
      });

      useGrantPermissionsStore.getState().clearState();

      const state = useGrantPermissionsStore.getState();
      expect(state.GrantPermissions).toEqual([]);
    });
  });

  describe("assigGrantPermissions", () => {
    test("assigns permission and refreshes list", async () => {
      (GrantPermissionsServices.assigGrantPermissions as any).mockResolvedValue({});
      (GrantPermissionsServices.getGrantPermissions as any).mockResolvedValue([]);

      await useGrantPermissionsStore.getState().assigGrantPermissions({} as any);

      expect(GrantPermissionsServices.assigGrantPermissions).toHaveBeenCalledWith({});
      expect(GrantPermissionsServices.getGrantPermissions).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Cấp quyền thành công");
      expect(useGrantPermissionsStore.getState().initializing).toBe(false);
    });

    test("handles assign error", async () => {
      const error = new Error("Assign failed");
      (GrantPermissionsServices.assigGrantPermissions as any).mockRejectedValue(error);

      await useGrantPermissionsStore.getState().assigGrantPermissions({} as any);

      expect(toast.error).toHaveBeenCalledWith("Không thể cấp quyền");
      expect(useGrantPermissionsStore.getState().initializing).toBe(false);
    });
  });

  describe("getGrantPermissions", () => {
    test("fetches granted permissions and updates state", async () => {
      const mockData = [{ MaVT: "1", permissions: [] }];
      (GrantPermissionsServices.getGrantPermissions as any).mockResolvedValue(mockData);

      await useGrantPermissionsStore.getState().getGrantPermissions();

      const state = useGrantPermissionsStore.getState();
      expect(state.GrantPermissions).toEqual(mockData);
      expect(state.initializing).toBe(false);
    });

    test("handles fetch error", async () => {
      (GrantPermissionsServices.getGrantPermissions as any).mockRejectedValue(new Error("Fetch error"));

      await useGrantPermissionsStore.getState().getGrantPermissions();

      expect(toast.error).toHaveBeenCalledWith("Không thể lấy danh sách quyền");
      expect(useGrantPermissionsStore.getState().initializing).toBe(false);
    });
  });

  describe("updateGrantPermissions", () => {
    test("updates permission and refreshes list", async () => {
      (GrantPermissionsServices.updateGrantPermissions as any).mockResolvedValue({});
      (GrantPermissionsServices.getGrantPermissions as any).mockResolvedValue([]);

      await useGrantPermissionsStore.getState().updateGrantPermissions("1", "old", "new");

      expect(GrantPermissionsServices.updateGrantPermissions).toHaveBeenCalledWith("1", {
        MaVT: "1",
        oldQuyen: "old",
        newQuyen: "new",
      });
      expect(GrantPermissionsServices.getGrantPermissions).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Thay đổi Quyền thành công");
    });

    test("handles update error", async () => {
      const error = new Error("Update failed");
      (GrantPermissionsServices.updateGrantPermissions as any).mockRejectedValue(error);

      await useGrantPermissionsStore.getState().updateGrantPermissions("1", "old", "new");

      expect(toast.error).toHaveBeenCalledWith("Không thể cập nhật Quyền");
    });
  });

  describe("deleteAllGrantPermissions", () => {
    test("deletes all and refreshes list", async () => {
      (GrantPermissionsServices.deleteAllGrantPermissions as any).mockResolvedValue({});
      (GrantPermissionsServices.getGrantPermissions as any).mockResolvedValue([]);

      await useGrantPermissionsStore.getState().deleteAllGrantPermissions("1");

      expect(GrantPermissionsServices.deleteAllGrantPermissions).toHaveBeenCalledWith("1");
      expect(GrantPermissionsServices.getGrantPermissions).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Xoá tất cả quyền được cấp thành công");
    });

    test("handles delete all error", async () => {
      (GrantPermissionsServices.deleteAllGrantPermissions as any).mockRejectedValue(new Error("Delete failed"));

      await useGrantPermissionsStore.getState().deleteAllGrantPermissions("1");

      expect(toast.error).toHaveBeenCalledWith("Không thể xoá Vai trò được cấp quyền");
    });
  });

  describe("deleteOneGrantPermissions", () => {
    test("deletes one permission and updates state directly", async () => {
      useGrantPermissionsStore.setState({
        GrantPermissions: [
          { MaVT: "1", permissions: [{ MaQuyen: "p1" }, { MaQuyen: "p2" }] },
          { MaVT: "2", permissions: [] }
        ] as any,
      });

      const updatedPermissions = [{ MaQuyen: "p2" }];
      (GrantPermissionsServices.deleteOneGrantPermissions as any).mockResolvedValue({ permissions: updatedPermissions });

      await useGrantPermissionsStore.getState().deleteOneGrantPermissions("1", "p1");

      expect(GrantPermissionsServices.deleteOneGrantPermissions).toHaveBeenCalledWith("1", "p1");
      expect(useGrantPermissionsStore.getState().GrantPermissions).toEqual([
        { MaVT: "1", permissions: updatedPermissions },
        { MaVT: "2", permissions: [] }
      ]);
    });

    test("handles delete one error", async () => {
      (GrantPermissionsServices.deleteOneGrantPermissions as any).mockRejectedValue(new Error("Delete failed"));

      await useGrantPermissionsStore.getState().deleteOneGrantPermissions("1", "p1");

      expect(toast.error).toHaveBeenCalledWith("Không thể xoá quyền khỏi vai trò");
    });
  });
});
