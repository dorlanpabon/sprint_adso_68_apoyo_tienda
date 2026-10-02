import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "", stock: 0, imagenUrl: "", categoriaId: "", activo: true });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/api/categories").then(({ data }) => setCategories(data)).catch(() => {});
    if (isEdit) {
      api.get(`/api/products/${id}`).then(({ data }) => setForm({
        nombre: data.nombre, descripcion: data.descripcion || "", precio: data.precio,
        stock: data.stock, imagenUrl: data.imagenUrl || "", categoriaId: data.categoriaId || "", activo: data.activo,
      })).catch((err) => setError(err.response?.data?.message || "Error cargando"));
    }
  }, [id, isEdit]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = {
        nombre: form.nombre, descripcion: form.descripcion || null,
        precio: Number(form.precio), stock: Number(form.stock),
        imagenUrl: form.imagenUrl || null,
        categoriaId: form.categoriaId ? Number(form.categoriaId) : null,
        activo: form.activo,
      };
      if (isEdit) await api.put(`/api/products/${id}`, payload);
      else await api.post("/api/products", payload);
      navigate("/admin/products");
    } catch (err) {
      const d = err.response?.data;
      setError(d?.errors ? Object.values(d.errors).join(" | ") : d?.message || "Error guardando");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{isEdit ? `Editar producto #${id}` : "Nuevo producto"}</h1>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow max-w-2xl space-y-4">
        {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded">{error}</p>}
        <div>
          <label className="text-sm font-medium">Nombre *</label>
          <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Precio *</label>
            <input type="number" step="0.01" min="0" required value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Stock *</label>
            <input type="number" min="0" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Imagen URL</label>
          <input value={form.imagenUrl} onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Categoría</label>
          <select value={form.categoriaId} onChange={(e) => setForm({ ...form, categoriaId: e.target.value })} className="mt-1 w-full border rounded px-3 py-2">
            <option value="">Sin categoría</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} /> Activo
        </label>
        <div className="flex gap-2">
          <button disabled={busy} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{busy ? "Guardando..." : "Guardar"}</button>
          <button type="button" onClick={() => navigate("/admin/products")} className="border px-4 py-2 rounded">Cancelar</button>
        </div>
      </form>
    </Layout>
  );
}
