// Leer del archivo .env
const API_BASE_URL = `http://${process.env.EXPO_PUBLIC_API_BASE_URL}` || 'http://localhost:3000';

export { API_BASE_URL };
