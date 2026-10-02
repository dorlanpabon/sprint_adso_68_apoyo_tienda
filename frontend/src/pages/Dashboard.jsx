import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, isAdmin, isVendedor } = useAuth();
  const isCliente = user?.roles?.includes("ROLE_CLIENTE");
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2">Hola, {user?.nombre || user?.email}</h1>
      <p className="text-gray-600 mb-6">Roles: {user?.roles?.join(", ")}</p>
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/shop" className="bg-white p-6 rounded shadow hover:shadow-md">
          <h2 className="font-bold">Tienda</h2>
          <p className="text-sm text-gray-500">Catálogo para CLIENTE comprar</p>
        </Link>
        <Link to="/cart" className="bg-white p-6 rounded shadow hover:shadow-md">
          <h2 className="font-bold">Carrito</h2>
          <p className="text-sm text-gray-500">Checkout sin pasarela (mock)</p>
        </Link>
        <Link to="/orders" className="bg-white p-6 rounded shadow hover:shadow-md">
          <h2 className="font-bold">Mis compras</h2>
          <p className="text-sm text-gray-500">Historial GET /api/sales/mine</p>
        </Link>
        {(isAdmin || isVendedor) && (
          <Link to="/sales" className="bg-white p-6 rounded shadow hover:shadow-md">
            <h2 className="font-bold">Ventas (VENDEDOR)</h2>
            <p className="text-sm text-gray-500">Todas las ventas + cancelar</p>
          </Link>
        )}
        {isAdmin && (
          <>
            <Link to="/admin/products" className="bg-white p-6 rounded shadow hover:shadow-md">
              <h2 className="font-bold">Productos (ADMIN)</h2>
              <p className="text-sm text-gray-500">Solo ADMIN crea/edita</p>
            </Link>
            <Link to="/users" className="bg-white p-6 rounded shadow hover:shadow-md">
              <h2 className="font-bold">Usuarios</h2>
              <p className="text-sm text-gray-500">CRUD solo ADMIN</p>
            </Link>
          </>
        )}
        {!isAdmin && !isVendedor && isCliente && (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded">
            <h2 className="font-bold">Cliente</h2>
            <p className="text-sm text-gray-600">Puedes comprar en Tienda y ver Mis compras.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
