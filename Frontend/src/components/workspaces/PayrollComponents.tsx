import { usePayRollStore } from "@/stores/payRollStores/payRollStores";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect } from "react";
import { PayRollTable } from "@/components/Table/workspaceTable/PayRollTable";

const PayRollComponents = () => {
  const { PayRolls, initializing, getPayRolls } = usePayRollStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    getPayRolls();
  }, [accessToken, getPayRolls]);

  if (!accessToken) return null;

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <span>Đang tải trang...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <PayRollTable data={PayRolls} />
      </div>
    </div>
  );
};

export default PayRollComponents;
