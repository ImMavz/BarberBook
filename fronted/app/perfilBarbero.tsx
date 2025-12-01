import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getToken, getUsuario } from "../utils/authStorage";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://192.168.1.32:3000";

export default function PerfilBarbero() {
  const navigation = useNavigation();
  const [barbero, setBarbero] = useState<any>(null);
  const [resenas, setResenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const obtenerPerfil = async () => {
    try {
      const token = await getToken();
      const usuario = await getUsuario();

      const res = await axios.get(`${API_URL}/barbers/profile/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBarbero(res.data.barbero);
      setResenas(res.data.resenas || []);
    } catch (error: any) {
      console.log("ERROR:", error?.response?.data ?? error?.message ?? error);
      Alert.alert("Error", "No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPerfil();
  }, []);

  const editarPerfil = () => {
    navigation.navigate("EditarPerfilBarbero" as never);
  };

  const irInicio = () => {
    navigation.navigate("HomeBarbero" as never);
  };

  const renderEstrellas = (rating: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={14}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (!barbero) {
    return (
      <View style={styles.loading}>
        <Text>No se encontró información del perfil</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={irInicio}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <TouchableOpacity>
          <Ionicons name="moon-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* FOTO DE PERFIL */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {barbero.foto ? (
              <Image source={{ uri: barbero.foto }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={50} color="#999" />
              </View>
            )}
          </View>

          <Text style={styles.nombre}>{barbero.nombre}</Text>
          <Text style={styles.email}>{barbero.email}</Text>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Donde dieguito</Text>
          </TouchableOpacity>

          {/* RATING */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingNumber}>{barbero.rating || "4.8"}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={18}
                  color="#FFD700"
                  style={{ marginHorizontal: 1 }}
                />
              ))}
            </View>
            <Text style={styles.resenasCount}>
              Basado en {resenas.length || 127} reseñas
            </Text>
          </View>
        </View>

        {/* OPINIONES RECIENTES */}
        <View style={styles.opinionesSection}>
          <Text style={styles.sectionTitle}>Opiniones Recientes</Text>

          {resenas.slice(0, 3).map((resena, index) => (
            <View key={index} style={styles.resenaCard}>
              <View style={styles.resenaHeader}>
                <View style={styles.resenaLeft}>
                  {resena.foto ? (
                    <Image
                      source={{ uri: resena.foto }}
                      style={styles.resenaAvatar}
                    />
                  ) : (
                    <View style={[styles.resenaAvatar, styles.avatarPlaceholder]}>
                      <Ionicons name="person" size={20} color="#999" />
                    </View>
                  )}
                  <View style={styles.resenaInfo}>
                    <Text style={styles.resenaName}>{resena.cliente}</Text>
                    {renderEstrellas(resena.rating)}
                  </View>
                </View>
              </View>

              <Text style={styles.resenaText}>{resena.comentario}</Text>
              <Text style={styles.resenaFecha}>{resena.fecha}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.verTodasButton}>
            <Text style={styles.verTodasText}>Ver todas las reseñas</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTÓN FLOTANTE */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.btnInicio} onPress={irInicio}>
          <Ionicons name="home" size={20} color="#555" />
          <Text style={styles.btnInicioText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnEditar} onPress={editarPerfil}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.btnEditarText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    marginTop: 20,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  nombre: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  linkButton: {
    marginBottom: 20,
  },
  linkText: {
    color: "#4A90E2",
    fontSize: 14,
  },
  ratingContainer: {
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    width: "100%",
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5,
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  resenasCount: {
    fontSize: 13,
    color: "#777",
  },
  opinionesSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  resenaCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  resenaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  resenaLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  resenaAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  resenaInfo: {
    justifyContent: "center",
  },
  resenaName: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
  },
  resenaText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 8,
  },
  resenaFecha: {
    fontSize: 12,
    color: "#999",
  },
  verTodasButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  verTodasText: {
    color: "#4A90E2",
    fontSize: 15,
    fontWeight: "600",
  },
  bottomButtons: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 10,
  },
  btnInicio: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  btnInicioText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 15,
  },
  btnEditar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  btnEditarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F6FA",
  },
});