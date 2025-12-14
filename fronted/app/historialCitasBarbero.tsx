import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { getToken, getUsuario } from "../utils/authStorage";
import { useTheme } from "./context/ThemeContext";
import { API_BASE_URL } from "../config/env";

const API_URL = API_BASE_URL;

interface Cita {
  id: number;
  fecha: string;
  horaInicio: string;
  cliente: any;
  servicio: any;
  estado: string;
  reviewRating?: number | null;
}

export default function HistorialCitas() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [historialAgrupado, setHistorialAgrupado] = useState<any>({});
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const cargarHistorial = async () => {
    try {
      const usuario = await getUsuario();
      const token = await getToken();

      if (!usuario?.barberoId) return;

      const res = await axios.get(
        `${API_URL}/appointments/barbero/${usuario.barberoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const hoy = new Date();

      const pasadas: Cita[] = res.data.filter((c: Cita) => {
        return new Date(c.fecha) < hoy;
      });

      const agrupado: any = {};
      pasadas.forEach((cita: Cita) => {
        const fecha = new Date(cita.fecha).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        if (!agrupado[fecha]) agrupado[fecha] = [];
        agrupado[fecha].push(cita);
      });

      setHistorialAgrupado(agrupado);
    } catch (err: any) {
      console.log("❌ Error historial:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cambiarEstado = async (citaId: number, estado: string) => {
    try {
      const token = await getToken();
      setLoadingId(citaId);

      await axios.patch(
        `${API_URL}/appointments/${citaId}`,
        { estado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("✅ Estado actualizado", `Cita ${estado}`);
      cargarHistorial();
    } catch (err: any) {
      Alert.alert(
        "❌ Error",
        err.response?.data?.message || "No se pudo cambiar el estado"
      );
    } finally {
      setLoadingId(null);
    }
  };

  const stateColors: any = {
    completado: "#34C759",
    cancelado: "#FF3B30",
    pendiente: "#A5A7AE",
  };

  const CitaCard = ({ cita }: { cita: Cita }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Image
        source={{ uri: cita.cliente?.fotoPerfil || "https://i.pravatar.cc/150" }}
        style={styles.avatar}
      />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={[styles.name, { color: colors.text }]}>
          {cita.cliente?.nombre}
        </Text>

        <Text style={[styles.service, { color: colors.textSecondary }]}>
          {cita.servicio?.nombre}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <View
            style={[
              styles.statusTag,
              { backgroundColor: stateColors[cita.estado] || "#999" },
            ]}
          >
            <Text style={styles.statusText}>{cita.estado}</Text>
          </View>
        </View>

        {/* 🔥 BOTONES DE ACCIÓN */}
        {cita.estado === "pendiente" && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#34C759" }]}
              disabled={loadingId === cita.id}
              onPress={() => cambiarEstado(cita.id, "completado")}
            >
              <Text style={styles.btnText}>Completar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#FF3B30" }]}
              disabled={loadingId === cita.id}
              onPress={() => cambiarEstado(cita.id, "cancelado")}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={[styles.time, { color: "#3B6EF6" }]}>
          {cita.horaInicio}
        </Text>

        <Text style={[styles.price, { color: colors.text }]}>
          ${cita.servicio?.precio} COP
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Historial de Citas
        </Text>

        <Ionicons name="time-outline" size={24} color={colors.text} />
      </View>

      {Object.entries(historialAgrupado).map(([fecha, citas]: any) => {
        const mostrarTodas = expandedDays[fecha];
        const visibles = mostrarTodas ? citas : citas.slice(0, 3);

        return (
          <View key={fecha}>
            <Text style={[styles.dateTitle, { color: colors.text }]}>
              Citas del {fecha}
            </Text>

            {visibles.map((c: Cita) => (
              <CitaCard key={c.id} cita={c} />
            ))}

            {citas.length > 3 && (
              <TouchableOpacity
                onPress={() =>
                  setExpandedDays(p => ({ ...p, [fecha]: !p[fecha] }))
                }
                style={{ alignItems: "center" }}
              >
                <Text style={{ color: "#3B6EF6", fontWeight: "600" }}>
                  {mostrarTodas ? "Mostrar menos ▲" : "Mostrar todas ▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 55,
    paddingBottom: 18,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  dateTitle: { fontSize: 17, fontWeight: "700", margin: 15 },
  card: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatar: { width: 50, height: 50, borderRadius: 50 },
  name: { fontSize: 15, fontWeight: "700" },
  service: { fontSize: 13 },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  actions: {
    flexDirection: "row",
    marginTop: 8,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  time: { fontSize: 15, fontWeight: "700" },
  price: { marginTop: 6, fontSize: 15, fontWeight: "700" },
});
