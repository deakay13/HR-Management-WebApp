import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { DeductionTable } from "@/components/table/workspaceTable/DeductionTable";
import { useTranslation } from "react-i18next";
import { useDeductionsQuery } from "@/hooks/queries/usePayrollQueries";

const DeductionComponents = () => {
  const { t } = useTranslation();
  const { accessToken } = useAuthStore();

  // React Query: cache 5 phút, tự refetch khi invalidate
  const { data, isLoading } = useDeductionsQuery({ size: 0 });
  const Deductions = data?.data ?? [];

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
        <DeductionTable data={Deductions as never} />
      </div>
    </div>
  );
};

export default DeductionComponents;
