import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../app/context/ThemeContext";
import { LightTheme, DarkTheme } from "../app/theme/theme";

interface Props {
  title: string;
  onBack?: () => void;
}

export default function Header({ title, onBack }: Props) {
  const { theme, toggleTheme } = useTheme();
  const colors = theme === "light" ? LightTheme : DarkTheme;

  return (
    <View style={[styles.container, { backgroundColor: colors.header }]}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={colors.icon} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <TouchableOpacity onPress={toggleTheme}>
        <Ionicons
          name={theme === "light" ? "moon" : "sunny"}
          size={24}
          color={colors.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
});
