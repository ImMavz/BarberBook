import React from "react";
import { useState } from "react";
import {View, Text, Image, ScrollView, TouchableOpacity, Modal, StyleSheet} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const CitasAgendadas = () => {
  //Datos temporales
  const navigation = useNavigation<Nav>();
  type RootStackParamList = {
  homeBarbero: undefined;
  citasAgendadas: undefined;
  };

  type Nav = NativeStackNavigationProp<RootStackParamList>;

  // Estado para controlar el modal
  const [modalVisible, setModalVisible] = useState(false);

  // Cita seleccionada
  const [citaSeleccionada, setCitaSeleccionada] = useState<any>(null);

  // Manejar cuando tocan una cita
  const abrirOpciones = (cita: any) => {
    setCitaSeleccionada(cita);
    setModalVisible(true);
  };

  // 👉 Aquí pondrás lógica del backend más adelante
  const cambiarEstadoCita = (nuevoEstado: string) => {
    if (citaSeleccionada) {
      console.log("Actualizar al backend →", citaSeleccionada.id, nuevoEstado);
    }
    // cerrar modal
    setModalVisible(false);
  };

  const citasHoy: {
    id: number;
    nombre: string;
    servicio: string;
    hora: string;
    duracion: string;
    precio: number;
    estado: "Completado" | "En Progreso" | "Pendiente";
    foto: string;
  }[] = [
    {
      id: 1,
      nombre: "Carlos Mendoza",
      servicio: "Corte Fade + Barba",
      hora: "9:00 AM",
      duracion: "45 min",
      precio: 25000,
      estado: "Completado",
      foto: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      nombre: "Miguel Torres",
      servicio: "Corte Clásico",
      hora: "11:30 AM",
      duracion: "30 min",
      precio: 20000,
      estado: "En Progreso",
      foto: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 3,
      nombre: "Roberto Silva",
      servicio: "Corte Moderno + Lavado",
      hora: "2:00 PM",
      duracion: "50 min",
      precio: 30000,
      estado: "Pendiente",
      foto: "https://i.pravatar.cc/150?img=20",
    },
  ];

  // Colores del estado de la cita

  const estadoColor = {
    Completado: "#3ECF8E",
    "En Progreso": "#ECA33A",
    Pendiente: "#C5C7CE",
  };

  const estadoBg = {
    Completado: "rgba(62, 207, 142, 0.15)",
    "En Progreso": "rgba(236, 163, 58, 0.15)",
    Pendiente: "rgba(197, 199, 206, 0.35)",
  };

  const CitaCard = ({
    elemento,
  }: {
    elemento: {
      id: number;
      nombre: string;
      servicio: string;
      hora: string;
      duracion: string;
      precio: number;
      estado: "Completado" | "En Progreso" | "Pendiente";
      foto: string;
    };
  }) => (
    <TouchableOpacity
      onPress={() => abrirOpciones(elemento)}
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 14,
        marginBottom: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        elevation: 3,
      }}
    >
      {/* FOTO */}
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: elemento.foto }}
          style={{ width: 55, height: 55, borderRadius: 30 }}
        />

        {/* INFORMACIÓN */}
        <View style={{ marginLeft: 12, justifyContent: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {elemento.nombre}
          </Text>
          <Text style={{ color: "#777", marginTop: 2 }}>
            {elemento.servicio}
          </Text>

          {/* ESTADO */}
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

      {/* HORARIO Y PRECIO */}
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ color: "#3ECF8E", fontWeight: "700" }}>
          {elemento.hora}
        </Text>
        <Text style={{ color: "#777", marginTop: 4 }}>{elemento.duracion}</Text>

        <Text
          style={{
            marginTop: 10,
            fontWeight: "700",
            fontSize: 15,
          }}
        >
          ${elemento.precio / 1000}k
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      {/* HEADER */}
      <View
        style={{
          padding: 16,
          backgroundColor: "#2B69FF",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", paddingTop: 20 }}
        onPress={() => navigation.navigate("homeBarbero")}
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
          Citas Agendadas
        </Text>
      </TouchableOpacity>
      </View>

      {/* CONTENIDO */}
      <View style={{ padding: 16 }}>
        {/* Encabezado */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Citas de Hoy</Text>
          <Text style={{ color: "#777" }}>19 Sep 2024</Text>
        </View>

        {/* Citas de Hoy */}
        {citasHoy.map((cita) => (
          <CitaCard key={cita.id} elemento={cita} />
        ))}

        {/* ACTIVIDAD RECIENTE */}
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
              Actividad Reciente
            </Text>
            <Ionicons
              name="refresh"
              size={18}
              color="#3ECF8E"
              style={{ marginLeft: 6 }}
            />
          </View>

          {citasHoy.map((cita) => (
            <CitaCard key={`rec-${cita.id}`} elemento={cita} />
          ))}
        </View>

        {/* RESUMEN DEL DÍA */}
        <View
          style={{
            backgroundColor: "#2B69FF",
            padding: 20,
            borderRadius: 16,
            marginTop: 10,
            marginBottom: 30,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
            Resumen del Día
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "space-between",
            }}
          >
            <View style={{ alignItems: "center", width: "50%" }}>
              <Text style={{ color: "#fff", fontSize: 26, fontWeight: "700" }}>
                3
              </Text>
              <Text style={{ color: "#fff" }}>Citas Hoy</Text>
            </View>

            <View style={{ alignItems: "center", width: "50%" }}>
              <Text style={{ color: "#fff", fontSize: 26, fontWeight: "700" }}>
                $73k
              </Text>
              <Text style={{ color: "#fff" }}>Ingresos</Text>
            </View>
          </View>
        </View>
      </View>

      {/* MODAL */}
      {citaSeleccionada && (
        <Modal
          transparent
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}>
            <View style={{
              backgroundColor: "#fff",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
              
              <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 15 }}>
                Opciones de la cita
              </Text>

              {/* COMPLETADA */}
              <TouchableOpacity
                style={modalStyles.btn}
                onPress={() => cambiarEstadoCita("Completado")}
              >
                <Text style={modalStyles.txt}>Completada ✅</Text>
              </TouchableOpacity>

              {/* EN PROGRESO */}
              <TouchableOpacity
                style={modalStyles.btn}
                onPress={() => cambiarEstadoCita("En Progreso")}
              >
                <Text style={modalStyles.txt}>En Progreso ⌛</Text>
              </TouchableOpacity>

              {/* PENDIENTE */}
              <TouchableOpacity
                style={modalStyles.btn}
                onPress={() => cambiarEstadoCita("Pendiente")}
              >
                <Text style={modalStyles.txt}>Pendiente ⏰</Text>
              </TouchableOpacity>

              {/* CANCELAR */}
              <TouchableOpacity
                style={[modalStyles.btn, { backgroundColor: "#eee" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[modalStyles.txt, { color: "#333" }]}>Cancelar ❌</Text>
              </TouchableOpacity>

              {/* Devolevrse */}
              <TouchableOpacity
                style={[modalStyles.btn, { backgroundColor: "#eee" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[modalStyles.txt, { color: "#333" }]}>Devolverse</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const modalStyles = StyleSheet.create({
  btn: {
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f4f4f4",
    marginBottom: 10,
  },
  txt: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default CitasAgendadas;