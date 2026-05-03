import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { EmployeeTable } from "@/components/table/informationsTable/EmployeeTable";
import { useTranslation } from "react-i18next";
import { useEmployeesQuery } from "@/hooks/queries/useEmployeesQuery";

export default function EmployeeComponents() {
  const { t } = useTranslation();
  const { accessToken } = useAuthStore();

  // React Query: tự động cache 5 phút, refetch khi invalidate
  const { data, isLoading } = useEmployeesQuery({ size: 0 });

  // API employees trả về array thuần
  const employees = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data as unknown[] : []);

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
        <EmployeeTable data={employees as never} loading={isLoading} />
      </div>
    </div>
  );
}

