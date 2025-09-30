import { User } from "../models/cliente";
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Aquí va tu la url del backend 

export const authService = {
  register: async (user: User) => {
    const response = await axios.post(`${API_URL}/auth/register`, user);
    return response.data;
  },

  login: async (identifier: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { identifier, password });
    return response.data;
  }
};
