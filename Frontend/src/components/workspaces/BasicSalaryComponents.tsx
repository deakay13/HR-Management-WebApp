import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { BaseSalaryTable } from "@/components/table/workspaceTable/BaseSalaryTable";
import { useTranslation } from "react-i18next";
import { useBaseSalariesQuery } from "@/hooks/queries/usePayrollQueries";

const BaseSalaryComponents = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuthStore();

  // React Query: cache 5 phút, tự refetch khi invalidate
  const { data, isLoading } = useBaseSalariesQuery({ size: 0 });
  const BaseSalaries = data?.data ?? [];

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
        <BaseSalaryTable data={BaseSalaries as never} />
      </div>
    </div>
  );
};

export default BaseSalaryComponents;
