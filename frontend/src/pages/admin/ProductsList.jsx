import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

const PAGE_SIZE = 5;

export default function ProductsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/products?soloActivos=false");
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => !q || p.nombre?.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  const deactivate = async (id) => {
    if (!confirm("¿Desactivar producto?")) return;
    await api.delete(`/api/products/${id}`);
    await load();
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Productos ADMIN ({filtered.length})</h1>
        <Link to="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded">+ Nuevo</Link>
      </div>
      <div className="bg-white p-4 rounded shadow mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..." className="w-full border rounded px-3 py-2" />
      </div>
      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr><th className="p-3">ID</th><th className="p-3">Nombre</th><th className="p-3">Precio</th><th className="p-3">Stock</th><th className="p-3">Estado</th><th className="p-3">Acciones</th></tr>
          </thead>
          <tbody>
            {pageItems.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.nombre}<div className="text-xs text-gray-500">{p.categoriaNombre}</div></td>
                <td className="p-3">${Number(p.precio).toLocaleString()}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.activo ? "Activo" : "Inactivo"}</td>
                <td className="p-3 flex gap-2">
                  <Link to={`/admin/products/${p.id}/edit`} className="text-blue-600 underline">Editar</Link>
                  <button onClick={() => deactivate(p.id)} className="text-red-600 underline">Desactivar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
