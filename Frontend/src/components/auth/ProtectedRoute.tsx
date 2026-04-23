import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";

const ProtectedRoute = () => {
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const { accessToken, refresh, getCurrentAccount } =
          useAuthStore.getState();

        if (!accessToken) {
          await refresh(false);
        }

        // Re-read state after refresh
        const state = useAuthStore.getState();
        if (state.accessToken && !state.account) {
          await getCurrentAccount();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      }
      if (isMounted) setStarting(false);
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const { accessToken, account, initializing } = useAuthStore();

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
  return <Outlet />;
};

export default ProtectedRoute;
