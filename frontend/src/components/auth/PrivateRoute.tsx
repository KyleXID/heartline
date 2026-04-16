import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { Loading } from "@/components/ui/loading";

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <Loading text="LOADING..." />;
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}
