import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useDepartmentStore } from "@/stores/informationStores/departmentStore"; 
import { DepartmentTable } from "@/components/table/informationsTable/DepartmentTable";
import { useTranslation } from "react-i18next"; 

export default function DepartmentComponents() {
  const { t } = useTranslation();
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
        {t("Đang tải trang...")}
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