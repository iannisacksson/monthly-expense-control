import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";

export default function AuthLayout() {
  const { isAuthenticated, isHydrating } = useAuthStore();

  if (isHydrating) {
    return <div>Carregando sessao...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
