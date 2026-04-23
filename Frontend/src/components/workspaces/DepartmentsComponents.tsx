import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useDepartmentStore } from "@/stores/informationStores/departmentStore";
import { DepartmentTable } from "@/components/table/informationsTable/DepartmentTable";
import { useTranslation } from "react-i18next";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { hasRole, ROLE_EMPLOYEE } from "@/utils/authorizeUtils";

export default function DepartmentComponents() {
  const { t } = useTranslation();
  const { departments, initializing, getDepartments } = useDepartmentStore();
  const { accessToken, account } = useAuthStore();
  const role = useAuthorizeStore((state) => state.role);

  const isEmployee = hasRole(role, ROLE_EMPLOYEE);

  useEffect(() => {
    if (accessToken) {
      getDepartments();
    }
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
        <DepartmentTable data={departments} loading={initializing} isEmployee={isEmployee} />
      </div>
    </div>
  );
}
