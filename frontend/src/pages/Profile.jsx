import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

export default function Profile() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/users/me");
        setMe(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error cargando perfil");
      }
    })();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Mi perfil</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}
      {me && (
        <div className="bg-white p-6 rounded shadow max-w-md space-y-2">
          <p><b>ID:</b> {me.id}</p>
          <p><b>Nombre:</b> {me.nombre} {me.apellido}</p>
          <p><b>Email:</b> {me.email}</p>
          <p><b>Estado:</b> {me.enabled ? "Activo" : "Inactivo"}</p>
          <p><b>Roles:</b> {me.roles?.join(", ")}</p>
        </div>
      )}
    </Layout>
  );
}
