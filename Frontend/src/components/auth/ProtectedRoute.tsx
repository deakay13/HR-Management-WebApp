import { useAuthStore } from "@/stores/useAuthStore";
import { Outlet,Navigate } from "react-router";


const ProtectedRoute = () => {
    const { accessToken} = useAuthStore();
    if (!accessToken) {
        return <Navigate to="/signin" replace/>;
    }
    return (<Outlet></Outlet>);
}

export default ProtectedRoute;