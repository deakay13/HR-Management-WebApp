import { useBaseSalaryStore } from "@/stores/payRollStores/baseSalaryStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect } from "react";
import { BaseSalaryTable } from "@/components/table/workspaceTable/BaseSalaryTable";
import { useTranslation } from "react-i18next";

const BaseSalaryComponents = () => {
  const { t } = useTranslation();
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
        {t("Đang tải trang...")}
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
