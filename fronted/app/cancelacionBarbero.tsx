// cancelacionBarbero.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CancelacionBarbero() {
  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} />
        <Text style={styles.headerText}>Gestionar Cita</Text>
      </View>

      {/* CARD DEL CLIENTE */}
      <View style={styles.card}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <View style={styles.avatarPlaceholder} />
          <View>
            <Text style={styles.clientName}>Carlos Mendoza</Text>
            <Text style={styles.status}>Pendiente</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="gray" />
          <Text>Viernes, 15 de Marzo 2024</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color="gray" />
          <Text>2:30 PM - 3:30 PM</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cut-outline" size={18} color="gray" />
          <Text>Corte + Barba</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={18} color="gray" />
          <Text>$25.000</Text>
        </View>
      </View>

      {/* RADIO BUTTONS */}
      <Text style={styles.label}>Motivo de cancelación</Text>

      {[
        "Emergencia personal",
        "Cambio de horario",
        "Enfermedad",
        "Otro motivo",
      ].map((item, index) => (
        <View style={styles.radioRow} key={index}>
          <View style={styles.radio}/>
          <Text>{item}</Text>
        </View>
      ))}

      {/* INPUT */}
      <Text style={styles.label}>Notas adicionales (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Añade cualquier información adicional..."
      />

      {/* NOTIFICACIÓN */}
      <View style={styles.notifyCard}>
        <Ionicons name="notifications-outline" size={20} color="#1C84FF" />
        <Text style={styles.notifyText}>
          Se enviará una notificación al cliente sobre la cancelación de la cita.
        </Text>
      </View>

      {/* BOTONES */}
      <TouchableOpacity style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancelar Cita</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn}>
        <Text style={styles.secondaryText}>Reprogramar en su lugar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6F7",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: "#ddd",
  },
  clientName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  status: {
    color: "#D89D23",
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    height: 55,
    backgroundColor: "white",
    marginBottom: 20,
  },
  notifyCard: {
    backgroundColor: "#E9F2FF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  notifyText: {
    flex: 1,
    color: "#1C84FF",
  },
  cancelBtn: {
    backgroundColor: "#E45250",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
  },
  secondaryBtn: {
    backgroundColor: "#E5E5E5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  secondaryText: {
    fontWeight: "bold",
    color: "#444",
  },
});
