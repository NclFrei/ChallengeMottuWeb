import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

type Area = { id: number; nome: string; descricao?: string };

type Props = {
  areas: Area[];
  onEdit: (area: Area) => void;
  onDelete: (id: number) => void;
};

export default function AreaList({ areas, onEdit, onDelete }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (areas.length === 0)
    return (
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {t("area.noSections")}
      </Text>
    );

  return (
    <>
      {areas.map((area) => {
        const secaoColor = area.nome.includes("Premium")
          ? "#A3F7BF"
          : area.nome.includes("Padrão")
          ? "#B3E5FC"
          : area.nome.includes("Oficina")
          ? "#FFE0B2"
          : "#F8BBD0";

        return (
          <View
            key={area.id}
            style={[
              styles.secaoBox,
              {
                borderLeftColor: secaoColor,
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={[styles.itemTitle, { color: theme.text }]}>
                  {area.nome}
                </Text>
                <Text style={[styles.text, { color: theme.textSecondary }]}>
                  {area.descricao || t("area.noDescription")}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    { backgroundColor: theme.inputBackground },
                  ]}
                  onPress={() => onEdit(area)}
                >
                  <Ionicons
                    name="create-outline"
                    size={20}
                    color={theme.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    { backgroundColor: theme.inputBackground },
                  ]}
                  onPress={() => onDelete(area.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 14, marginBottom: 4 },
  itemTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  secaoBox: {
    borderLeftWidth: 5,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  editButton: { marginLeft: 8, padding: 6, borderRadius: 6 },
  deleteButton: { marginLeft: 8, padding: 6, borderRadius: 6 },
});
