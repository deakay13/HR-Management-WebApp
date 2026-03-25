import { useAllowanceStore } from "@/stores/payRollStores/allowanceStores";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect } from "react";
import { AllowanceTable } from "../Table/AllowanceTable";

const AllowanceComponents = () => {
  const { Allowances, initializing, getAllowances } = useAllowanceStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await getAllowances();
      }
    };
    init();
  }, [accessToken, getAllowances]);

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
        <AllowanceTable data={Allowances} />
      </div>
    </div>
  );
};

export default AllowanceComponents;
