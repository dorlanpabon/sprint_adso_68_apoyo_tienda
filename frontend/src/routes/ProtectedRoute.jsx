import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p className="p-8 text-center text-gray-500">Cargando...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <p className="p-8 text-center text-gray-500">Cargando...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function SellerRoute() {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <p className="p-8 text-center text-gray-500">Cargando...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const ok = user?.roles?.includes("ROLE_VENDEDOR") || user?.roles?.includes("ROLE_ADMIN");
  if (!ok) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
