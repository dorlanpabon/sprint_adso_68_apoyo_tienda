import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Layout({ children }) {
  const { user, isAdmin, isVendedor, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex gap-4 items-center flex-wrap">
          <Link to="/dashboard" className="font-bold text-lg">Sprint ADSO 68</Link>
          <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white">Dashboard</Link>
          <Link to="/shop" className="text-sm text-gray-300 hover:text-white">Tienda</Link>
          <Link to="/cart" className="text-sm text-gray-300 hover:text-white">Carrito ({count})</Link>
          <Link to="/orders" className="text-sm text-gray-300 hover:text-white">Mis compras</Link>
          {(isAdmin || isVendedor) && (
            <Link to="/sales" className="text-sm text-gray-300 hover:text-white">Ventas</Link>
          )}
          {isAdmin && (
            <>
              <Link to="/users" className="text-sm text-gray-300 hover:text-white">Usuarios</Link>
              <Link to="/admin/products" className="text-sm text-gray-300 hover:text-white">Productos</Link>
            </>
          )}
          <Link to="/profile" className="text-sm text-gray-300 hover:text-white">Mi perfil</Link>
        </div>
        <div className="flex gap-3 items-center text-sm">
          <span className="text-gray-300">{user?.email}</span>
          {user?.roles?.map((r) => (
            <span key={r} className="bg-gray-700 rounded px-2 py-0.5 text-xs">{r.replace("ROLE_", "")}</span>
          ))}
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 rounded px-3 py-1">
            Salir
          </button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
