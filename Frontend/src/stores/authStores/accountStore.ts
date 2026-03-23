import { create } from "zustand";
import { toast } from "sonner";
import { accountsServices } from "@/services/userServices/accountsService";
import type {Account, AccountTypes } from "@/types/authTypes/accountType";

export const useAccountsStore = create<AccountTypes>((set, get) => ({
  accounts: [],
  initializing: true,
  clearState: () => {
    set({ accounts: [] });
  },
  createAccount: async (data: Account) => {
    try {
      set({ initializing: true });
      const newAcc = await accountsServices.createAccount(data);
      set((state) => ({
        accounts: [...state.accounts, newAcc],
        initializing: false,
      }));
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      set({ initializing: false });
    }
  },

  getAccounts: async () => {
    set({ initializing: true });
    try {
      const data = await accountsServices.getAccounts();
      set({ accounts: data });
      toast.success("Lấy danh sách tài khoản thành công");
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản", error);
      toast.error("Không thể lấy danh sách tài khoản");
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
