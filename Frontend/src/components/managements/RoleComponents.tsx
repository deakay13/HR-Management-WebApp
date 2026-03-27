import { useRolesStore } from "@/stores/permissionStores/RolesStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect } from "react";
import { RolesTable } from "../Table/managementsTable/RolesTable";

const AccountsComponents = () => {
  const { Roles, initializing, getRoles } = useRolesStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await getRoles();
      }
    };
    init();
  }, [accessToken, getRoles]);

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
        <RolesTable data={Roles} />
      </div>
    </div>
  );
};

export default AccountsComponents;
