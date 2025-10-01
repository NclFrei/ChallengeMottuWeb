import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = {
  visible: boolean;
  placa: string;
  modelo: string;
  onChangePlaca: (text: string) => void;
  onChangeModelo: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function EditMotoModal({
  visible,
  placa,
  modelo,
  onChangePlaca,
  onChangeModelo,
  onSave,
  onCancel,
}: Props) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Editar Moto</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
            value={placa}
            onChangeText={onChangePlaca}
            placeholder="Placa"
            placeholderTextColor={theme.placeholder}
          />
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBackground }]}
            value={modelo}
            onChangeText={onChangeModelo}
            placeholder="Modelo"
            placeholderTextColor={theme.placeholder}
          />
          <View style={styles.row}>
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={onSave}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={{ color: "#ef4444" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContent: { width: "90%", borderRadius: 12, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  saveButton: { padding: 10, borderRadius: 6 },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { padding: 10 },
});
