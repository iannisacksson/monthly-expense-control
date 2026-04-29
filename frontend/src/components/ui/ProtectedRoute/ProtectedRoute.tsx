import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../store";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
