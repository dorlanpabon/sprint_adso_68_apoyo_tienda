import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";

const PAGE_SIZE = 5;

export default function SalesList() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/sales");
      setSales(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error cargando ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sales.filter((s) => !q || s.clienteEmail?.toLowerCase().includes(q) || String(s.id).includes(q));
  }, [sales, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  const cancel = async (id) => {
    if (!confirm("¿Cancelar venta y devolver stock?")) return;
    await api.put(`/api/sales/${id}/cancel`);
    await load();
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Ventas ({filtered.length})</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por cliente o # venta..." className="w-full border rounded px-3 py-2" />
      </div>
      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}
      <div className="space-y-3">
        {pageItems.map((o) => (
          <div key={o.id} className="bg-white rounded shadow p-4">
            <div className="flex justify-between text-sm">
              <span><b>#{o.id}</b> {new Date(o.fecha).toLocaleString()} · Cliente: {o.clienteEmail} {o.vendedorEmail && `· Vend: ${o.vendedorEmail}`} · {o.estado}</span>
              <span className="font-bold">${Number(o.total).toLocaleString()}</span>
            </div>
            <ul className="text-sm text-gray-600 mt-1">
              {o.items?.map((it, idx) => <li key={idx}>{it.cantidad} x {it.productNombre}</li>)}
            </ul>
            {o.estado !== "CANCELADA" && (
              <button onClick={() => cancel(o.id)} className="mt-2 text-red-600 text-sm underline">Cancelar</button>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 text-sm">
        <p className="text-gray-600">Página {safePage} de {totalPages}</p>
        <div className="flex gap-2">
          <button disabled={safePage <= 1} onClick={() => setPage((x) => x - 1)} className="border rounded px-3 py-1 bg-white disabled:opacity-50">Anterior</button>
          <button disabled={safePage >= totalPages} onClick={() => setPage((x) => x + 1)} className="border rounded px-3 py-1 bg-white disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </Layout>
  );
}
