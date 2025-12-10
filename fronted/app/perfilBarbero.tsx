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
import { useNavigation, useFocusEffect } from "@react-navigation/native"; 
import Header from "../components/header";
import { useTheme } from "./context/ThemeContext";
import { LightTheme, DarkTheme } from "./theme/theme";
import { API_BASE_URL } from "../config/env";

const API_URL = API_BASE_URL;

export default function PerfilBarbero() {
  const navigation = useNavigation();
  const [barbero, setBarbero] = useState<any>(null);
  const [resenas, setResenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);

  const { colors, toggleTheme, theme } = useTheme();

  const obtenerPerfil = async () => {
    setLoading(true); 
    try {
      const token = await getToken();
      if (!token) throw new Error("Token no encontrado");

      const res = await axios.get(`${API_URL}/barbers/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBarbero(res.data);

      setResenas(res.data.resenas ?? []); 
      
      const u = await getUsuario();
      setUsuario(u);

    } catch (error: any) {
      console.log("ERROR:", error?.response?.data ?? error?.message);
      setBarbero(null);
      Alert.alert("Error", "No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      obtenerPerfil();

    }, [])
  );

  const editarPerfil = () => navigation.navigate("editarPerfilBarbero" as never);
  const irInicio = () => navigation.navigate("homeBarbero" as never);

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
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!barbero) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No se encontró información del perfil</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={irInicio}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Configuración</Text>

        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={theme === "light" ? "moon-outline" : "sunny-outline"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* FOTO DE PERFIL */}
        <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
          <View style={styles.avatarContainer}>
            {barbero.fotoPerfil ? (
              <Image source={{ uri: barbero.fotoPerfil }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.border },
                ]}
              >
                <Ionicons name="person" size={50} color={colors.textSecondary} />
              </View>
            )}
          </View>

          <Text style={[styles.nombre, { color: colors.text }]}>
            {barbero.usuario?.nombre || "Nombre Barbero"}
          </Text>

          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {barbero.usuario?.correo || "correo@barbero.com"}
          </Text>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={{ color: "#4A90E2", fontSize: 14 }}>
              {usuario?.barbershopName || "Barbershop"}
            </Text>
          </TouchableOpacity>

          {/* RATING */}
          <View
            style={[
              styles.ratingContainer,
              { borderTopColor: colors.border },
            ]}
          >
            <Text style={[styles.ratingNumber, { color: colors.text }]}>
              {(barbero.rating || 4.8).toFixed(1)}
            </Text>

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

            <Text style={[styles.resenasCount, { color: colors.textSecondary }]}>
              Basado en {resenas.length || 0} reseñas
            </Text>
          </View>
        </View>

        {/* OPINIONES RECIENTES */}
        <View style={styles.opinionesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Opiniones Recientes
          </Text>

          {resenas.slice(0, 3).map((resena, index) => (
            <View
              key={index}
              style={[styles.resenaCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.resenaHeader}>
                <View style={styles.resenaLeft}>
                  {resena.foto ? (
                    <Image
                      source={{ uri: resena.foto }}
                      style={styles.resenaAvatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.resenaAvatar,
                        styles.avatarPlaceholder,
                        { backgroundColor: colors.border },
                      ]}
                    >
                      <Ionicons name="person" size={20} color={colors.textSecondary} />
                    </View>
                  )}

                  <View style={styles.resenaInfo}>
                    <Text style={[styles.resenaName, { color: colors.text }]}>
                      {resena.cliente}
                    </Text>
                    {renderEstrellas(resena.rating)}
                  </View>
                </View>
              </View>

              <Text style={[styles.resenaText, { color: colors.textSecondary }]}>
                {resena.comentario}
              </Text>

              <Text style={[styles.resenaFecha, { color: colors.textSecondary }]}>
                {resena.fecha}
              </Text>
            </View>
          ))}
          
          {resenas.length > 3 && (
            <TouchableOpacity style={styles.verTodasButton}>
              <Text style={{ color: "#4A90E2", fontSize: 15, fontWeight: "600" }}>
                Ver todas las reseñas
              </Text>
            </TouchableOpacity>
          )}

        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTONES INFERIORES */}
      <View
        style={[
          styles.bottomButtons,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.btnInicio, { backgroundColor: colors.border }]}
          onPress={irInicio}
        >
          <Ionicons name="home" size={20} color={colors.textSecondary} />
          <Text style={[styles.btnInicioText, { color: colors.textSecondary }]}>
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnEditar} onPress={editarPerfil}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.btnEditarText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  content: { flex: 1, paddingHorizontal: 20 },
  profileSection: {
    borderRadius: 16,
    padding: 25,
    marginTop: 20,
    alignItems: "center",
  },
  avatarContainer: { marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { justifyContent: "center", alignItems: "center" },
  nombre: { fontSize: 20, fontWeight: "700", marginBottom: 5 },
  email: { fontSize: 14, marginBottom: 10 },
  linkButton: { marginBottom: 20 },
  ratingContainer: {
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    width: "100%",
  },
  ratingNumber: { fontSize: 32, fontWeight: "700", marginBottom: 5 },
  starsRow: { flexDirection: "row", marginBottom: 8 },
  resenasCount: { fontSize: 13 },
  opinionesSection: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  resenaCard: {
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
  resenaLeft: { flexDirection: "row", alignItems: "center" },
  resenaAvatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  resenaInfo: { justifyContent: "center" },
  resenaName: { fontWeight: "700", fontSize: 15, marginBottom: 4 },
  resenaText: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  resenaFecha: { fontSize: 12 },
  verTodasButton: { alignItems: "center", paddingVertical: 12 },
  bottomButtons: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    gap: 10,
  },
  btnInicio: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  btnInicioText: { fontWeight: "600", fontSize: 15 },
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
  btnEditarText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

