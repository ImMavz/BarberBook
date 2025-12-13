import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/config/env";

export default function AgregarServicioScreen() {
  const [barberias, setBarberias] = useState<any[]>([]);
  const [barberiaId, setBarberiaId] = useState<number | null>(null);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [duracion, setDuracion] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarBarberias();
  }, []);

  const cargarBarberias = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/barbershops/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      setBarberias(await res.json());
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las barberías");
    } finally {
      setLoading(false);
    }
  };

  const guardarServicio = async () => {
    if (!barberiaId || !nombre || !precio || !duracion) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setSaving(true);

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          precio: Number(precio),
          duracion: Number(duracion),
          barbershopId: barberiaId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        const msg = Array.isArray(error.message)
          ? error.message.join("\n")
          : error.message || "Error desconocido";

        Alert.alert("Error", msg);
        return;
      }

      Alert.alert("✅ Éxito", "Servicio agregado correctamente");

      // limpiar formulario
      setNombre("");
      setPrecio("");
      setDuracion("");
      setBarberiaId(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el servicio");
    } finally {
      setSaving(false);
    }
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
      <Text style={styles.title}>Agregar Servicio</Text>

      <Text style={styles.label}>Selecciona una barbería</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={barberiaId}
          onValueChange={(value) => setBarberiaId(value)}
        >
          <Picker.Item label="-- Selecciona una barbería --" value={null} />
          {barberias.map((b) => (
            <Picker.Item key={b.id} label={b.nombre} value={b.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Nombre del servicio</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Corte clásico"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 15000"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />

      <Text style={styles.label}>Duración (minutos)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 30"
        keyboardType="numeric"
        value={duracion}
        onChangeText={setDuracion}
      />

      <TouchableOpacity
        style={[styles.button, saving && { opacity: 0.7 }]}
        onPress={guardarServicio}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Guardando..." : "Guardar Servicio"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1e40af",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
