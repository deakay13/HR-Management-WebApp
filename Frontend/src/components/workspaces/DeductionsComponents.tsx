import { useDeductionStore } from "@/stores/payRollStores/deductionStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect } from "react";
import { DeductionTable } from "@/components/table/workspaceTable/DeductionTable";

const DeductionComponents = () => {
  const { Deductions, initializing, getDeductions } = useDeductionStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await getDeductions();
      }
    };
    init();
  }, [accessToken, getDeductions]);

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
        <DeductionTable data={Deductions} />
      </div>
    </div>
  );
};

export default DeductionComponents;
