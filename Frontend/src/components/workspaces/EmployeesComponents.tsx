import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEmployeeStore } from "@/stores/informationStores/employeeStore";
import { EmployeeTable } from "@/components/table/informationsTable/EmployeeTable";
import { useTranslation } from "react-i18next";

export default function EmployeeComponents() {
  const { t } = useTranslation();
  const { employees, initializing, getEmployees } = useEmployeeStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await getEmployees();
      }
    };
    init();
  }, [accessToken, getEmployees]);

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
        <EmployeeTable 
          data={employees} 
          loading={initializing} 
        />
      </div>
    </div>
  );
}