import { useAccountsStore } from "@/stores/authStores/accountStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect } from "react";
import { AccountsTable } from "../table/managementsTable/AccountsTable";

export default function RolesComponents() {
  const { accounts, initializing, getAccounts } = useAccountsStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await getAccounts();
      }
    };
    init();
  }, [accessToken, getAccounts]);

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <AccountsTable data={accounts} />
      </div>
    </div>
  );
}
