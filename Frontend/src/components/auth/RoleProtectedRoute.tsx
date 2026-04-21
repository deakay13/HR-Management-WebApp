import { Navigate, Outlet } from "react-router-dom";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const role = useAuthorizeStore((state) => state.role);
  const initializing = useAuthorizeStore((state) => state.initializing);

  // Wait until role is resolved before making a decision
  if (initializing) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        Đang tải...
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role.TenVaiTro)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
