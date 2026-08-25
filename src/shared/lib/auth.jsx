import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("la_user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("la_token"));

  const setAuthSession = (newToken, newUser) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem("la_token", newToken);
    }
    if (newUser) {
      setUser(newUser);
      localStorage.setItem("la_user", JSON.stringify(newUser));
      localStorage.setItem("la_role", newUser.role || "buyer");
    }
  };

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.token && res.user) {
      setAuthSession(res.token, res.user);
    }
    return res;
  };

  const register = async ({ name, email, password, role, store_name, phone }) => {
    const res = await api.register({ name, email, password, role, store_name, phone });
    if (res.token && res.user && !res.pendingApproval) {
      setAuthSession(res.token, res.user);
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("la_token");
    localStorage.removeItem("la_user");
    localStorage.removeItem("la_role");
    localStorage.removeItem("aura_admin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        setAuthSession,
        logout,
        isAuthenticated: !!user,
        isSeller: user?.role === "seller",
        isAdmin: user?.role === "admin",
        isBuyer: user?.role === "buyer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);