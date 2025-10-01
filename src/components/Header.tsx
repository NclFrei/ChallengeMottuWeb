import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";

type HeaderProps = {
  title: string;
  subtitle?: string;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
};

export default function Header({ title, subtitle, onProfilePress, onNotificationPress }: HeaderProps) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.card }]}>
      <View>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={onNotificationPress}>
          <Ionicons name="notifications-outline" size={22} color={theme.primary} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/editUserScreen")}>
          <Ionicons name="person-circle-outline" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 20, fontWeight: "bold" },
  subtitle: { fontSize: 14 },
  icons: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 12 },
});
