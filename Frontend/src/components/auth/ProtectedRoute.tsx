import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, account, initializing, refresh, getCurrentAccount } = useAuthStore();
  const [ starting, setStarting ] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!accessToken) {
        await refresh();
      }
      if (accessToken && !account) {
        await getCurrentAccount();
      }
      setStarting(false);
    };
    init();
  }, [accessToken, account, refresh, getCurrentAccount]);

  if (starting || initializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken || !account) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet></Outlet>;
};

export default ProtectedRoute;
