import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
}

export default function Button({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2D6FF7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  text: {
    color: "#fff",
    fontWeight: "bold"
  }
});
