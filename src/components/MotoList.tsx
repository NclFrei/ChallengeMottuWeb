import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

type Moto = { id: number; placa: string; modelo: string; dono?: string; areaId: number };
type Area = { id: number; nome: string; motos: Moto[] };

type Props = {
  areas: Area[];
  onEdit: (moto: Moto) => void;
  onDelete: (id: number) => void;
};

export default function MotoList({ areas, onEdit, onDelete }: Props) {
  const { theme } = useTheme();

  if (areas.flatMap((a) => a.motos).length === 0) {
    return <Text style={[styles.text, { color: theme.textSecondary }]}>Nenhuma moto cadastrada.</Text>;
  }

  return (
    <>
      {areas.map((secao) =>
        secao.motos.map((moto) => {
          const statusColor =
            moto.placa.endsWith("1") ? "#EF4444" : moto.placa.endsWith("2") ? "#111" : "#22C55E";

          return (
            <View
              key={moto.id}
              style={[
                styles.motoBox,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemTitle, { color: theme.text }]}>{moto.modelo}</Text>
                <Text style={[styles.text, { color: theme.textSecondary }]}>{moto.dono || "Sem dono"}</Text>
                <View style={styles.motoInfo}>
                  <Text style={[styles.motoTag, { backgroundColor: theme.inputBackground, color: theme.text }]}>{moto.placa}</Text>
                  <Text style={[styles.motoTag, { backgroundColor: theme.inputBackground, color: theme.text }]}>{secao.nome}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: theme.inputBackground }]}
                onPress={() => onEdit(moto)}
              >
                <Ionicons name="create-outline" size={20} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: theme.inputBackground }]}
                onPress={() => onDelete(moto.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 14, marginBottom: 4 },
  itemTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  motoBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  statusIndicator: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  motoInfo: { flexDirection: "row", gap: 8, marginTop: 4 },
  motoTag: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, fontSize: 12 },
  editButton: { marginLeft: 8, padding: 6, borderRadius: 6 },
  deleteButton: { marginLeft: 8, padding: 6, borderRadius: 6 },
});
