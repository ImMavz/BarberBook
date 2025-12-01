import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "bb_token";
const USER_KEY = "bb_usuario";

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.log("❌ Error guardando token:", err);
  }
};

export const getToken = async () => {
  try {
    const t = await AsyncStorage.getItem(TOKEN_KEY);
    console.log("🔍 TOKEN OBTENIDO:", t);
    return t;
  } catch (err) {
    console.log("❌ Error leyendo token:", err);
    return null;
  }
};

export const saveUsuario = async (user: any) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.log("❌ Error guardando user:", err);
  }
};

export const getUsuario = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    console.log("🔍 USUARIO OBTENIDO:", data);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.log("❌ Error leyendo user:", err);
    return null;
  }
};
