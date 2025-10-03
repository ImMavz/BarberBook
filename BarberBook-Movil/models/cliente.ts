import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";

export interface User {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: string;
}
