import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function reviewmodal({ visible, onClose, onSubmit }) {
  const [barberoStars, setBarberoStars] = useState(0);
  const [barberiaStars, setBarberiaStars] = useState(0);
  const [comentarioBarbero, setComentarioBarbero] = useState("");
  const [comentarioBarberia, setComentarioBarberia] = useState("");

  const renderStars = (value, setValue) =>
    [...Array(5)].map((_, i) => (
      <TouchableOpacity key={i} onPress={() => setValue(i + 1)}>
        <Ionicons
          name={i < value ? "star" : "star-outline"}
          size={32}
          color="#f1c40f"
        />
      </TouchableOpacity>
    ));

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "#00000088", justifyContent: "center" }}>
        <View style={{ backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 12 }}>

          <Text>⭐ Califica al barbero</Text>
          <View style={{ flexDirection: "row" }}>
            {renderStars(barberoStars, setBarberoStars)}
          </View>

          <TextInput
            placeholder="Comentario sobre el barbero"
            value={comentarioBarbero}
            onChangeText={setComentarioBarbero}
            style={{ borderWidth: 1, marginTop: 8, padding: 8 }}
          />

          <Text style={{ marginTop: 12 }}>⭐ Califica la barbería</Text>
          <View style={{ flexDirection: "row" }}>
            {renderStars(barberiaStars, setBarberiaStars)}
          </View>

          <TextInput
            placeholder="Comentario sobre la barbería"
            value={comentarioBarberia}
            onChangeText={setComentarioBarberia}
            style={{ borderWidth: 1, marginTop: 8, padding: 8 }}
          />

          <TouchableOpacity
            onPress={() =>
              onSubmit({
                calificacionBarbero: barberoStars,
                comentarioBarbero,
                calificacionBarberia: barberiaStars,
                comentarioBarberia,
              })
            }
          >
            <Text style={{ marginTop: 14, color: "blue" }}>Enviar reseña</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={{ marginTop: 10, color: "red" }}>Cancelar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}
