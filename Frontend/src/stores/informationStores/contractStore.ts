import i18n from "@/i18n";
import { create } from "zustand";
import { toast } from "sonner";
import { ContractServices } from "@/services/informationServices/contractServices";
import type { Contract } from "@/types/informationTypes/contractTypes";

interface ContractState {
  contracts: Contract[];
  initializing: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  searchParams: Record<string, any>;
  getContracts: (params?: Record<string, any>) => Promise<void>;
  createContract: (data: FormData) => Promise<void>;
  updateContract: (id: string, data: FormData) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  searchContracts: (params: Record<string, any>) => Promise<void>;
}

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: [],
  initializing: true,
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  searchParams: {},

  getContracts: async (params?: Record<string, any>) => {
    set({ initializing: true });
    try {
      const response = await ContractServices.getContracts(params);
      set({
        contracts: response?.data || [],
        totalItems: response?.totalItems || 0,
        totalPages: response?.totalPages || 0,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hợp đồng:", error);
      toast.error(i18n.t("Không thể tải danh sách hợp đồng"));
    } finally {
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

  searchContracts: async (params: Record<string, any>) => {
    try {
      const res = await ContractServices.searchContracts(params);
      set({
        contracts: res.data,
        totalItems: res.totalItems,
        totalPages: res.totalPages,
        currentPage: res.currentPage,
        searchParams: params,
      });
    } catch (error) {
      console.error("Lỗi search contracts", error);
      toast.error(i18n.t("Không thể tìm kiếm hợp đồng"));
    } finally {
      set({ initializing: false });
    }
  },
}));

