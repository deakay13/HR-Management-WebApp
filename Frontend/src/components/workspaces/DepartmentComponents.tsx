import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useDepartmentStore } from "@/stores/informationStores/departmentStores"; 
import { DepartmentTable } from "@/components/Table/informationsTable/DepartmentTable"; 

export default function DepartmentComponents() {
  const { departments, initializing, getDepartments } = useDepartmentStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await getDepartments();
      }
    };
    init();
  }, [accessToken, getDepartments]);

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DepartmentTable 
          data={departments} 
          loading={initializing} 
        />
      </div>
    </div>
  );
}