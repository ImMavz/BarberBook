import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, StyleSheet, Alert,} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { getToken, getUsuario } from "../utils/authStorage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
//const API_URL = "http://192.168.1.32:3000"; Api juanito

const CitasAgendadas = () => {
  const navigation = useNavigation<Nav>();

  // ============================
  // 📌 ESTADOS
  // ============================
  const [citasHoy, setCitasHoy] = useState<Cita[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [barbero, setBarbero] = useState<any>(null);

  // ============================
  // 📌 CARGAR CITAS DEL BARBERO
  // ============================
  const cargarCitas = async (barberoId: number, rango: "hoy" | "mañana" | "semana" | "mes" = "hoy") => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "No hay token guardado");
        return;
      }

      const res = await axios.get(
        `${API_URL}/appointments/barbero/${barberoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 👉 Filtrar según rango pedido
      let filtradas = filtrarPorRango(res.data, rango);

      // 👉 Ordenar por hora
      filtradas = ordenarPorHora(filtradas);

      setCitasHoy(filtradas);

    } catch (err: any) {
      console.log("❌ Error cargando citas:", err.response?.data || err.message);
    }
  };


  useEffect(() => {
    (async () => {
      const usuario = await getUsuario();

      console.log("Usuario desde storage:", usuario);

      if (!usuario || usuario.rol !== "barbero") {
        Alert.alert("Error", "Este usuario no es barbero");
        return;
      }

    if (!usuario.barbershopId) {
      Alert.alert("Error", "Este barbero no está asociado a ninguna barbería");
      return;
    }

    const idBarbero = usuario.barberoId;   // 🔥 correcto
    const idBarberia = usuario.barbershopId;

    setBarbero({
      ...usuario,
      barberoId: idBarbero,
      barberiaId: idBarberia,
    });

    // cargar sus citas
    cargarCitas(idBarbero);

    })();
  }, []);


  // ============================
  // 📌 MODAL: ABRIR OPCIONES
  // ============================
  const abrirOpciones = (cita: any) => {
    setCitaSeleccionada(cita);
    setModalVisible(true);
  };

  // ============================
  // 📌 ACTUALIZAR ESTADO (backend)
  // ============================
  const cambiarEstadoCita = async (nuevoEstado: EstadoCita) => {
    // 🛑 Seguridad: evitar que se llame sin cita seleccionada
    if (!citaSeleccionada) {
      Alert.alert("Error", "No hay una cita seleccionada");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "No se encontró token");
        return;
      }

      // 🔗 Llamada al backend
      await axios.patch(
        `${API_URL}/appointments/${citaSeleccionada.id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔄 Refrescar citas del barbero
      if (barbero?.barberoId) {
        cargarCitas(barbero.barberoId);
      }

      setModalVisible(false);
      Alert.alert("Éxito", "Estado actualizado correctamente");
    } catch (err: any) {
      console.log("❌ Error actualizando estado:", err.response?.data || err.message);
      Alert.alert("Error", "No se pudo cambiar el estado");
    }
  };

  // ======================================================
  // 📌 FILTRAR CITAS POR RANGO DE FECHAS
  // ======================================================
  const filtrarPorRango = (citas: Cita[], rango: "hoy" | "mañana" | "semana" | "mes") => {
    const hoy = new Date();
    const mañana = new Date();
    mañana.setDate(hoy.getDate() + 1);

    const en7dias = new Date();
    en7dias.setDate(hoy.getDate() + 7);

    const en30dias = new Date();
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

        default:
          return false;
      }
    });
  };

  // ======================================================
  // 📌 ORDENAR CITAS POR HORA (próxima primero)
  // ======================================================
  const ordenarPorHora = (citas: Cita[]) => {
    return citas.sort((a, b) => {
      const horaA = new Date(`${a.fecha}T${a.horaInicio}`);
      const horaB = new Date(`${b.fecha}T${b.horaInicio}`);
      return horaA.getTime() - horaB.getTime();
    });
  };


  // ============================
  // 🎨 ESTILOS DE ESTADOS
  // ============================
  const estadoColor = {
    completado: "#3ECF8E",
    "en progreso": "#ECA33A",
    pendiente: "#C5C7CE",
  };

  const estadoBg = {
    completado: "rgba(62, 207, 142, 0.15)",
    "en progreso": "rgba(236, 163, 58, 0.15)",
    pendiente: "rgba(197, 199, 206, 0.35)",
  };

  // ============================
  // 🎨 COMPONENTE TARJETA
  // ============================
  const CitaCard = ({ elemento }: {elemento: Cita}) => (
    <TouchableOpacity
      onPress={() => abrirOpciones(elemento)}
      style={styles.card}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: elemento.cliente?.foto || "https://i.pravatar.cc/150" }}
          style={styles.foto}
        />

        <View style={{ marginLeft: 12, justifyContent: "center" }}>
          <Text style={styles.nombre}>{elemento.cliente?.nombre}</Text>
          <Text style={styles.servicio}>{elemento.servicio?.nombre}</Text>

          <View
            style={{
              backgroundColor: estadoBg[elemento.estado],
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              marginTop: 6,
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                color: estadoColor[elemento.estado],
                fontSize: 12,
                fontWeight: "600",
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
        <Text style={{ marginTop: 10, fontWeight: "700", fontSize: 15 }}>
          ${elemento.servicio?.precio || 0} COP
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("homeBarbero")}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
          <Text style={styles.headerText}>Citas Agendadas</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Citas de Hoy</Text>

        {citasHoy.length === 0 ? (
          <Text style={{ color: "#777" }}>No hay citas hoy.</Text>
        ) : (
          citasHoy.map((cita) => <CitaCard key={cita.id} elemento={cita} />)
        )}
      </View>
    {/*
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <TouchableOpacity onPress={() => cargarCitas(barbero.id, "hoy")}>
        <Text>Hoy</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => cargarCitas(barbero.id, "mañana")}>
        <Text>Mañana</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => cargarCitas(barbero.id, "semana")}>
        <Text>Semana</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => cargarCitas(barbero.id, "mes")}>
        <Text>Mes</Text>
      </TouchableOpacity>
    </View>
    */}

      {/* MODAL */}
      {citaSeleccionada && (
        <Modal transparent animationType="slide" visible={modalVisible}>
          <View style={styles.modalWrap}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Opciones de la cita</Text>

              <TouchableOpacity
                style={modalStyles.btn}
                onPress={() => cambiarEstadoCita("completado")}
              >
                <Text style={modalStyles.txt}>Completada ✅</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={modalStyles.btn}
                onPress={() => cambiarEstadoCita("en progreso")}
              >
                <Text style={modalStyles.txt}>En Progreso ⌛</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={modalStyles.btn}
                onPress={() => cambiarEstadoCita("pendiente")}
              >
                <Text style={modalStyles.txt}>Pendiente ⏰</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.btn, { backgroundColor: "#eee" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[modalStyles.txt, { color: "#333" }]}>
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

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#2B69FF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { flexDirection: "row", alignItems: "center" },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "600", marginLeft: 6 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
  },
  foto: { width: 55, height: 55, borderRadius: 30 },
  nombre: { fontSize: 16, fontWeight: "600" },
  servicio: { color: "#777", marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

  modalWrap: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    backgroundColor: "#f4f4f4",
    marginBottom: 10,
  },
  txt: { fontSize: 15, fontWeight: "600" },
});

export default CitasAgendadas;
