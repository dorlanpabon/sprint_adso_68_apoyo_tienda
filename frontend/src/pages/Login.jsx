import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function errorMessage(err) {
  const d = err.response?.data;
  if (d?.errors) return Object.values(d.errors).join(" | ");
  return d?.message || "Error al iniciar sesión";
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email, form.password);
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
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded">{error}</p>}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="admin@sistema.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Contraseña</label>
          <input
            type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <button disabled={busy} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded py-2">
          {busy ? "Ingresando..." : "Entrar"}
        </button>
        <p className="text-sm text-center">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-600 underline">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
