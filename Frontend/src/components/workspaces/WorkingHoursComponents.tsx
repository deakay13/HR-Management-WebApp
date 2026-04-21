import { useHoursStore } from "@/stores/payRollStores/hoursStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect } from "react";
import { HoursTable } from "@/components/table/workspaceTable/HoursTable";
import { useTranslation } from "react-i18next";

const WorkingHoursComponents = () => {
  const { t } = useTranslation();
  const { Hours, initializing, getHours } = useHoursStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await getHours();
      }
    };
    init();
  }, [accessToken, getHours]);

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
        <HoursTable data={Hours} />
      </div>
    </div>
  );
};

export default WorkingHoursComponents;
