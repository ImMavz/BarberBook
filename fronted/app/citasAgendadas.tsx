import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { getToken, getUsuario } from "../utils/authStorage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Tema dinámico (Modo oscuro o claro)
import { useTheme } from "./context/ThemeContext";

type EstadoCita = "completado" | "en progreso" | "pendiente";

interface Cita {
  id: number;
  fecha: string;
  horaInicio: string;
  estado: EstadoCita;
  cliente: any;
  servicio: any;
}

type RootStackParamList = {
  homeBarbero: undefined;
  citasAgendadas: undefined;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

const API_URL = "http://192.168.80.14:3000";

const CitasAgendadas = () => {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();

  const [citas, setCitas] = useState<Cita[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [barbero, setBarbero] = useState<any>(null);

  //filtro actual
  const [filtro, setFiltro] = useState<"hoy" | "mañana" | "semana" | "mes">("hoy");

  //títulos dinámicos
  const TITULOS: Record<typeof filtro, string> = {
    hoy: "Citas de Hoy",
    mañana: "Citas de Mañana",
    semana: "Citas de Esta Semana",
    mes: "Citas de Este Mes",
  };

  const cargarCitas = async (
    barberoId: number,
    rango: "hoy" | "mañana" | "semana" | "mes" = "hoy"
  ) => {
    try {
      const token = await getToken();
      const res = await axios.get(
        `${API_URL}/appointments/barbero/${barberoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let filtradas = filtrarPorRango(res.data, rango);
      filtradas = ordenarPorHora(filtradas);

      setCitas(filtradas);
      setFiltro(rango); //Cambia el título
    } catch (err: any) {
      console.log("❌ Error cargando citas:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    (async () => {
      const usuario = await getUsuario();

      if (!usuario || usuario.rol !== "barbero") {
        Alert.alert("Error", "Este usuario no es barbero");
        return;
      }

      if (!usuario.barbershopId) {
        Alert.alert("Error", "Este barbero no está asociado a ninguna barbería");
        return;
      }

      setBarbero({
        ...usuario,
        barberoId: usuario.barberoId,
      });

      cargarCitas(usuario.barberoId, "hoy");
    })();
  }, []);

  // FILTROS
  const filtrarPorRango = (
    citas: Cita[],
    rango: "hoy" | "mañana" | "semana" | "mes"
  ) => {
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);

    const en7dias = new Date(hoy);
    en7dias.setDate(hoy.getDate() + 7);

    const en30dias = new Date(hoy);
    en30dias.setDate(hoy.getDate() + 30);

    return citas.filter((c) => {
      const fechaCita = new Date(c.fecha);

      switch (rango) {
        case "hoy":
          return fechaCita.toDateString() === hoy.toDateString();
        case "mañana":
          return fechaCita.toDateString() === mañana.toDateString();
        case "semana":
          return fechaCita >= hoy && fechaCita <= en7dias;
        case "mes":
          return fechaCita >= hoy && fechaCita <= en30dias;
      }
    });
  };

  const ordenarPorHora = (citas: Cita[]) => {
    return citas.sort((a, b) => {
      const horaA = new Date(`${a.fecha}T${a.horaInicio}`);
      const horaB = new Date(`${b.fecha}T${b.horaInicio}`);
      return horaA.getTime() - horaB.getTime();
    });
  };

  const abrirOpciones = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setModalVisible(true);
  };

  const CitaCard = ({ elemento }: { elemento: Cita }) => {
    const fechaFormato = new Date(elemento.fecha).toLocaleDateString("es-CO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    return (
      <TouchableOpacity
        onPress={() => abrirOpciones(elemento)}
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{ uri: elemento.cliente?.foto || "https://i.pravatar.cc/150" }}
            style={styles.foto}
          />

          <View style={{ marginLeft: 12, justifyContent: "center" }}>
            <Text style={[styles.nombre, { color: colors.text }]}>
              {elemento.cliente?.nombre}
            </Text>
            <Text style={[styles.servicio, { color: colors.textSecondary }]}>
              {elemento.servicio?.nombre}
            </Text>

            {/* ⭐ Mostrar fecha cuando el filtro NO es hoy */}
            {filtro !== "hoy" && (
              <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                {fechaFormato}
              </Text>
            )}

            <View
              style={{
                backgroundColor: estadoBg[elemento.estado],
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                marginTop: 6,
              }}
            >
              <Text
                style={{
                  color: estadoColor[elemento.estado],
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {elemento.estado}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ color: "#3ECF8E", fontWeight: "700" }}>
            {elemento.horaInicio}
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontWeight: "700",
              fontSize: 15,
              color: colors.text,
            }}
          >
            ${elemento.servicio?.precio} COP
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ================================
  // 🎨 Colores de estados
  // ================================

  const estadoColor = {
    completado: "#3ECF8E",
    "en progreso": "#ECA33A",
    pendiente: "#A5A7AE",
  };

  const estadoBg = {
    completado: "rgba(62, 207, 142, 0.15)",
    "en progreso": "rgba(236, 163, 58, 0.15)",
    pendiente: "rgba(197, 199, 206, 0.35)",
  };

  // ================================
  // 📌 RENDER PRINCIPAL
  // ================================

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("homeBarbero")}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.headerText, { color: colors.text }]}>
            Citas Agendadas
          </Text>
        </TouchableOpacity>
      </View>

      {/* TÍTULO CAMBIANTE */}
      <View style={{ padding: 16 }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {TITULOS[filtro]}
        </Text>

        {citas.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>
            No hay citas en este rango.
          </Text>
        ) : (
          citas.map((cita) => <CitaCard key={cita.id} elemento={cita} />)
        )}
      </View>

      {/* FILTROS */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        {["hoy", "mañana", "semana", "mes"].map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => cargarCitas(barbero.barberoId, r as any)}
          >
            <Text style={{ color: colors.text, fontWeight: filtro === r ? "700" : "400" }}>
              {r.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MODAL */}
      {citaSeleccionada && (
        <Modal transparent animationType="slide" visible={modalVisible}>
          <View style={styles.modalWrap}>
            <View
              style={[
                styles.modalBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Opciones de la cita
              </Text>

              <TouchableOpacity
                style={[modalStyles.btn, { backgroundColor: colors.border }]}
                onPress={() => cambiarEstadoCita("completado")}
              >
                <Text style={[modalStyles.txt, { color: colors.text }]}>
                  Completada ✅
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.btn, { backgroundColor: colors.border }]}
                onPress={() => cambiarEstadoCita("en progreso")}
              >
                <Text style={[modalStyles.txt, { color: colors.text }]}>
                  En Progreso ⌛
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.btn, { backgroundColor: colors.border }]}
                onPress={() => cambiarEstadoCita("pendiente")}
              >
                <Text style={[modalStyles.txt, { color: colors.text }]}>
                  Pendiente ⏰
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  modalStyles.btn,
                  { backgroundColor: "#e74c3c22", marginTop: 10 },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[modalStyles.txt, { color: "#e74c3c" }]}>
                  Cancelar ❌
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

// ====================================================== ESTILOS ======================================================

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { flexDirection: "row", alignItems: "center" },
  headerText: { fontSize: 20, fontWeight: "700", marginLeft: 6 },

  card: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  foto: { width: 55, height: 55, borderRadius: 30 },
  nombre: { fontSize: 16, fontWeight: "600" },
  servicio: { marginTop: 2 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  modalWrap: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
});

const modalStyles = StyleSheet.create({
  btn: {
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  txt: { fontSize: 15, fontWeight: "600" },
});

export default CitasAgendadas;
