import React, { useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ConfiguracionBarberia() {
  const [modalServicio, setModalServicio] = useState(false);
  const [modalBarbero, setModalBarbero] = useState(false);
  const [modalDireccion, setModalDireccion] = useState(false);
  const [modalHorario, setModalHorario] = useState(false);

  const [mismoHorario, setMismoHorario] = useState(false);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Título */}
      <Text style={{ fontSize: 20, fontWeight: "700", textAlign: "center", marginVertical: 10 }}>
        Configuración de barbería
      </Text>

      {/* --- Servicios --- */}
      <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 20 }}>Servicios</Text>

      <View style={{ marginTop: 10 }}>
        <View style={{ backgroundColor: "#f8f8f8", borderRadius: 10, padding: 10, marginVertical: 5 }}>
          <Text style={{ fontWeight: "600" }}>Corte de Cabello</Text>
          <Text style={{ color: "#666" }}>Corte clásico masculino</Text>
          <Text style={{ fontWeight: "700", marginTop: 5 }}>$20k</Text>
        </View>

        <View style={{ backgroundColor: "#f8f8f8", borderRadius: 10, padding: 10, marginVertical: 5 }}>
          <Text style={{ fontWeight: "600" }}>Arreglo de Barba</Text>
          <Text style={{ color: "#666" }}>Recorte y perfilado</Text>
          <Text style={{ fontWeight: "700", marginTop: 5 }}>$10k</Text>
        </View>
      </View>

      <TouchableOpacity
        style={{ backgroundColor: "#2ecc71", padding: 10, borderRadius: 10, marginTop: 10 }}
        onPress={() => setModalServicio(true)}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Agregar Servicio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: "#e74c3c", padding: 10, borderRadius: 10, marginTop: 10 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Eliminar Servicio</Text>
      </TouchableOpacity>

      {/* --- Horarios de atención --- */}
      <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 30 }}>Horarios de Atención</Text>
      <Text style={{ color: "#444", marginVertical: 5 }}>Lunes a Viernes: 9:00 AM - 7:00 PM</Text>
      <Text style={{ color: "#444" }}>Sábados: 10:00 AM - 5:00 PM</Text>

      <TouchableOpacity
        style={{ backgroundColor: "#3498db", padding: 10, borderRadius: 10, marginTop: 10 }}
        onPress={() => setModalHorario(true)}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Editar Horarios</Text>
      </TouchableOpacity>

      {/* --- Equipo de trabajo --- */}
      <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 30 }}>Equipo de Trabajo</Text>
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <View>
            <Text style={{ fontWeight: "600" }}>Kevin</Text>
            <Text style={{ color: "#666" }}>Dueño y Estilista</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={{ backgroundColor: "#2ecc71", padding: 10, borderRadius: 10, marginTop: 10 }}
        onPress={() => setModalBarbero(true)}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Agregar barbero</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: "#e74c3c", padding: 10, borderRadius: 10, marginTop: 10 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Eliminar barbero</Text>
      </TouchableOpacity>

      {/* --- Foto de la barbería --- */}
      <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 30 }}>Foto de la Barbería</Text>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1609692814858-f3ee76667b17" }}
        style={{ width: "100%", height: 150, borderRadius: 12, marginVertical: 10 }}
      />

      {/* --- Dirección --- */}
      <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 20 }}>Dirección</Text>
      <Text style={{ color: "#444", marginTop: 5 }}>123 Calle Principal, Ciudad</Text>

      <TouchableOpacity
        style={{ backgroundColor: "#3498db", padding: 10, borderRadius: 10, marginTop: 10 }}
        onPress={() => setModalDireccion(true)}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Editar dirección</Text>
      </TouchableOpacity>

      {/* --- Confirmar ajustes --- */}
      <TouchableOpacity
        style={{ backgroundColor: "#2980b9", padding: 12, borderRadius: 10, marginTop: 30 }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Confirmar ajustes</Text>
      </TouchableOpacity>

      {/* MODALES */}

      {/* Agregar Servicio */}
      <Modal visible={modalServicio} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Servicio</Text>
            <TextInput style={styles.input} placeholder="Nombre del servicio" />
            <TextInput style={styles.input} placeholder="Precio del servicio" keyboardType="numeric" />
            <TouchableOpacity
              style={styles.btnConfirm}
              onPress={() => setModalServicio(false)}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Agregar Barbero */}
      <Modal visible={modalBarbero} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Barbero</Text>
            <TextInput style={styles.input} placeholder="Nombre" />
            <TextInput style={styles.input} placeholder="Apellido" />
            <TextInput style={styles.input} placeholder="Correo electrónico" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry />
            <TouchableOpacity
              style={styles.btnConfirm}
              onPress={() => setModalBarbero(false)}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Editar Dirección */}
      <Modal visible={modalDireccion} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Dirección</Text>
            <TextInput style={styles.input} placeholder="Nueva dirección" />
            <TouchableOpacity
              style={styles.btnConfirm}
              onPress={() => setModalDireccion(false)}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Editar Horario */}
      <Modal visible={modalHorario} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Horario</Text>
            <Text style={{ marginBottom: 10 }}>Selecciona los días de trabajo:</Text>
            <Text style={{ color: "#666" }}>Lunes, Martes, Miércoles, Jueves, Viernes</Text>

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
              <Text style={{ flex: 1 }}>¿Mismo horario para todos?</Text>
              <Switch value={mismoHorario} onValueChange={setMismoHorario} />
            </View>

            <TextInput style={styles.input} placeholder="Hora de inicio (ej. 9:00 AM)" />
            <TextInput style={styles.input} placeholder="Hora de cierre (ej. 7:00 PM)" />

            <TouchableOpacity
              style={styles.btnConfirm}
              onPress={() => setModalHorario(false)}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  btnConfirm: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});
