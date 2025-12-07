import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getToken, getUsuario } from "../utils/authStorage";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://192.168.80.14:3000"; 

export default function EditarPerfilBarbero() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [barbero, setBarbero] = useState<any>(null);
  const [barberId, setBarberId] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const obtenerPerfil = async () => {
    try {
      const token = await getToken();

      const res = await axios.get(`${API_URL}/barbers/me`, { 
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setBarbero(data);
      
      setBarberId(data.id); 
      
      setEmail(data.usuario?.correo || data.email || "");
      setTelefono(data.telefono || "");

    } catch (error: any) {
      console.log("ERROR:", error?.response?.data ?? error?.message ?? error);
      Alert.alert("Error", "No se pudo cargar el perfil para editar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPerfil();
  }, []);

  const confirmar = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "El correo electrónico es requerido");
      return;
    }
    
    if (!barberId) {
        Alert.alert("Error", "ID del barbero no disponible para actualizar");
        return;
    }

    setGuardando(true);

    try {
      const token = await getToken();
      
      const datosActualizar: any = {
        correo: email.trim(),
        telefono: telefono.trim(),
      };

      if (contrasena.trim()) {
        datosActualizar.contrasena = contrasena;
      }

      await axios.put(
        `${API_URL}/barbers/profile/${barberId}`,
        datosActualizar,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Éxito", "Perfil actualizado correctamente", [
        {
          text: "OK",
         
          onPress: () => navigation.goBack(), 
        },
      ]);
      
    } catch (error: any) {
      console.log("ERROR:", error?.response?.data ?? error?.message ?? error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "No se pudo actualizar el perfil"
      );
    } finally {
      setGuardando(false);
    }
  };

  const irInicio = () => {
    navigation.navigate("homeBarbero" as never); 
  };

  const volver = () => {
    navigation.goBack();
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
        <TouchableOpacity onPress={volver}>
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
            {barbero.fotoPerfil ? ( 
              <Image source={{ uri: barbero.fotoPerfil }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={50} color="#999" />
              </View>
            )}
            <TouchableOpacity style={styles.editIcon}>
              <View style={styles.editIconInner}>
                {/* 💡  */}
                <Ionicons name="camera" size={18} color="#fff" /> 
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.nombre}>{barbero.usuario?.nombre || barbero.nombre}</Text>
          <Text style={styles.email}>{email}</Text>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Donde dieguito</Text>
          </TouchableOpacity>
        </View>

        {/* FORMULARIO */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Editar Informacion personal</Text>

          <TextInput
            style={styles.input}
            placeholder="Correo Electronico"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña (dejar vacío si no desea cambiar)"
            placeholderTextColor="#999"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#999"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={[styles.btnConfirmar, guardando && styles.btnDisabled]}
            onPress={confirmar}
            disabled={guardando}
          >
            <Text style={styles.btnText}>
              {guardando ? "Guardando..." : "Confirmar"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ÚLTIMAS RESEÑAS  */}
        <View style={styles.resenasSection}>
          <Text style={styles.resenasLabel}>Última reseña</Text>

          <View style={styles.resenaCard}>
            <View style={styles.resenaHeader}>
              <View style={styles.resenaLeft}>
                <View style={[styles.resenaAvatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={20} color="#999" />
                </View>
                <View style={styles.resenaInfo}>
                  <Text style={styles.resenaName}>Luis Martinez</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name="star"
                        size={14}
                        color="#FFD700"
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.resenaText}>
              ¡Increíble! El mejor barbero de la ciudad. Siempre quedo
              satisfecho con el resultado.
            </Text>
            <Text style={styles.resenaFecha}>Hace 1 semana</Text>
          </View>

          <TouchableOpacity style={styles.verTodasButton}>
            <Text style={styles.verTodasText}>Ver todas las reseñas</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTONES FLOTANTES */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.btnInicio} onPress={irInicio}>
          <Ionicons name="home" size={20} color="#555" />
          <Text style={styles.btnInicioText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnEditar, guardando && styles.btnDisabled]}
          onPress={confirmar}
          disabled={guardando}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.btnEditarText}>
            {guardando ? "Guardando..." : "Guardar Cambios"}
          </Text>
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
    position: "relative",
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
  editIcon: {
    position: "absolute",
    right: -5,
    top: -5,
  },
  editIconInner: {
    backgroundColor: "#4CAF50",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  editIconText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
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
    marginBottom: 5,
  },
  linkText: {
    color: "#4A90E2",
    fontSize: 14,
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  btnConfirmar: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  btnDisabled: {
    backgroundColor: "#9E9E9E",
  },
  resenasSection: {
    marginTop: 20,
  },
  resenasLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 10,
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
  starsRow: {
    flexDirection: "row",
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