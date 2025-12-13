import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getToken, getUsuario } from "../utils/authStorage";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router"; // Import router
import { useTheme } from "./context/ThemeContext";
import { API_BASE_URL } from "../config/env";

const API_URL = API_BASE_URL;

export default function AgendarCita() {
  const route = useRoute();
  const router = useRouter(); // Initialize router
  const { barberiaId } = route.params as { barberiaId: number };

  const { colors } = useTheme();

  const [barberos, setBarberos] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [selectedBarbero, setSelectedBarbero] = useState<number | null>(null);
  const [selectedServicio, setSelectedServicio] = useState<number | null>(null);

  const [selectedFecha, setSelectedFecha] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const [horarioSeleccionado, setHorarioSeleccionado] = useState<string | null>(
    null
  );

  const horarios = ["10:00", "11:00", "14:00", "15:00", "16:00"];

  // Cargar datos iniciales
  useEffect(() => {
    cargarBarberos();
    cargarServicios();
  }, []);

  const cargarBarberos = async () => {
    try {
      const res = await axios.get(`${API_URL}/barbers/barbershop/${barberiaId}`);
      setBarberos(res.data);
    } catch (err: any) {
      console.log("❌ ERROR /barbers:", err.response?.data);
    }
  };

  const cargarServicios = async () => {
    try {
      const res = await axios.get(`${API_URL}/services/barbershop/${barberiaId}`);
      setServicios(res.data);
    } catch (err: any) {
      console.log("❌ ERROR /services:", err.response?.data);
    }
  };

  // ───────────────────────────────────────────────
  // 📌 Corregido: DatePicker con formato YYYY-MM-DD
  // ───────────────────────────────────────────────
  const onChangeFecha = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const d = String(selectedDate.getDate()).padStart(2, "0");
      setSelectedFecha(`${y}-${m}-${d}`);
    }
  };

  // ───────────────────────────────────────────────
  // ⏱ Función corregida: SIEMPRE devuelve HH:mm:ss
  // ───────────────────────────────────────────────
  const sumarMinutos = (hora: string, minutos: number): string => {
    const [h, m] = hora.split(":").map(Number);
    const fecha = new Date(2000, 0, 1, h, m + minutos, 0);
    const hh = String(fecha.getHours()).padStart(2, "0");
    const mm = String(fecha.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}:00`; // 🔥 formato estandarizado
  };

  // ───────────────────────────────────────────────
  // 🎯 CREAR LA CITA
  // ───────────────────────────────────────────────
  const crearCita = async () => {
    if (!selectedBarbero || !selectedServicio || !selectedFecha || !horarioSeleccionado) {
      Alert.alert("Faltan datos", "Debes completar todos los campos");
      return;
    }

    const servicio = servicios.find((s) => s.id === selectedServicio);
    const horaFinCalculada = sumarMinutos(horarioSeleccionado, servicio.duracion);

    try {
      const token = await getToken();
      const usuario = await getUsuario();

      if (!token || !usuario) {
        Alert.alert("Error", "Debes iniciar sesión para agendar.");
        return;
      }

      const body = {
        id_barbero: selectedBarbero,
        id_servicio: selectedServicio,
        fecha: selectedFecha,                   // formato correcto
        horaInicio: horarioSeleccionado + ":00", // 🔥 ahora con segundos
        horaFin: horaFinCalculada,              // 🔥 HH:mm:ss
      };

      console.log("📤 Enviando cita:", body);

      const res = await axios.post(`${API_URL}/appointments`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ALERTA DE ÉXITO Y REDIRECCIÓN AL PAGO
      Alert.alert(
        "Cita Agendada",
        "Tu cita se ha creado exitosamente. Ahora selecciona tu método de pago.",
        [
          {
            text: "Ir a Pagar",
            onPress: () => {
              router.push({
                pathname: "/metodoPago",
                params: {
                  appointmentId: res.data.id,
                  total: servicio.precio, // Precio del servicio
                  barberId: selectedBarbero,
                  serviceName: servicio.nombre,
                },
              });
            },
          },
        ]
      );

    } catch (error: any) {
      console.log("❌ ERROR CREAR CITA:", error.response?.data);
      Alert.alert("Error", "No se pudo crear la cita");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Agendar Cita</Text>

      {/* BARBEROS */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Selecciona un barbero
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {barberos.map((b) => (
          <TouchableOpacity
            key={b.id}
            style={[
              styles.optionBox,
              { backgroundColor: colors.card },
              selectedBarbero === b.id && {
                backgroundColor: colors.primary + "33",
                borderColor: colors.primary,
                borderWidth: 2,
              },
            ]}
            onPress={() => setSelectedBarbero(b.id)}
          >
            <Ionicons name="person-outline" size={28} color={colors.text} />
            <Text style={[styles.optionText, { color: colors.text }]}>
              {b.usuario?.nombre ?? "Barbero"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* SERVICIOS */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Selecciona un servicio
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {servicios.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.optionBox,
              { backgroundColor: colors.card },
              selectedServicio === s.id && {
                backgroundColor: colors.primary + "33",
                borderColor: colors.primary,
                borderWidth: 2,
              },
            ]}
            onPress={() => setSelectedServicio(s.id)}
          >
            <Ionicons name="cut-outline" size={28} color={colors.text} />
            <Text style={[styles.optionText, { color: colors.text }]}>{s.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FECHA */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Selecciona una fecha
      </Text>

      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.card }]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.selectorText, { color: colors.text }]}>
          {selectedFecha || "Elegir fecha"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedFecha ? new Date(selectedFecha) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeFecha}
        />
      )}

      {/* HORARIOS */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Selecciona un horario
      </Text>

      <View style={styles.horariosRow}>
        {horarios.map((h) => (
          <TouchableOpacity
            key={h}
            style={[
              styles.horaBox,
              { backgroundColor: colors.card },
              horarioSeleccionado === h && {
                backgroundColor: colors.primary + "33",
                borderColor: colors.primary,
                borderWidth: 2,
              },
            ]}
            onPress={() => setHorarioSeleccionado(h)}
          >
            <Text style={[styles.horaText, { color: colors.text }]}>{h}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* BOTÓN */}
      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: colors.primary }]}
        onPress={crearCita}
      >
        <Text style={styles.submitText}>Agendar cita</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10 },

  optionBox: {
    padding: 15,
    marginRight: 12,
    borderRadius: 14,
    alignItems: "center",
    width: 120,
  },
  optionText: {
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },

  selector: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  selectorText: { fontSize: 16 },

  horariosRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  horaBox: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  horaText: { fontSize: 16, fontWeight: "600" },

  submitBtn: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});
