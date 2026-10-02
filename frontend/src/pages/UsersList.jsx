import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";

const PAGE_SIZE = 5;

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("TODOS");
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/users");
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchQ = !q ||
        u.nombre?.toLowerCase().includes(q) ||
        u.apellido?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      const matchR = roleFilter === "TODOS" || u.roles?.includes(`ROLE_${roleFilter}`);
      return matchQ && matchR;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, roleFilter]);

  const handleDelete = async (id) => {
    if (!confirm("¿Desactivar usuario (baja lógica)?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Error eliminando");
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Usuarios ({filtered.length})</h1>
        <Link to="/users/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo (ADMIN asigna rol)
        </Link>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-3">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, apellido o email..."
          className="flex-1 border rounded px-3 py-2"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded px-3 py-2">
          <option value="TODOS">Todos los roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="VENDEDOR">VENDEDOR</option>
          <option value="CLIENTE">CLIENTE</option>
        </select>
        <button onClick={load} className="border rounded px-4 py-2 hover:bg-gray-50">Recargar</button>
      </div>

      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}

      {!loading && !error && (
        <>
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Roles</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-3">{u.id}</td>
                    <td className="p-3">{u.nombre} {u.apellido}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {u.roles?.map((r) => (
                          <span key={r} className="bg-gray-200 rounded px-2 py-0.5 text-xs">
                            {r.replace("ROLE_", "")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${u.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {u.enabled ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <Link to={`/users/${u.id}/edit`} className="text-blue-600 underline">Editar</Link>
                      <button onClick={() => handleDelete(u.id)} className="text-red-600 underline">
                        Desactivar
                      </button>
                    </td>
                  </tr>
                ))}
                {pageItems.length === 0 && (
                  <tr><td colSpan={6} className="p-6 text-center text-gray-500">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm">
            <p className="text-gray-600">Página {safePage} de {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}
                className="border rounded px-3 py-1 disabled:opacity-50 bg-white">Anterior</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`border rounded px-3 py-1 ${n === safePage ? "bg-gray-900 text-white" : "bg-white"}`}>
                  {n}
                </button>
              ))}
              <button disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}
                className="border rounded px-3 py-1 disabled:opacity-50 bg-white">Siguiente</button>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
