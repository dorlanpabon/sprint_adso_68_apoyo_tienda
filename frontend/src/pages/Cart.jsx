import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("EFECTIVO");
  const [clienteEmail, setClienteEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const canSellForOther = user?.roles?.includes("ROLE_VENDEDOR") || user?.roles?.includes("ROLE_ADMIN");

  const checkout = async () => {
    setError("");
    setBusy(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.product.id, cantidad: i.cantidad })),
        paymentMethod,
        ...(canSellForOther && clienteEmail ? { clienteEmail } : {}),
      };
      await api.post("/api/sales/checkout", payload);
      clear();
      navigate("/orders");
    } catch (err) {
      const d = err.response?.data;
      setError(d?.errors ? Object.values(d.errors).join(" | ") : d?.message || "Error en checkout");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Carrito</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}
      {items.length === 0 ? (
        <p className="text-gray-500">Carrito vacío. Ve a la tienda.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded shadow divide-y">
            {items.map((i) => (
              <div key={i.product.id} className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-bold">{i.product.nombre}</p>
                  <p className="text-sm text-gray-500">${Number(i.product.precio).toLocaleString()} c/u</p>
                </div>
                <input type="number" min={1} max={i.product.stock} value={i.cantidad}
                  onChange={(e) => setQty(i.product.id, Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1" />
                <p className="w-28 text-right font-bold">${(Number(i.product.precio) * i.cantidad).toLocaleString()}</p>
                <button onClick={() => remove(i.product.id)} className="text-red-600 text-sm underline">Quitar</button>
              </div>
            ))}
          </div>
          <div className="bg-white rounded shadow p-4 space-y-3 h-fit">
            <p className="text-lg font-bold">Total: ${total.toLocaleString()}</p>
            {canSellForOther && (
              <div>
                <label className="text-sm font-medium">Vender a (email cliente, opcional)</label>
                <input value={clienteEmail} onChange={(e) => setClienteEmail(e.target.value)}
                  placeholder="cliente@mail.com" className="mt-1 w-full border rounded px-3 py-2" />
                <p className="text-xs text-gray-500 mt-1">VENDEDOR/ADMIN: vacío = venta a tu propio usuario.</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Método de pago (simulado)</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2">
                <option value="EFECTIVO">EFECTIVO</option>
                <option value="TARJETA">TARJETA</option>
                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Sin pasarela real. Ver <code>PaymentGateway</code> en backend para integrar Stripe/PayU.</p>
            </div>
            <button disabled={busy} onClick={checkout}
              className="w-full bg-green-600 text-white rounded py-2 hover:bg-green-700 disabled:opacity-50">
              {busy ? "Procesando..." : "Confirmar compra"}
            </button>
            <button onClick={clear} className="w-full border rounded py-2">Vaciar</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
