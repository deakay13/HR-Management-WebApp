import { create } from "zustand";
import { toast } from "sonner";
import { DepartmentServices } from "@/services/informationServices/departmentServices";
import type {
  Department,
  DepartmentTypes,
} from "@/types/informationTypes/departmentTypes";

export const useDepartmentStore = create<DepartmentTypes>((set) => ({
  departments: [],
  initializing: true,

  clearState: () => {
    set({ departments: [], initializing: false });
  },

  createDepartment: async (data: Department) => {
    try {
      set({ initializing: true });
      const newDepartment = await DepartmentServices.createDepartment(data);
      set((state) => ({
        departments: [...state.departments, newDepartment],
        initializing: false,
      }));
      toast.success("Thêm phòng ban thành công");
    } catch (error: unknown) {
      console.error("Lỗi khi tạo phòng ban:", error);
      toast.error("Không thể thêm phòng ban");
      set({ initializing: false });
      throw error;
    }
  },

  getDepartments: async () => {
    set({ initializing: true });
    try {
      const data = await DepartmentServices.getDepartments();
      set({ departments: data });
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách phòng ban:", error);
      toast.error("Không thể tải danh sách phòng ban");
    } finally {
      set({ initializing: false });
    }
  },

  updateDepartment: async (ID: string, data: Department) => {
    try {
      set({ initializing: true });
      const updated = await DepartmentServices.updateDepartment(ID, data);
      set((state) => ({
        departments: state.departments.map((dept) =>
          dept.MaPB === ID ? updated : dept,
        ),
        initializing: false,
      }));
      toast.success("Lưu thay đổi phòng ban thành công");
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật phòng ban:", error);
      toast.error("Không thể lưu thay đổi phòng ban");
      set({ initializing: false });
      throw error;
    }
  },

  deleteDepartment: async (ID: string) => {
    try {
      set({ initializing: true });
      await DepartmentServices.deleteDepartment(ID);
      set((state) => ({
        departments: state.departments.filter((d) => d.MaPB !== ID),
        initializing: false,
      }));
      toast.success("Xoá phòng ban thành công");
    } catch (error: unknown) {
      console.error("Lỗi khi xoá phòng ban:", error);
      toast.error("Không thể xoá phòng ban");
      set({ initializing: false });
    }
  },
}));
