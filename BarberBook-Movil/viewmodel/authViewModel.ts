import { useState } from "react";
import { authService } from "../services/authServices";
import { User } from "../models/cliente";

export function useAuthViewModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (user: User) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(user);
      return response;
    } catch (err) {
      setError("Error en el registro");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(Number(identifier), password);
      return response;
    } catch (err) {
      setError("Error al iniciar sesión");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, register, login };
}
