import { create } from "zustand";
import { toast } from "sonner";
import { accountsServices } from "@/services/userServices/accountsService";
import type { AccountTypes } from "@/types/authTypes/accountType";

export const useAccountsStore = create<AccountTypes>((set) => ({
  accounts: [],
  initializing: true,
  clearState: () => {
    set({ accounts: [] });
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
}));
