import Constants from 'expo-constants';

// Leer del archivo .env a través de la configuración de Expo
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';

export { API_BASE_URL };
