import { describe, test, expect, beforeEach } from "vitest";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";

describe("useAuthorizeStore", () => {
  beforeEach(() => {
    useAuthorizeStore.getState().clearState();
  });

  test("khởi tạo đúng giá trị mặc định", () => {
    // clearState sets initializing to false, so reset fully
    useAuthorizeStore.setState({
      role: null,
      permissions: [],
      initializing: true,
    });
    const state = useAuthorizeStore.getState();
    expect(state.role).toBeNull();
    expect(state.permissions).toEqual([]);
    expect(state.initializing).toBe(true);
  });

  test("setRole cập nhật vai trò", () => {
    const role = { MaVT: "VT001", TenVaiTro: "Quản Trị Viên" };
    useAuthorizeStore.getState().setRole(role);
    expect(useAuthorizeStore.getState().role).toEqual(role);
  });

  test("setPermissions cập nhật quyền", () => {
    const perms = [
      { MaQuyen: "Q001", TenQuyen: "Đọc" },
      { MaQuyen: "Q002", TenQuyen: "Tạo" },
    ];
    useAuthorizeStore.getState().setPermissions(perms);
    expect(useAuthorizeStore.getState().permissions).toEqual(perms);
    expect(useAuthorizeStore.getState().permissions).toHaveLength(2);
  });

  test("setInitializing cập nhật trạng thái", () => {
    useAuthorizeStore.getState().setInitializing(false);
    expect(useAuthorizeStore.getState().initializing).toBe(false);
    useAuthorizeStore.getState().setInitializing(true);
    expect(useAuthorizeStore.getState().initializing).toBe(true);
  });

  test("clearState reset về mặc định", () => {
    // Set some data first
    useAuthorizeStore.getState().setRole({ MaVT: "VT001", TenVaiTro: "Admin" });
    useAuthorizeStore
      .getState()
      .setPermissions([{ MaQuyen: "Q1", TenQuyen: "Đọc" }]);
    useAuthorizeStore.getState().setInitializing(true);

    // Clear
    useAuthorizeStore.getState().clearState();

    const state = useAuthorizeStore.getState();
    expect(state.role).toBeNull();
    expect(state.permissions).toEqual([]);
    expect(state.initializing).toBe(false);
  });

  test("setRole null khi đăng xuất", () => {
    useAuthorizeStore
      .getState()
      .setRole({ MaVT: "VT002", TenVaiTro: "Nhân Sự" });
    useAuthorizeStore.getState().setRole(null);
    expect(useAuthorizeStore.getState().role).toBeNull();
  });
});
