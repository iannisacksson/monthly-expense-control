import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
