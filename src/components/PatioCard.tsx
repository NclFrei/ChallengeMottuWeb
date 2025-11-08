import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

type Props = { nome: string; endereco: string; capacidade: number };

export default function PatioCard({ nome, endereco, capacidade }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation(); 
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="home-outline" size={20} color={theme.primary} />
        <Text style={[styles.cardTitle, { color: theme.text }]}>{nome}</Text>
      </View>

      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {endereco}
      </Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {t("patio.capacity")}: {capacidade}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 8 },
  text: { fontSize: 14, marginBottom: 4 },
});
