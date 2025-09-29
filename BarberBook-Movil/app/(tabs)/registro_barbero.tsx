import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// ✅ Definimos tipos para los departamentos
type DepartamentosType = {
  [key: string]: string[];
};

export default function RegistroBarbero() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [nombrePeluqueria, setNombrePeluqueria] = useState("");
  const [departamento, setDepartamento] = useState<string>("");
  const [municipio, setMunicipio] = useState<string>("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const departamentos: DepartamentosType = {
    "Antioquia": ["Medellín", "Bello", "Itagüí"],
    "Valle del Cauca": ["Cali", "Palmira", "Tuluá", "Pradera"],
    "Caldas": ["Manizales"],
  };

  const handleRegistro = () => {
    console.log({
      nombre,
      apellido,
      cedula,
      nombrePeluqueria,
      departamento,
      municipio,
      direccion,
      correo,
      contrasena,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>✂️</Text>
        <Text style={styles.titulo}>BarberBook</Text>
        <Text style={styles.subtitulo}>Agenda tus cortes</Text>

        <View style={styles.form}>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Apellido"
              value={apellido}
              onChangeText={setApellido}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Cédula"
            keyboardType="numeric"
            value={cedula}
            onChangeText={setCedula}
          />

          <TextInput
            style={styles.input}
            placeholder="Nombre de Peluquería"
            value={nombrePeluqueria}
            onChangeText={setNombrePeluqueria}
          />

          {/* Departamento */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={departamento}
              onValueChange={(value: string) => {
                setDepartamento(value);
                setMunicipio(""); // Reiniciar municipio
              }}
            >
              <Picker.Item label="Seleccione un departamento" value="" />
              {Object.keys(departamentos).map((dep) => (
                <Picker.Item key={dep} label={dep} value={dep} />
              ))}
            </Picker>
          </View>

          {/* Municipio */}
          {departamento !== "" && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={municipio}
                onValueChange={(mun: string) => setMunicipio(mun)}
              >
                <Picker.Item label="Seleccione un municipio" value="" />
                {departamentos[departamento].map((mun) => (
                  <Picker.Item key={mun} label={mun} value={mun} />
                ))}
              </Picker>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={direccion}
            onChangeText={setDireccion}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            keyboardType="email-address"
            value={correo}
            onChangeText={setCorreo}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
          />

          <TouchableOpacity style={styles.boton} onPress={handleRegistro}>
            <Text style={styles.botonTexto}>Registrarse</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            ¿Ya tienes una cuenta?{" "}
            <Text style={styles.link}>¡Inicia sesión!</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#f5f6fa",
  },
  logo: {
    fontSize: 40,
    textAlign: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    color: "#7f8c8d",
    marginBottom: 20,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdde1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#dcdde1",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  boton: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  botonTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
