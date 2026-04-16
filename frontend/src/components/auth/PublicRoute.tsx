import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { Loading } from "@/components/ui/loading";

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <Loading text="LOADING..." />;

  if (isAuthenticated) {
    const from =
      (location.state as { from?: Location })?.from?.pathname || "/upload";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
