import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { ContractTable } from "@/components/table/informationsTable/ContractTable";
import { useTranslation } from "react-i18next";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { hasRole, ROLE_EMPLOYEE } from "@/utils/authorizeUtils";
import { useContractsQuery } from "@/hooks/queries/useContractsQuery";

export default function ContractComponents() {
  const { t } = useTranslation();
  const { accessToken } = useAuthStore();
  const role = useAuthorizeStore((state) => state.role);
  const isEmployee = hasRole(role, ROLE_EMPLOYEE);

  // React Query: tự động cache 5 phút, refetch khi invalidate
  const { data, isLoading } = useContractsQuery({ size: 0 });

  const contracts = data?.data ?? [];

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
        <ContractTable data={contracts} loading={isLoading} isEmployee={isEmployee} />
      </div>
    </div>
  );
}

