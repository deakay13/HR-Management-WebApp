import { describe, test, expect, vi, beforeEach } from "vitest";
import { useAccountsStore } from "@/stores/authStores/accountStore";
import { accountsServices } from "@/services/userServices/accountsServices";
import { toast } from "sonner";
import i18n from "@/i18n";

vi.mock("@/services/userServices/accountsServices", () => ({
  accountsServices: {
    createAccount: vi.fn(),
    searchAccounts: vi.fn(),
    getAccounts: vi.fn(),
    exportAccounts: vi.fn(),
    updateAccount: vi.fn(),
    deleteAccount: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.spyOn(i18n, "t").mockImplementation(((key: string) => key) as typeof i18n.t);

describe("accountStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAccountsStore.getState().clearState();
  });

  describe("clearState", () => {
    test("resets state to initial values", () => {
      useAccountsStore.setState({
        accounts: [{ MaTK: "1", TenDangNhap: "test" } as any],
        totalItems: 10,
        totalPages: 2,
        currentPage: 2,
        pageSize: 20,
        searchParams: { keyword: "test", page: 2, size: 20 },
      });

      useAccountsStore.getState().clearState();

      const state = useAccountsStore.getState();
      expect(state.accounts).toEqual([]);
      expect(state.totalItems).toBe(0);
      expect(state.totalPages).toBe(1);
      expect(state.currentPage).toBe(1);
      expect(state.pageSize).toBe(10);
      expect(state.searchParams).toEqual({ keyword: "", page: 1, size: 10 });
    });
  });

  describe("createAccount", () => {
    test("creates account and refreshes list", async () => {
      (accountsServices.createAccount as any).mockResolvedValue({});
      (accountsServices.getAccounts as any).mockResolvedValue([]);

      await useAccountsStore.getState().createAccount({ TenDangNhap: "new" } as any);

      expect(accountsServices.createAccount).toHaveBeenCalledWith({ TenDangNhap: "new" });
      expect(accountsServices.getAccounts).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Tạo tài khoản thành công");
      expect(useAccountsStore.getState().initializing).toBe(false);
    });

    test("handles create error", async () => {
      const error = new Error("Create failed");
      (accountsServices.createAccount as any).mockRejectedValue(error);

      await expect(useAccountsStore.getState().createAccount({} as any)).rejects.toThrow("Create failed");
      expect(toast.error).toHaveBeenCalledWith("Không thể tạo tài khoản");
      expect(useAccountsStore.getState().initializing).toBe(false);
    });
  });

  describe("getAccounts", () => {
    test("fetches accounts and updates state", async () => {
      const mockResponse = [{ MaTK: "1" }];
      (accountsServices.getAccounts as any).mockResolvedValue(mockResponse);

      await useAccountsStore.getState().getAccounts();

      const state = useAccountsStore.getState();
      expect(state.accounts).toEqual([{ MaTK: "1" }]);
      expect(state.initializing).toBe(false);
    });

    test("handles fetch error", async () => {
      (accountsServices.getAccounts as any).mockRejectedValue(new Error("Fetch error"));

      await useAccountsStore.getState().getAccounts();

      expect(toast.error).toHaveBeenCalledWith("Không thể lấy danh sách tài khoản");
      expect(useAccountsStore.getState().initializing).toBe(false);
    });

    test("handles missing data in response", async () => {
      (accountsServices.getAccounts as any).mockResolvedValue(null);

      await useAccountsStore.getState().getAccounts();

      expect(useAccountsStore.getState().initializing).toBe(false);
    });
  });

  describe("searchAccounts", () => {
    test("searches accounts with new params and updates state", async () => {
      const mockResponse = {
        data: [{ MaTK: "2" }],
        totalItems: 1,
        totalPages: 1,
        currentPage: 2,
        pageSize: 5,
      };
      (accountsServices.searchAccounts as any).mockResolvedValue(mockResponse);

      await useAccountsStore.getState().searchAccounts({ page: 2, size: 5 });

      const state = useAccountsStore.getState();
      expect(accountsServices.searchAccounts).toHaveBeenCalledWith({ keyword: "", page: 2, size: 5 });
      expect(state.accounts).toEqual([{ MaTK: "2" }]);
      expect(state.searchParams).toEqual({ keyword: "", page: 2, size: 5 });
    });

    test("handles search error", async () => {
      (accountsServices.searchAccounts as any).mockRejectedValue(new Error("Search error"));

      await useAccountsStore.getState().searchAccounts({ keyword: "test" });

      expect(toast.error).toHaveBeenCalledWith("Không thể thực hiện tìm kiếm");
    });
  });

  describe("exportAccounts", () => {
    test("exports accounts successfully", async () => {
      (accountsServices.exportAccounts as any).mockResolvedValue(new Blob());

      await useAccountsStore.getState().exportAccounts();

      expect(accountsServices.exportAccounts).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Xuất file Excel thành công");
    });

    test("handles export error", async () => {
      (accountsServices.exportAccounts as any).mockRejectedValue(new Error("Export error"));

      await useAccountsStore.getState().exportAccounts();

      expect(toast.error).toHaveBeenCalledWith("Không thể xuất file Excel");
    });
  });

  describe("updateAccount", () => {
    test("updates account and refreshes list", async () => {
      (accountsServices.updateAccount as any).mockResolvedValue({});
      (accountsServices.getAccounts as any).mockResolvedValue([]);

      await useAccountsStore.getState().updateAccount("1", { TenDangNhap: "updated" });

      expect(accountsServices.updateAccount).toHaveBeenCalledWith("1", { TenDangNhap: "updated" });
      expect(accountsServices.getAccounts).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Cập nhật tài khoản thành công");
      expect(useAccountsStore.getState().initializing).toBe(false);
    });

    test("handles update error", async () => {
      const error = new Error("Update failed");
      (accountsServices.updateAccount as any).mockRejectedValue(error);

      await expect(useAccountsStore.getState().updateAccount("1", {})).rejects.toThrow("Update failed");
      expect(toast.error).toHaveBeenCalledWith("Không thể cập nhật tài khoản");
      expect(useAccountsStore.getState().initializing).toBe(false);
    });
  });

  describe("deleteAccount", () => {
    test("deletes account and removes from state", async () => {
      useAccountsStore.setState({
        accounts: [{ MaTK: "1" }, { MaTK: "2" }] as any,
      });
      (accountsServices.deleteAccount as any).mockResolvedValue({});

      await useAccountsStore.getState().deleteAccount("1");

      expect(accountsServices.deleteAccount).toHaveBeenCalledWith("1");
      expect(useAccountsStore.getState().accounts).toEqual([{ MaTK: "2" }]);
      expect(toast.success).toHaveBeenCalledWith("Xoá tài khoản thành công");
    });

    test("handles delete error", async () => {
      (accountsServices.deleteAccount as any).mockRejectedValue(new Error("Delete failed"));

      await useAccountsStore.getState().deleteAccount("1");

      expect(toast.error).toHaveBeenCalledWith("Không thể xoá tài khoản");
    });
  });
});
