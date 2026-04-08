import { create } from "zustand";
import { toast } from "sonner";
import { PayRollServices } from "@/services/payRollServices/payRollServices";
import type { PayRollTypes } from "@/types/payRollTypes/payRollTypes";

export const usePayRollStore = create<PayRollTypes>((set,get) => ({
    PayRolls: [],
    initializing: true,

    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    searchParams: {},
    
    clearState: () => {
        set({ PayRolls: [] });
    },

        getPayRolls: async () => {
            // Chỉ set initializing nếu thực sự cần hiện loading toàn trang
            set({ initializing: true }); 
            try {
                const response = await PayRollServices.getPayRolls();
                
                // Backend của bạn trả về: { data: rows, totalItems, ... }
                // Phải lấy đúng response.data
                const actualData = response?.data || [];
                
                set({ 
                    PayRolls: actualData,
                    totalItems: response?.totalItems || 0,
                    totalPages: response?.totalPages || 0
                });
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                set({ initializing: false });
            }
        },
     deletePayRoll: async (ID: string) => {
            try {
              await PayRollServices.deletePayRoll(ID);
              set({
                    PayRolls: get().PayRolls.filter((d) => d.MaBL !== ID),
              });
              toast.success("Xoá Bảng lương thành công");
            } catch (error) {
              console.error("Lỗi khi xoá Bảng lương", error);
              toast.error("Không thể xoá Bảng lương");
            }
          },
     // CREATE
         createPayRolls: async (data) => {
            try {
                    const newItem = await PayRollServices.createPayRoll(data);
                    await get().getPayRolls(); // Tải lại danh sách sau khi thêm
                    set({
                            PayRolls: [...get().PayRolls, newItem],
                     });
                
                    toast.success("Thêm Bảng lương thành công");
                } catch (error) {
                    console.error("Lỗi khi thêm Bảng lương", error);
                    toast.error("Không thể thêm Bảng lương");
                }
        },
                
            // UPDATE
        updatePayRoll: async (ID: string, data) => {
            try {
                const updated = await PayRollServices.updatePayRoll(ID, data);
                await get().getPayRolls(); // Tải lại danh sách sau khi cập nhật
                set({
                    PayRolls: get().PayRolls.map((d) =>
                    d.MaBL === ID ? updated : d
                    ),
                });
                
                toast.success("Cập nhật Bảng lương thành công");
            } catch (error) {
                console.error("Lỗi khi cập nhật Bảng lương", error);
                toast.error("Không thể cập nhật Bảng lương");
                    }
        },
        searchPayRolls: async (params) => {
            try {
                const res = await PayRollServices.searchPayRolls(params);

                set({
                    PayRolls: res.data,
                    totalItems: res.totalItems,
                    totalPages: res.totalPages,
                    currentPage: res.currentPage,
                    searchParams: params
                });

            } catch (error) {
                console.error("Lỗi search payroll", error);
                toast.error("Không thể tìm kiếm bảng lương");
            } finally {
                
            }
        },
}));
