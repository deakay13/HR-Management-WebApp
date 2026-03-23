import { usePermissionsStore } from "@/stores/permissionStores/PermissionsStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect } from "react";
import { PermissionsTable } from "../Table/PermissionsTable";

const PermissionsComponents = () => {
  const { Permissions, initializing, getPermissions } = usePermissionsStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await getPermissions();
      }
    };
    init();
  }, [accessToken, getPermissions]);

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
        <PermissionsTable data={Permissions} />
      </div>
    </div>
  );
};

export default PermissionsComponents;
