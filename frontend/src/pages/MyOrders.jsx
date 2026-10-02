import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/sales/mine");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error cargando compras");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Mis compras</h1>
      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white rounded shadow p-4">
            <div className="flex justify-between text-sm mb-2">
              <span><b>#{o.id}</b> · {new Date(o.fecha).toLocaleString()} · {o.estado} · {o.paymentMethod} ({o.paymentRef})</span>
              <span className="font-bold">${Number(o.total).toLocaleString()}</span>
            </div>
            <ul className="text-sm text-gray-600">
              {o.items?.map((it, idx) => (
                <li key={idx}>{it.cantidad} x {it.productNombre} — ${Number(it.subtotal).toLocaleString()}</li>
              ))}
            </ul>
            {o.vendedorEmail && <p className="text-xs text-gray-500 mt-1">Vendido por: {o.vendedorEmail}</p>}
          </div>
        ))}
        {!loading && orders.length === 0 && <p className="text-gray-500">Aún no tienes compras.</p>}
      </div>
    </Layout>
  );
}
