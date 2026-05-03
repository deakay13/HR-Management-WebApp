import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { DepartmentTable } from "@/components/table/informationsTable/DepartmentTable";
import { useTranslation } from "react-i18next";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { hasRole, ROLE_EMPLOYEE } from "@/utils/authorizeUtils";
import { useDepartmentsQuery } from "@/hooks/queries/useDepartmentsQuery";

export default function DepartmentComponents() {
  const { t } = useTranslation();
  const { accessToken } = useAuthStore();
  const role = useAuthorizeStore((state) => state.role);
  const isEmployee = hasRole(role, ROLE_EMPLOYEE);

  // React Query: tự động cache 5 phút, refetch khi invalidate
  const { data, isLoading } = useDepartmentsQuery(
    { size: 0 }, // size: 0 = lấy toàn bộ (giống getDepartments cũ)
    // enabled: chỉ chạy khi đã có accessToken
  );

  const departments = data?.data ?? [];

  if (!accessToken || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t("Đang tải trang...")}
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DepartmentTable data={departments} loading={isLoading} isEmployee={isEmployee} />
      </div>
    </div>
  );
}

