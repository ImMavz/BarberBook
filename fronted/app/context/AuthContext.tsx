import React, { createContext, useState, useEffect } from "react";
import { getUsuario, getToken } from "../../utils/authStorage";

type AuthContextProps = {
  user: any;
  token: string | null;
  loading: boolean;
  logout: () => void;
  login: (userData: any, token: string) => void;
};

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  loading: true,
  logout: () => {},
  login: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar desde almacenamiento local
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await getUsuario();
        const storedToken = await getToken();

        if (storedUser) setUser(storedUser);
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.log("Error cargando usuario:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const login = (userData: any, token: string) => {
    setUser(userData);
    setToken(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
