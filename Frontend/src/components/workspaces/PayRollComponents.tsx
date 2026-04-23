import { usePayRollStore } from "@/stores/payRollStores/payRollStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useEffect } from "react";
import { PayRollTable } from "@/components/table/workspaceTable/PayRollTable";
import { hasRole, ROLE_EMPLOYEE } from "@/utils/authorizeUtils";
import { useTranslation } from "react-i18next";

const PayRollComponents = () => {
  const { t } = useTranslation();
  const { PayRolls, initializing, getPayRolls, getMyPayrolls } =
    usePayRollStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const account = useAuthStore((state) => state.account);
  const role = useAuthorizeStore((state) => state.role);

  const isEmployee = hasRole(role, ROLE_EMPLOYEE);

  useEffect(() => {
    if (!accessToken) return;

    if (isEmployee && account?.MaNV) {
      // Employee: only fetch own payroll
      getMyPayrolls(account.MaNV);
    } else {
      // Admin / HR: fetch all payrolls
      getPayRolls();
    }
  }, [accessToken, account?.MaNV, isEmployee, getPayRolls, getMyPayrolls]);

  if (!accessToken) return null;

  if (initializing) {
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
        <PayRollTable data={PayRolls} isEmployee={isEmployee} />
      </div>
    </div>
  );
};

export default PayRollComponents;
