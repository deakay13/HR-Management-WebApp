import { create } from "zustand";
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
      set({ initializing: false });
    }
  },
  createContract: async (data: FormData) => {
    try {
      await ContractServices.createContract(data);
      await get().getContracts(); // Refresh the list after creating a new contract
    } catch (error) {
      console.error("Lỗi khi tạo hợp đồng:", error);
    }
  },
  updateContract: async (id: string, data: FormData) => {
    try {
      await ContractServices.updateContract(id, data);
      await get().getContracts();
    } catch (error) {
      console.error("Lỗi khi cập nhật hợp đồng:", error);
    }
  },
  deleteContract: async (id: string) => {
    try {
      await ContractServices.deleteContract(id);
      await get().getContracts();
    } catch (error) {
      console.error("Lỗi khi xóa hợp đồng:", error);
    }
  },
}));