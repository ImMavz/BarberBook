import { User } from "../models/cliente";
import axios from "axios";
import { API_BASE_URL } from "../config/env";

const API_URL = `${API_BASE_URL}/auth`;

export const authService = {
  register: async (user: User) => {
    const response = await axios.post(`${API_URL}/register`, user);
    return response.data;
  },

  login: async (identifier: number, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { identifier, password });
    return response.data;
  }
};
