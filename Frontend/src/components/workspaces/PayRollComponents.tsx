import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { PayRollTable } from "@/components/table/workspaceTable/PayRollTable";
import { hasRole, ROLE_EMPLOYEE } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";
import { usePayrollsQuery } from "@/hooks/queries/usePayrollQueries";

const PayRollComponents = () => {
  const { t } = useTranslation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const account = useAuthStore((state) => state.account);
  const role = useAuthorizeStore((state) => state.role);

  const isEmployee = hasRole(role, ROLE_EMPLOYEE);

  // React Query: cache 3 phút
  // Nếu là Employee → truyền employeeId để lấy bảng lương cá nhân
  const { data, isLoading } = usePayrollsQuery(
    { size: 0 },
    { employeeId: isEmployee && account?.MaNV ? account.MaNV : undefined }
  );

  const PayRolls = data?.data ?? [];

  if (!accessToken) return null;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <span>{t("Đang tải trang...")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <PayRollTable data={PayRolls as never} isEmployee={isEmployee} />
      </div>
    </div>
  );
};

export default PayRollComponents;
