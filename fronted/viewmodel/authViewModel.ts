import axios from "axios";
import { useState } from "react";

export const useAuthViewModel = () => {
  const [loading, setLoading] = useState(false);
  const API_URL = "http://192.168.1.32:3000";

  const register = async (user: any) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/users`, user);
      return { success: true, data: res.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
  try {
    setLoading(true);
    const res = await axios.post(`${API_URL}/auth/login`, {
      correo: identifier,
      contraseña: password,
    });
    return { success: true, data: res.data };
  } catch (error: any) {
    console.log("⚠ ERROR LOGIN:", error.response?.data || error.message);
    return { success: false, error: error.response?.data };
  } finally {
    setLoading(false);
  }
};


  return { register, login, loading };
};
