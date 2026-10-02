import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";

const PAGE_SIZE = 8;

export default function Shop() {
  const { add } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("TODAS");
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const [p, c] = await Promise.all([
          api.get("/api/products?soloActivos=true"),
          api.get("/api/categories").catch(() => ({ data: [] })),
        ]);
        setProducts(p.data);
        setCategories(c.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error cargando tienda");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchQ = !q || p.nombre?.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q);
      const matchC = catFilter === "TODAS" || String(p.categoriaId) === String(catFilter);
      return matchQ && matchC && p.activo && p.stock > 0;
    });
  }, [products, search, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, catFilter]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tienda ({filtered.length})</h1>
        <Link to="/cart" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Ver carrito</Link>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..." className="flex-1 border rounded px-3 py-2" />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="border rounded px-3 py-2">
          <option value="TODAS">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pageItems.map((p) => (
          <div key={p.id} className="bg-white rounded shadow p-4 flex flex-col">
            {p.imagenUrl ? (
              <img src={p.imagenUrl} alt={p.nombre} className="h-32 w-full object-cover rounded mb-2" />
            ) : (
              <div className="h-32 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-500 text-sm">Sin imagen</div>
            )}
            <h2 className="font-bold">{p.nombre}</h2>
            <p className="text-xs text-gray-500 mb-1">{p.categoriaNombre}</p>
            <p className="text-sm text-gray-600 flex-1">{p.descripcion}</p>
            <p className="mt-2 font-bold">${Number(p.precio).toLocaleString()}</p>
            <p className="text-xs text-gray-500">Stock: {p.stock}</p>
            <button onClick={() => add(p, 1)} className="mt-2 bg-blue-600 text-white rounded py-1.5 hover:bg-blue-700">
              Agregar
            </button>
          </div>
        ))}
      </div>
      {pageItems.length === 0 && !loading && <p className="text-center text-gray-500 mt-6">Sin productos</p>}

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
