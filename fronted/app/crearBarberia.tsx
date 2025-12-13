import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_BASE_URL } from "@/config/env";

const API_URL = API_BASE_URL;

interface JwtPayload {
  sub: number;
  rol: string;
}

const DIAS = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export default function CrearBarberiaScreen() {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [dueñoId, setDueñoId] = useState<number | null>(null);

  const [horarios, setHorarios] = useState<any>(
    DIAS.reduce((acc, dia) => {
      acc[dia] = {
        abierto: dia !== "domingo",
        abre: new Date(),
        cierra: new Date(),
      };
      return acc;
    }, {} as any)
  );

  const [picker, setPicker] = useState<{
    dia: string;
    tipo: "abre" | "cierra";
  } | null>(null);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode<JwtPayload>(token);
    setDueñoId(decoded.sub);
  };

  const formatearHora = (date: Date) =>
    date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const construirHorariosBackend = () => {
    const result: any = {};
    DIAS.forEach((dia) => {
      if (!horarios[dia].abierto) {
        result[dia] = null;
      } else {
        result[dia] = {
          abre: formatearHora(horarios[dia].abre),
          cierra: formatearHora(horarios[dia].cierra),
        };
      }
    });
    return result;
  };

  const crearBarberia = async () => {
    if (!nombre || !direccion || !dueñoId) {
      Alert.alert("Error", "Datos incompletos");
      return;
    }

    const body = {
      nombre,
      direccion,
      dueñoId,
      horariosGlobales: construirHorariosBackend(),
    };

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/barbershops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        console.log("❌ Error backend:", err);
        Alert.alert("Error", "No se pudo crear la barbería");
        return;
      }

      Alert.alert("✅ Éxito", "Barbería creada correctamente");
    } catch (error) {
      console.log("❌ Error frontend:", error);
      Alert.alert("Error", "Error de conexión");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear nueva barbería</Text>

      <TextInput
        placeholder="Nombre de la barbería"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
        style={styles.input}
      />

      <Text style={styles.subtitle}>Horarios</Text>

      {DIAS.map((dia) => (
        <View key={dia} style={styles.diaCard}>
          <View style={styles.diaHeader}>
            <Text style={styles.dia}>{dia.toUpperCase()}</Text>
            <Switch
              value={horarios[dia].abierto}
              onValueChange={(v) =>
                setHorarios({
                  ...horarios,
                  [dia]: { ...horarios[dia], abierto: v },
                })
              }
            />
          </View>

          {horarios[dia].abierto && (
            <View style={styles.horasRow}>
              <TouchableOpacity
                style={styles.horaBtn}
                onPress={() => setPicker({ dia, tipo: "abre" })}
              >
                <Text>Abrir: {formatearHora(horarios[dia].abre)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.horaBtn}
                onPress={() => setPicker({ dia, tipo: "cierra" })}
              >
                <Text>Cerrar: {formatearHora(horarios[dia].cierra)}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={crearBarberia}>
        <Text style={styles.buttonText}>Crear Barbería</Text>
      </TouchableOpacity>

      {picker && (
        <DateTimePicker
          value={horarios[picker.dia][picker.tipo]}
          mode="time"
          is24Hour
          onChange={(_, date) => {
            if (date) {
              setHorarios({
                ...horarios,
                [picker.dia]: {
                  ...horarios[picker.dia],
                  [picker.tipo]: date,
                },
              });
            }
            setPicker(null);
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  diaCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  diaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dia: { fontWeight: "bold" },
  horasRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  horaBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c7d2fe",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1e40af",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
