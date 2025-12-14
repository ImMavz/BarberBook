import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../config/env";

export default function SettingsBarberShop() {
  const router = useRouter();

  const [owner, setOwner] = useState<any>(null);
  const [barberias, setBarberias] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [barberos, setBarberos] = useState<any[]>([]);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const resOwner = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ownerData = await resOwner.json();
      setOwner(ownerData);

      const resBarberias = await fetch(`${API_BASE_URL}/barbershops/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const barberiasData = await resBarberias.json();
      setBarberias(barberiasData);

      if (barberiasData.length > 0) {
        const barberiaId = barberiasData[0].id;

        const [resServicios, resBarberos] = await Promise.all([
          fetch(`${API_BASE_URL}/services/barbershop/${barberiaId}`),
          fetch(`${API_BASE_URL}/barbers/barbershop/${barberiaId}`),
        ]);

        setServicios(await resServicios.json());
        setBarberos(await resBarberos.json());
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudieron cargar los datos");
    }
  };

  const eliminarItem = async (url: string, mensaje: string) => {
    Alert.alert("Confirmar", mensaje, [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const token = await AsyncStorage.getItem("token");
          await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          cargarTodo();
        },
      },
    ]);
  };

  const getInitial = (name: string) =>
    name ? name.trim().charAt(0).toUpperCase() : "";

  return (
    <SafeAreaView style={styles.container}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Configuración</Text>
      </View>

      {/* PERFIL */}
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitial(owner?.nombre)}</Text>
        </View>
        <Text style={styles.ownerName}>{owner?.nombre}</Text>
        <Text style={styles.ownerEmail}>{owner?.correo}</Text>
      </View>

      {/* SECCIONES */}
      <FlatList
        data={[]}
        ListHeaderComponent={
          <>
            {/* BARBERÍAS */}
            <Section
              title="Barberías"
              data={barberias}
              renderItem={(item) => (
                <ItemRow
                  label={item.nombre}
                  onDelete={() =>
                    eliminarItem(
                      `${API_BASE_URL}/barbershops/${item.id}`,
                      "¿Eliminar barbería?"
                    )
                  }
                />
              )}
              onAdd={() => router.push("crearBarberia")}
            />

            {/* SERVICIOS */}
            <Section
              title="Servicios"
              data={servicios}
              renderItem={(item) => (
                <ItemRow
                  label={`${item.nombre} ($${item.precio})`}
                  onDelete={() =>
                    eliminarItem(
                      `${API_BASE_URL}/services/${item.id}`,
                      "¿Eliminar servicio?"
                    )
                  }
                />
              )}
              onAdd={() => router.push("agregarServicio")}
            />

            {/* BARBEROS */}
            <Section
              title="Barberos"
              data={barberos}
              renderItem={(item) => (
                <ItemRow
                  label={item.usuario?.nombre}
                  onDelete={() =>
                    eliminarItem(
                      `${API_BASE_URL}/barbers/${item.id}`,
                      "¿Eliminar barbero?"
                    )
                  }
                />
              )}
              onAdd={() => router.push("agregarBarbero")}
            />
          </>
        }
      />
    </SafeAreaView>
  );
}

/* ================= COMPONENTES ================= */

const Section = ({ title, data, renderItem, onAdd }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>

    {data.length === 0 ? (
      <Text style={styles.empty}>No hay registros</Text>
    ) : (
      data.map((item: any) => (
        <View key={item.id}>{renderItem(item)}</View>
      ))
    )}

    <TouchableOpacity style={styles.addButton} onPress={onAdd}>
      <Icon name="add-circle-outline" size={22} color="#1E3A8A" />
      <Text style={styles.addText}>Agregar {title}</Text>
    </TouchableOpacity>
  </View>
);

const ItemRow = ({ label, onDelete }: any) => (
  <View style={styles.row}>
    <Text style={styles.rowText}>{label}</Text>
    <TouchableOpacity onPress={onDelete}>
      <Icon name="trash-outline" size={22} color="#DC2626" />
    </TouchableOpacity>
  </View>
);

/* ================= ESTILOS ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  navbar: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 30,
    alignItems: "center",
  },
  navbarText: { color: "#fff", fontSize: 26, fontWeight: "bold" },

  profileContainer: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1E40AF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  ownerName: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  ownerEmail: { color: "#6B7280" },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 14,
    padding: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  rowText: { fontSize: 16 },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  addText: {
    marginLeft: 6,
    color: "#1E3A8A",
    fontWeight: "600",
  },

  empty: { color: "#6B7280", fontStyle: "italic" },
});
