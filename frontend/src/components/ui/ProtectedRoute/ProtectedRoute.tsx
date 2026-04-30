import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../store";

export default function ProtectedRoute() {
  const { isAuthenticated, isHydrating } = useAuthStore();

  if (isHydrating) {
    return <div>Carregando sessao...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
