import { useBaseSalaryStore } from "@/stores/payRollStores/baseSalaryStores";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect } from "react";
import { BaseSalaryTable } from "../Table/workspaceTable/BaseSalaryTable";

const BaseSalaryComponents = () => {
  const { BaseSalaries, initializing, getBaseSalaries } = useBaseSalaryStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await getBaseSalaries();
      }
    };
    init();
  }, [accessToken, getBaseSalaries]);

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
        <BaseSalaryTable data={BaseSalaries} />
      </div>
    </div>
  );
};

export default BaseSalaryComponents;
