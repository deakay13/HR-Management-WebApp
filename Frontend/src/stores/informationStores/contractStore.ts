import i18n from "@/i18n";
import { create } from "zustand";
import { toast } from "sonner";
import { ContractServices } from "@/services/informationServices/contractServices";
import type { Contract } from "@/types/informationTypes/contractTypes";

interface ContractState {
  contracts: Contract[];
  initializing: boolean;
  getContracts: () => Promise<void>;
  createContract: (data: FormData) => Promise<void>;
  updateContract: (id: string, data: FormData) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
}

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: [],
  initializing: true,

  getContracts: async () => {
    try {
      set({ initializing: true });
      const data = await ContractServices.getContracts();
      set({ contracts: data, initializing: false });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hợp đồng:", error);
      toast.error(i18n.t("Không thể tải danh sách hợp đồng"));
      set({ initializing: false });
    }
  },

  createContract: async (data: FormData) => {
    try {
      await ContractServices.createContract(data);
      await get().getContracts();
      toast.success(i18n.t("Thêm hợp đồng thành công"));
    } catch (error) {
      console.error("Lỗi khi tạo hợp đồng:", error);
      toast.error(i18n.t("Không thể thêm hợp đồng"));
      throw error;
    }
  },

  updateContract: async (id: string, data: FormData) => {
    try {
      await ContractServices.updateContract(id, data);
      await get().getContracts();
      toast.success(i18n.t("Lưu thay đổi hợp đồng thành công"));
    } catch (error) {
      console.error("Lỗi khi cập nhật hợp đồng:", error);
      toast.error(i18n.t("Không thể lưu thay đổi hợp đồng"));
      throw error;
    }
  },

  deleteContract: async (id: string) => {
    try {
      await ContractServices.deleteContract(id);
      await get().getContracts();
      toast.success(i18n.t("Xoá hợp đồng thành công"));
    } catch (error) {
      console.error("Lỗi khi xóa hợp đồng:", error);
      toast.error(i18n.t("Không thể xoá hợp đồng"));
    }
  },
}));
