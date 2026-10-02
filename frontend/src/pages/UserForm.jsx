import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";

const ALL_ROLES = ["ROLE_ADMIN", "ROLE_VENDEDOR", "ROLE_CLIENTE"];

export default function UserForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "", enabled: true, roles: ["ROLE_CLIENTE"] });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await api.get(`/api/users/${id}`);
        setForm({ nombre: data.nombre || "", apellido: data.apellido || "", email: data.email, password: "", enabled: data.enabled, roles: data.roles });
      } catch (err) {
        setError(err.response?.data?.message || "Error cargando usuario");
      }
    })();
  }, [id, isEdit]);

  const toggleRole = (role) => {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isEdit) {
        const payload = {
          nombre: form.nombre,
          apellido: form.apellido || null,
          enabled: form.enabled,
          roles: form.roles,
          ...(form.password ? { password: form.password } : {}),
        };
        await api.put(`/api/users/${id}`, payload);
      } else {
        await api.post("/api/users", {
          nombre: form.nombre,
          apellido: form.apellido || null,
          email: form.email,
          password: form.password,
          enabled: form.enabled,
          roles: form.roles,
        });
      }
      navigate("/users");
    } catch (err) {
      const d = err.response?.data;
      setError(d?.errors ? Object.values(d.errors).join(" | ") : d?.message || "Error guardando");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{isEdit ? `Editar usuario #${id}` : "Nuevo usuario (solo ADMIN)"}</h1>
      <form onSubmit={submit} className="bg-white p-6 rounded shadow max-w-2xl space-y-4">
        {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded">{error}</p>}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Nombre *</label>
            <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Apellido</label>
            <input value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Email *</label>
          <input type="email" required disabled={isEdit} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2 disabled:bg-gray-100" />
        </div>
        <div>
          <label className="text-sm font-medium">
            {isEdit ? "Contraseña (vacío = conservar)" : "Contraseña * (mín. 8)"}
          </label>
          <input type="password" required={!isEdit} minLength={isEdit && !form.password ? undefined : 8}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Roles (ADMIN puede asignar cualquiera)</label>
          <div className="flex gap-2 mt-2">
            {ALL_ROLES.map((r) => (
              <label key={r} className={`border rounded px-3 py-1 text-sm cursor-pointer ${form.roles.includes(r) ? "bg-gray-900 text-white" : "bg-white"}`}>
                <input type="checkbox" className="hidden" checked={form.roles.includes(r)} onChange={() => toggleRole(r)} />
                {r.replace("ROLE_", "")}
              </label>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
          Activo
        </label>
        <div className="flex gap-2">
          <button disabled={busy} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {busy ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" onClick={() => navigate("/users")} className="border px-4 py-2 rounded">
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
}
