import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { getToken, getUsuario } from "../utils/authStorage";

const API_URL = "http://192.168.1.32:3000";

export default function ConfirmacionServicio() {
  const [cita, setCita] = useState<any>(null);
  const [servicios, setServicios] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");

  const obtenerCita = async () => {
    try {
      const token = await getToken();
      const usuario = await getUsuario();

      const res = await axios.get(
        `${API_URL}/appointments/last/${usuario.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCita(res.data.cita);
      setServicios(res.data.servicios);
    } catch (error: any) {
      console.log("ERROR:", error?.response?.data ?? error?.message ?? error);
    }
  };

  useEffect(() => {
    obtenerCita();
  }, []);

  const confirmar = async () => {
    Alert.alert("Servicio confirmado", "Gracias por tu confirmación");
  };

  const estrellas = [1, 2, 3, 4, 5];

  if (!cita)
    return (
      <View style={styles.loading}>
        <Text>Cargando información...</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Confirmación de Servicio</Text>

      {/* CHECK */}
      <View style={styles.checkCircle}>
        <Ionicons name="checkmark" size={45} color="#0B9D5A" />
      </View>

      <Text style={styles.title}>¿Recibiste el servicio?</Text>
      <Text style={styles.subtitle}>
        Confirma que recibiste tu cita programada
      </Text>

      {/* TARJETA BARBERÍA */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Ionicons name="cut-outline" size={26} color="#4b4b4b" />
          </View>
          <View>
            <Text style={styles.cardTitle}>{cita.barberia}</Text>
            <Text style={styles.cardSub}>Cita #{cita.id}</Text>
          </View>
        </View>

        <View style={styles.rowInfo}>
          <Text style={styles.label}>Fecha</Text>
          <Text style={styles.value}>{cita.fecha}</Text>
        </View>

        <View style={styles.rowInfo}>
          <Text style={styles.label}>Hora</Text>
          <Text style={styles.value}>{cita.hora}</Text>
        </View>

        <View style={styles.rowInfo}>
          <Text style={styles.label}>Barbero</Text>
          <Text style={styles.value}>{cita.barbero}</Text>
        </View>
      </View>

      {/* SERVICIOS */}
      <Text style={styles.section}>Servicios Recibidos</Text>

      <View style={styles.card}>
        {servicios.map((s) => (
          <View style={styles.serviceRow} key={s.id}>
            <View style={styles.row}>
              <Ionicons name="checkmark-circle" size={22} color="#0B9D5A" />
              <View style={{ marginLeft: 6 }}>
                <Text style={styles.serviceTitle}>{s.nombre}</Text>
                <Text style={styles.serviceSub}>{s.descripcion}</Text>
              </View>
            </View>
            <Text style={styles.servicePrice}>${s.precio}k</Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total Pagado</Text>
          <Text style={styles.totalAmount}>${cita.total}k</Text>
        </View>
      </View>

      {/* CALIFICACIONES */}
      <Text style={styles.section}>Califica tu experiencia</Text>

      <View style={styles.ratingRow}>
        {estrellas.map((e) => (
          <TouchableOpacity key={e} onPress={() => setRating(e)}>
            <Ionicons
              name={e <= rating ? "star" : "star-outline"}
              size={32}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Deja un comentario (opcional)"
        multiline
        value={comentario}
        onChangeText={setComentario}
      />

      {/* BOTÓN */}
      <TouchableOpacity style={styles.btn} onPress={confirmar}>
        <Text style={styles.btnText}>✔ Sí, recibí el servicio</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#F3F6FA", padding: 20 },
  header: { fontSize: 20, fontWeight: "600", marginBottom: 15 },
  checkCircle: {
    alignSelf: "center",
    backgroundColor: "#dff8eb",
    padding: 22,
    borderRadius: 100,
    marginBottom: 15,
  },
  title: { textAlign: "center", fontSize: 22, fontWeight: "700" },
  subtitle: { textAlign: "center", color: "#777", marginBottom: 25 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
  },
  row: { flexDirection: "row", alignItems: "center" },
  rowInfo: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconBox: {
    backgroundColor: "#eaf0ff",
    padding: 14,
    borderRadius: 10,
    marginRight: 12,
  },
  cardTitle: { fontWeight: "700", fontSize: 16 },
  cardSub: { color: "#777" },
  label: { fontWeight: "600", color: "#555" },
  value: { color: "#444" },
  section: { fontSize: 18, fontWeight: "700", marginVertical: 10 },
  serviceRow: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceTitle: { fontWeight: "700" },
  serviceSub: { color: "#777" },
  servicePrice: { fontWeight: "700", fontSize: 16 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  totalText: { fontWeight: "600" },
  totalAmount: { fontWeight: "700", fontSize: 18 },
  ratingRow: { flexDirection: "row", justifyContent: "center", marginTop: 5 },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    minHeight: 90,
    marginTop: 15,
  },
  btn: {
    backgroundColor: "#0B9D5A",
    padding: 16,
    borderRadius: 14,
    marginTop: 25,
  },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
