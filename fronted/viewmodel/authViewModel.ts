import axios from "axios";
import { useState } from "react";
import { saveToken, saveUsuario } from "../utils/authStorage";
import { API_BASE_URL } from "../config/env";

export const useAuthViewModel = () => {
  const [loading, setLoading] = useState(false);
 
  const API_URL = API_BASE_URL;
  // const API_URL = "http://192.168.1.8:3000";
//const API_URL = "http://192.168.80.14:3000";
//const API_URL = "http://192.168.1.32:3000" //API Juanito"

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

      await saveToken(res.data.access_token);
      await saveUsuario(res.data.usuario);

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
