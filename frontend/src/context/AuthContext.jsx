import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;
  const isAdmin = user?.roles?.includes("ROLE_ADMIN") ?? false;
  const isVendedor = user?.roles?.includes("ROLE_VENDEDOR") ?? false;

  const saveSession = (data) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser({ email: data.email, nombre: data.nombre, roles: data.roles });
  };

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/api/users/me");
      setUser({ email: data.email, nombre: data.nombre, roles: data.roles, id: data.id });
    } catch {
      logout();
    }
  };

  useEffect(() => {
    (async () => {
      if (token) await fetchMe();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    saveSession(data);
    return data;
  };

  const register = async ({ nombre, apellido, email, password, rol }) => {
    const { data } = await api.post("/api/auth/register", {
      nombre,
      apellido: apellido || null,
      email,
      password,
      rol,
    });
    saveSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, isAdmin, isVendedor, login, register, logout, fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
