import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/config/env";

export default function AgregarBarberoScreen() {
  const [barberias, setBarberias] = useState<any[]>([]);
  const [barberos, setBarberos] = useState<any[]>([]);
  const [barberiaId, setBarberiaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<any>(null);
  const [experiencia, setExperiencia] = useState<number>(3);
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const [resBarberias, resBarberos] = await Promise.all([
        fetch(`${API_BASE_URL}/barbershops/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/users/barberos-disponibles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setBarberias(await resBarberias.json());
      setBarberos(await resBarberos.json());
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (barbero: any) => {
    if (!barberiaId) {
      Alert.alert("Error", "Selecciona una barbería primero");
      return;
    }
    setBarberoSeleccionado(barbero);
    setExperiencia(3);
    setDescripcion("");
    setModalVisible(true);
  };

  const asignarBarbero = async () => {
    if (!barberoSeleccionado) return;

    if (!descripcion.trim()) {
      Alert.alert("Error", "La descripción es obligatoria");
      return;
    }

    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/barbers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_usuario: barberoSeleccionado.id,
        id_barberia: barberiaId,
        experiencia,
        descripcion,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      Alert.alert("Error", error.message?.join("\n") || "Error");
      return;
    }

    Alert.alert("✅ Éxito", "Barbero asignado correctamente");
    setModalVisible(false);
    cargarDatos();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Barbero</Text>

      <Text style={styles.label}>Selecciona una barbería</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={barberiaId} onValueChange={setBarberiaId}>
          <Picker.Item label="-- Selecciona una barbería --" value={null} />
          {barberias.map((b) => (
            <Picker.Item key={b.id} label={b.nombre} value={b.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.subtitle}>Barberos disponibles</Text>

      <FlatList
        data={barberos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => abrirModal(item)}
            >
              <Text style={styles.buttonText}>Asignar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ================= MODAL ================= */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Asignar a {barberoSeleccionado?.nombre}
            </Text>

            <Text style={styles.label}>Experiencia (1–5)</Text>
            <Picker
              selectedValue={experiencia}
              onValueChange={setExperiencia}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <Picker.Item key={n} label={`${n}`} value={n} />
              ))}
            </Picker>

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Ej: Especialista en fade y barba"
              multiline
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirm}
                onPress={asignarBarbero}
              >
                <Text style={{ color: "#fff" }}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  label: { fontWeight: "600", marginBottom: 6 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
  },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  card: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#f9fafb",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: { fontSize: 16 },
  button: {
    backgroundColor: "#1e40af",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancel: { padding: 10 },
  confirm: {
    backgroundColor: "#1e40af",
    padding: 10,
    borderRadius: 8,
  },
});
