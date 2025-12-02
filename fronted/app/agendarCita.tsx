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

const API_URL = "http://192.168.80.16:3000"; 

export default function agendarCita() {
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

  const [usuarioLogueado, setUsuarioLogueado] = useState<any>(null);

  // Cargar usuario + datos al iniciar
  useEffect(() => {
    cargarUsuario();
    cargarBarberos();
    cargarServicios();
  }, []);

  const cargarUsuario = async () => {
    const user = await getUsuario();
    setUsuarioLogueado(user);
  };

  const cargarBarberos = async () => {
    try {
      const res = await axios.get(`${API_URL}/barbers`);
      setBarberos(res.data);
    } catch (err) {
      console.log("❌ ERROR /barbers:", err.response?.data);
    }
  };

  const cargarServicios = async () => {
    try {
      const res = await axios.get(`${API_URL}/services`);
      setServicios(res.data);
    } catch (err) {
      console.log("❌ ERROR /services:", err.response?.data);
    }
  };

  // DatePicker
  const onChangeFecha = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const d = String(selectedDate.getDate()).padStart(2, "0");
      setSelectedFecha(`${y}-${m}-${d}`);
    }
  };

  // Calcular hora fin con duración
  const sumarMinutos = (hora: string, minutos: number): string => {
    const [h, m] = hora.split(":").map((n) => parseInt(n));
    const fecha = new Date();
    fecha.setHours(h, m + minutos, 0);
    return fecha.toTimeString().slice(0, 5);
  };

  // Crear la cita
  const crearCita = async () => {
    if (!selectedBarbero || !selectedServicio || !selectedFecha || !horarioSeleccionado) {
      Alert.alert("Faltan datos", "Debes completar todos los campos");
      return;
    }

    const servicio = servicios.find((s) => s.id === selectedServicio);
    const horaFinCalculada = sumarMinutos(horarioSeleccionado, servicio.duracion);

    try {
      const token = await getToken();
      const usuario = await getUsuario(); // ← ID REAL del usuario logeado

      if (!token || !usuario) {
        console.log("⚠️ Usuario no logeado");
        Alert.alert("Error", "Debes iniciar sesión para agendar.");
        return;
      }

      const body = {
        id_barbero: selectedBarbero,
        id_servicio: selectedServicio,
        fecha: selectedFecha,
        horaInicio: horarioSeleccionado,
        horaFin: horaFinCalculada,
      };

      console.log("📤 Enviando cita:", body);

      const res = await axios.post(
        `${API_URL}/appointments`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✔️ Cita creada:", res.data);

      Alert.alert("Cita creada", "Tu cita se agendó con éxito");

    } catch (error: any) {
      console.log("❌ ERROR CREAR CITA:", error.response?.data);
      Alert.alert("Error", "No se pudo crear la cita");
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agendar Cita</Text>

      {/* BARBEROS */}
      <Text style={styles.sectionTitle}>Selecciona un barbero</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {barberos.map((b) => (
          <TouchableOpacity
            key={b.id}
            style={[
              styles.optionBox,
              selectedBarbero === b.id && styles.optionActive,
            ]}
            onPress={() => setSelectedBarbero(b.id)}
          >
            <Ionicons name="person-outline" size={28} color="#555" />
            <Text style={styles.optionText}>
              {b.usuario?.nombre ?? "Barbero"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* SERVICIOS */}
      <Text style={styles.sectionTitle}>Selecciona un servicio</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {servicios.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.optionBox,
              selectedServicio === s.id && styles.optionActive,
            ]}
            onPress={() => setSelectedServicio(s.id)}
          >
            <Ionicons name="cut-outline" size={28} color="#555" />
            <Text style={styles.optionText}>{s.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FECHA */}
      <Text style={styles.sectionTitle}>Selecciona una fecha</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.selectorText}>{selectedFecha || "Elegir fecha"}</Text>
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
      <Text style={styles.sectionTitle}>Selecciona un horario</Text>
      <View style={styles.horariosRow}>
        {horarios.map((h) => (
          <TouchableOpacity
            key={h}
            style={[
              styles.horaBox,
              horarioSeleccionado === h && styles.horaActive,
            ]}
            onPress={() => setHorarioSeleccionado(h)}
          >
            <Text style={styles.horaText}>{h}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* BOTÓN */}
      <TouchableOpacity style={styles.submitBtn} onPress={crearCita}>
        <Text style={styles.submitText}>Agendar cita</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f6f8" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10 },

  optionBox: {
    backgroundColor: "#fff",
    padding: 15,
    marginRight: 12,
    borderRadius: 14,
    alignItems: "center",
    elevation: 3,
    width: 120,
  },
  optionActive: {
    backgroundColor: "#dfe3ff",
    borderWidth: 2,
    borderColor: "#6A5AE0",
  },
  optionText: {
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },

  selector: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  selectorText: { fontSize: 16, color: "#555" },

  horariosRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  horaBox: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    elevation: 3,
  },
  horaActive: {
    backgroundColor: "#dfe3ff",
    borderColor: "#6A5AE0",
    borderWidth: 2,
  },

  horaText: { fontSize: 16, fontWeight: "600" },

  submitBtn: {
    backgroundColor: "#6A5AE0",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});
