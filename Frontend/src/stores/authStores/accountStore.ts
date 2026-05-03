import i18n from "@/i18n";
import { create } from "zustand";
import { toast } from "sonner";
import { accountsServices } from "@/services/userServices/accountsServices";
import type { Account, AccountTypes } from "@/types/authTypes/accountTypes";

export const useAccountsStore = create<AccountTypes>((set, get) => ({
  accounts: [],
  initializing: true,
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: 10,
  searchParams: { keyword: "", page: 1, size: 10 },

  clearState: () => {
    set({
      accounts: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
      searchParams: { keyword: "", page: 1, size: 10 },
    });
  },

  createAccount: async (data: Account) => {
    try {
      set({ initializing: true });
      await accountsServices.createAccount(data);
      await get().getAccounts();
      toast.success(i18n.t("Tạo tài khoản thành công"));
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      toast.error(i18n.t("Không thể tạo tài khoản"));
      throw error;
    } finally {
      set({ initializing: false });
    }
  },

  getAccounts: async () => {
    try {
      const response = await accountsServices.getAccounts();
      if (response) {
        set({
          accounts: response,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản", error);
      toast.error(i18n.t("Không thể lấy danh sách tài khoản"));
    } finally {
      set({ initializing: false });
    }
  },

  searchAccounts: async (params) => {
    try {
      const currentParams = get().searchParams;
      const newParams = { ...currentParams, ...params };
      const response = await accountsServices.searchAccounts(newParams);
      set({
        accounts: response.data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        searchParams: newParams,
      });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm tài khoản:", error);
      toast.error(i18n.t("Không thể thực hiện tìm kiếm"));
    }
  },

  exportAccounts: async () => {
    try {
      await accountsServices.exportAccounts();
      toast.success(i18n.t("Xuất file Excel thành công"));
    } catch (error) {
      console.error("Lỗi khi xuất file Excel", error);
      toast.error(i18n.t("Không thể xuất file Excel"));
    }
  },

  updateAccount: async (ID: string, data: Partial<Account>) => {
    try {
      set({ initializing: true });
      await accountsServices.updateAccount(ID, data);
      await get().getAccounts();
      toast.success(i18n.t("Cập nhật tài khoản thành công"));
    } catch (error) {
      console.error("Lỗi khi cập nhật tài khoản:", error);
      toast.error(i18n.t("Không thể cập nhật tài khoản"));
      throw error;
    } finally {
      set({ initializing: false });
    }
  },

  deleteAccount: async (ID: string) => {
    try {
      await accountsServices.deleteAccount(ID);
      set({
        accounts: get().accounts.filter((a) => a.MaTK !== ID),
      });
      toast.success(i18n.t("Xoá tài khoản thành công"));
    } catch (error) {
      console.error("Lỗi khi xoá tài khoản", error);
      toast.error(i18n.t("Không thể xoá tài khoản"));
    }
  },
}));
