import { describe, test, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";

/**
 * Test useAuthStore — chỉ test các action state thuần túy
 * (signIn/signOut/refresh cần network → test riêng với mock)
 */
describe("useAuthStore — state actions", () => {
  beforeEach(() => {
    // Reset về initial state trước mỗi test
    useAuthStore.setState({
      accessToken: null,
      account: null,
      avatarUrl: null,
      initializing: true,
    });
    useAuthorizeStore.getState().clearState();
  });

  test("khởi tạo đúng giá trị mặc định", () => {
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.account).toBeNull();
    expect(state.avatarUrl).toBeNull();
  });

  test("setAccessToken cập nhật đúng token", () => {
    useAuthStore.getState().setAccessToken("my-jwt-token-123");
    expect(useAuthStore.getState().accessToken).toBe("my-jwt-token-123");
  });

  test("setAvatarUrl cập nhật đúng URL", () => {
    useAuthStore.getState().setAvatarUrl("https://cdn/avatar.png");
    expect(useAuthStore.getState().avatarUrl).toBe("https://cdn/avatar.png");
  });

  test("clearState reset accessToken, account, avatarUrl về null", () => {
    // Thiết lập state trước
    useAuthStore.setState({
      accessToken: "token-abc",
      account: { MaTK: "TK01" } as never,
      avatarUrl: "https://img.example.com/a.png",
    });

    useAuthStore.getState().clearState();

    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.account).toBeNull();
    expect(state.avatarUrl).toBeNull();
  });

  test("clearState cũng reset authorizeStore", () => {
    useAuthorizeStore.getState().setRole({ MaVT: "VT001", TenVaiTro: "Admin" });
    useAuthorizeStore.getState().setPermissions([
      { MaQuyen: "Q1", TenQuyen: "Đọc" },
    ]);

    useAuthStore.getState().clearState();

    expect(useAuthorizeStore.getState().role).toBeNull();
    expect(useAuthorizeStore.getState().permissions).toEqual([]);
  });

  test("setAccessToken có thể set null để logout", () => {
    useAuthStore.getState().setAccessToken("valid-token");
    useAuthStore.getState().setAccessToken("");
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});

import { authServices } from "@/services/userServices/authServices";
import { vi } from "vitest";
import { toast } from "sonner";
import i18n from "@/i18n";

describe("useAuthStore — async actions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks(); // Ensure call counts are cleared
    vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t); // Prevent i18n crash

    useAuthStore.setState({
      accessToken: null,
      account: null,
      avatarUrl: null,
      initializing: true,
    });
    useAuthorizeStore.getState().clearState();
  });

  test("signIn success", async () => {
    const signInSpy = vi.spyOn(authServices, "signIn").mockResolvedValue({ accessToken: "token", message: "OK" });
    const spyGet = vi.spyOn(authServices, "getCurrentAccount").mockResolvedValue({});
    const successSpy = vi.spyOn(toast, "success");

    await useAuthStore.getState().signIn("user", "pass");

    expect(signInSpy).toHaveBeenCalledWith("user", "pass");
    expect(useAuthStore.getState().accessToken).toBe("token");
    expect(spyGet).toHaveBeenCalled();
    expect(successSpy).toHaveBeenCalledWith("OK");
  });

  test("signIn success without message", async () => {
    vi.spyOn(authServices, "signIn").mockResolvedValue({ accessToken: "token", message: undefined } as any);
    vi.spyOn(authServices, "getCurrentAccount").mockResolvedValue({});
    const successSpy = vi.spyOn(toast, "success");

    await useAuthStore.getState().signIn("user", "pass");
    expect(successSpy).toHaveBeenCalledWith("Chào mừng đã đến HR-System 🎉");
  });

  test("signIn throws error", async () => {
    vi.spyOn(authServices, "signIn").mockRejectedValue(new Error("Network Error"));
    const errorSpy = vi.spyOn(toast, "error");
    await expect(useAuthStore.getState().signIn("user", "pass")).rejects.toThrow("Network Error");
    expect(errorSpy).toHaveBeenCalled();
  });

  test("signOut success", async () => {
    const signOutSpy = vi.spyOn(authServices, "signOut").mockResolvedValue("ok" as any);
    const successSpy = vi.spyOn(toast, "success");
    useAuthStore.setState({ accessToken: "token" });

    await useAuthStore.getState().signOut();

    expect(signOutSpy).toHaveBeenCalled();
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(successSpy).toHaveBeenCalled();
  });

  test("signOut fails", async () => {
    vi.spyOn(authServices, "signOut").mockRejectedValue(new Error("Failed"));
    const errorSpy = vi.spyOn(toast, "error");
    await useAuthStore.getState().signOut();
    expect(errorSpy).toHaveBeenCalled();
  });

  test("getCurrentAccount success with role and permissions", async () => {
    vi.spyOn(authServices, "getCurrentAccount").mockResolvedValue({
      NhanVien: { HinhAnh: "avatar.png" },
      MaVT: "VT01",
      VaiTro: { TenVaiTro: "Admin" },
      permissions: [{ MaQuyen: "Q1", TenQuyen: "Read" }]
    });

    await useAuthStore.getState().getCurrentAccount();

    expect(useAuthStore.getState().account).toBeDefined();
    expect(useAuthStore.getState().avatarUrl).toBe("avatar.png");
    expect(useAuthorizeStore.getState().role?.TenVaiTro).toBe("Admin");
    expect(useAuthorizeStore.getState().permissions?.length).toBe(1);
  });

  test("getCurrentAccount success fallback role without VaiTro", async () => {
    vi.spyOn(authServices, "getCurrentAccount").mockResolvedValue({
      MaVT: "VT001",
    });

    await useAuthStore.getState().getCurrentAccount();
    expect(useAuthorizeStore.getState().role?.TenVaiTro).toBe("Quản Trị Viên");
  });

  test("getCurrentAccount fails", async () => {
    vi.spyOn(authServices, "getCurrentAccount").mockRejectedValue(new Error("Fail"));
    const errorSpy = vi.spyOn(toast, "error");
    await useAuthStore.getState().getCurrentAccount();
    expect(errorSpy).toHaveBeenCalled();
  });

  test("refresh success and gets account if null", async () => {
    const refreshSpy = vi.spyOn(authServices, "refresh").mockResolvedValue("new-token");
    const spyGet = vi.spyOn(authServices, "getCurrentAccount").mockResolvedValue({});
    
    await useAuthStore.getState().refresh();
    
    expect(refreshSpy).toHaveBeenCalled();
    expect(useAuthStore.getState().accessToken).toBe("new-token");
    expect(spyGet).toHaveBeenCalled();
  });

  test("refresh success and does not get account if already exists", async () => {
    vi.spyOn(authServices, "refresh").mockResolvedValue("new-token");
    useAuthStore.setState({ account: { MaTK: "1" } as any });
    const spyGet = vi.spyOn(authServices, "getCurrentAccount");
    
    await useAuthStore.getState().refresh();
    
    expect(spyGet).not.toHaveBeenCalled();
  });

  test("refresh fails clears state and shows toast", async () => {
    vi.spyOn(authServices, "refresh").mockRejectedValue(new Error("Token expired"));
    const errorSpy = vi.spyOn(toast, "error");
    await useAuthStore.getState().refresh();
    
    expect(errorSpy).toHaveBeenCalled();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  test("refresh fails clears state without toast", async () => {
    vi.spyOn(authServices, "refresh").mockRejectedValue(new Error("Token expired"));
    const errorSpy = vi.spyOn(toast, "error");
    await useAuthStore.getState().refresh(false);
    
    expect(errorSpy).not.toHaveBeenCalled();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});
