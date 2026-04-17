import { create } from "zustand";
import { toast } from "sonner";
import { accountsServices } from "@/services/userServices/accountsServices";
import type { Account, AccountTypes } from "@/types/authTypes/accountTypes";

export const useAccountsStore = create<AccountTypes>((set, get) => ({
  accounts: [],
  initializing: true,
  clearState: () => {
    set({ accounts: [] });
  },
  createAccount: async (data: Account) => {
    try {
      set({ initializing: true });
      await accountsServices.createAccount(data);
      await get().getAccounts();
      toast.success("Tạo tài khoản thành công");
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      toast.error("Không thể tạo tài khoản");
      throw error;
    } finally {
      set({ initializing: false });
    }
  },

  getAccounts: async (search?: string) => {
    try {
      const data = await accountsServices.getAccounts(search);
      set({ accounts: data });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản", error);
      toast.error("Không thể lấy danh sách tài khoản");
    } finally {
      set({ initializing: false });
    }
  },
  exportAccounts: async () => {
    try {
      await accountsServices.exportAccounts();
      toast.success("Xuất file Excel thành công");
    } catch (error) {
      console.error("Lỗi khi xuất file Excel", error);
      toast.error("Không thể xuất file Excel");
    }
  },
  updateAccount: async (ID: string, data: Partial<Account>) => {
    try {
      set({ initializing: true });
      await accountsServices.updateAccount(ID, data);
      await get().getAccounts();
      toast.success("Cập nhật tài khoản thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật tài khoản:", error);
      toast.error("Không thể cập nhật tài khoản");
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
      toast.success("Xoá tài khoản thành công");
    } catch (error) {
      console.error("Lỗi khi xoá tài khoản", error);
      toast.error("Không thể xoá tài khoản");
    }
  },
}));
