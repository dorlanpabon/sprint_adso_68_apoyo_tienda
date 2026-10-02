import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function errorMessage(err) {
  const d = err.response?.data;
  if (d?.errors) return Object.values(d.errors).join(" | ");
  return d?.message || "Error al registrarse";
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "", rol: "CLIENTE" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Registro público</h1>
        <p className="text-sm text-gray-500">Solo VENDEDOR y CLIENTE. ADMIN se crea vía CRUD.</p>
        {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
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
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Contraseña * (mín. 8)</label>
          <input type="password" required minLength={8} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Rol</label>
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2">
            <option value="CLIENTE">CLIENTE</option>
            <option value="VENDEDOR">VENDEDOR</option>
          </select>
        </div>
        <button disabled={busy} className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded py-2">
          {busy ? "Registrando..." : "Crear cuenta"}
        </button>
        <p className="text-sm text-center">
          ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 underline">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
