import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getToken } from "../utils/authStorage";
import { useTheme } from "./context/ThemeContext";
import { API_BASE_URL } from "../config/env";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ReviewModal from "../components/reviewmodal";

// ================================
// TIPOS
// ================================
type RootStackParamList = {
  homeCliente: undefined;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ================================
// PANTALLA
// ================================
export default function HistorialCliente() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();

  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<any>(null);

  useEffect(() => {
    cargarHistorial();
  }, []);

  // ================================
  // Cargar citas pasadas
  // ================================
  const cargarHistorial = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API_BASE_URL}/appointments/cliente`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ahora = new Date();

      const pasadas = res.data.filter((c: any) => {
        const fechaHora = new Date(`${c.fecha}T${c.horaFin}`);
        return fechaHora < ahora && c.estado === "completado";
      });

      pasadas.sort((a: any, b: any) => {
        const f1 = new Date(`${a.fecha}T${a.horaInicio}`);
        const f2 = new Date(`${b.fecha}T${b.horaInicio}`);
        return f2.getTime() - f1.getTime();
      });

      setCitas(pasadas);
    } catch (err) {
      console.log("❌ Error cargando historial:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Enviar reseña
  // ================================
  const enviarReseña = async (data: any) => {
    try {
      const token = await getToken();

      await axios.post(
        `${API_BASE_URL}/reviews`,
        {
          citaId: citaSeleccionada.id,
          barberoId: citaSeleccionada.barbero.id,
          barberiaId: citaSeleccionada.barbero.barberia.id,
          calificacionBarbero: data.calificacionBarbero,
          comentarioBarbero: data.comentarioBarbero,
          calificacionBarberia: data.calificacionBarberia,
          comentarioBarberia: data.comentarioBarberia,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      Alert.alert("Gracias", "Reseña enviada correctamente");
      setModalVisible(false);
      setCitaSeleccionada(null);
    } catch (err: any) {
        let mensaje = "No se pudo enviar la reseña";

        if (err?.response?.data?.message) {
          mensaje = Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message;
        }

        Alert.alert("Error", mensaje);
      }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ================================
  // RENDER
  // ================================
  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>
            Historial de citas
          </Text>
        </View>

        {loading ? (
          <Text style={{ color: colors.textSecondary }}>Cargando...</Text>
        ) : citas.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>
            Aún no tienes citas anteriores
          </Text>
        ) : (
          citas.map((cita, index) => (
            <View
              key={index}
              style={[styles.card, { backgroundColor: colors.card }]}
            >
              <View style={styles.row}>
                <Ionicons name="cut-outline" size={24} color={colors.text} />
                <Text style={[styles.barberia, { color: colors.text }]}>
                  {cita.barbero?.barberia?.nombre}
                </Text>
              </View>

              <Text style={[styles.text, { color: colors.textSecondary }]}>
                Barbero: {cita.barbero?.usuario?.nombre}
              </Text>

              <Text style={[styles.text, { color: colors.textSecondary }]}>
                Servicio: {cita.servicio?.nombre}
              </Text>

              <Text style={[styles.text, { color: colors.textSecondary }]}>
                Fecha: {formatearFecha(cita.fecha)}
              </Text>

              <Text style={[styles.text, { color: colors.textSecondary }]}>
                Hora: {cita.horaInicio} - {cita.horaFin}
              </Text>

              {/* BOTÓN RESEÑA */}
              <TouchableOpacity
                style={styles.reviewBtn}
                onPress={() => {
                  setCitaSeleccionada(cita);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.reviewText}>Dejar reseña</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* MODAL */}
      <ReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={enviarReseña}
      />
    </>
  );
}

// ================================
// STYLES
// ================================
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 15,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  barberia: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  text: {
    fontSize: 13,
    marginTop: 2,
  },
  reviewBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  reviewText: {
    color: "#2D6FF7",
    fontWeight: "600",
  },
});
