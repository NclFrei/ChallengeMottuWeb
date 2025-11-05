import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { fetchPatios, createPatio } from "../../src/services/patioService";
import { createArea, updateArea, deleteArea } from "../../src/services/areaService";
import { createMoto, updateMoto, deleteMoto } from "../../src/services/motoService";
import { useAuth } from "../../src/context/AuthContext";
import { useTheme } from "../../src/context/ThemeContext";
import { useTranslation } from "react-i18next";
import Header from "../../src/components/Header";
import PatioCard from "../../src/components/PatioCard";
import AreaList from "../../src/components/AreaList";
import MotoList from "../../src/components/MotoList";
import EditAreaModal from "../../src/components/EditAreaModal";
import EditMotoModal from "../../src/components/EditMotoModal";

export default function CadastroScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [patio, setPatio] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");

  const [novaSecao, setNovaSecao] = useState("");
  const [novaMotoPlaca, setNovaMotoPlaca] = useState("");
  const [novaMotoModelo, setNovaMotoModelo] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState(null);

  const [editingMoto, setEditingMoto] = useState(null);
  const [editingArea, setEditingArea] = useState(null);
  const [editPlaca, setEditPlaca] = useState("");
  const [editModelo, setEditModelo] = useState("");
  const [editAreaNome, setEditAreaNome] = useState("");
  const [editAreaDesc, setEditAreaDesc] = useState("");

  useEffect(() => {
    if (!user) return;
    const carregarPatio = async () => {
      try {
        const data = await fetchPatios(user.id, user.token);
        const patiosArray = Array.isArray(data) ? data : [data];
        if (patiosArray.length > 0) {
          const p = patiosArray[0];
          setPatio(p);
          if (p.areas.length > 0) setSelectedAreaId(p.areas[0].id);
        }
      } catch (error) {
        console.error(error);
        Alert.alert(t("patio.errorTitle"), t("patio.loadError"));
      } finally {
        setLoading(false);
      }
    };
    carregarPatio();
  }, [user]);

  // -------- CADASTRAR PÁTIO --------
  const handleCadastroPatio = async () => {
    if (!user) return;
    if (!nome.trim() || !rua.trim() || !cidade.trim() || !estado.trim()) {
      return Alert.alert(t("patio.errorTitle"), t("patio.fillAll"));
    }

    const payload = {
      nome,
      endereco: { rua, numero: parseInt(numero) || 0, bairro, cidade, estado, cep, complemento },
      userId: user.id,
    };

    try {
      const novoPatio = await createPatio(payload, user.token);
      Alert.alert(t("patio.successTitle"), t("patio.successMessage"));
      setPatio(novoPatio);
    } catch (error) {
      console.error(error);
      Alert.alert(t("patio.errorTitle"), t("patio.createError"));
    }
  };

  // -------- ÁREA --------
  const handleAddSecao = async () => {
    if (!patio || !user) return;
    if (!novaSecao.trim()) return Alert.alert(t("area.errorTitle"), t("area.fillName"));
    try {
      const area = await createArea(novaSecao, patio.id, user.token);
      setPatio({ ...patio, areas: [...patio.areas, area] });
      setNovaSecao("");
    } catch {
      Alert.alert(t("area.errorTitle"), t("area.createError"));
    }
  };

  const handleDeleteArea = async (id) => {
    if (!user || !patio) return;
    try {
      await deleteArea(id, user.token);
      setPatio({ ...patio, areas: patio.areas.filter((a) => a.id !== id) });
    } catch {
      Alert.alert(t("area.errorTitle"), t("area.deleteError"));
    }
  };

  const handleEditArea = (area) => {
    setEditingArea(area);
    setEditAreaNome(area.nome);
    setEditAreaDesc(area.descricao || "");
  };

  const saveEditArea = async () => {
    if (!patio || !user || !editingArea) return;
    try {
      const updated = await updateArea(
        editingArea.id,
        { nome: editAreaNome, descricao: editAreaDesc, patioId: patio.id },
        user.token
      );
      setPatio({
        ...patio,
        areas: patio.areas.map((a) => (a.id === editingArea.id ? updated : a)),
      });
      setEditingArea(null);
    } catch {
      Alert.alert(t("area.errorTitle"), t("area.updateError"));
    }
  };

  // -------- MOTO --------
  const handleAddMoto = async () => {
    if (!patio || !user || !selectedAreaId)
      return Alert.alert(t("moto.errorTitle"), t("moto.fillFields"));
    try {
      const moto = await createMoto(novaMotoPlaca, novaMotoModelo, selectedAreaId, user.token);
      setPatio({
        ...patio,
        areas: patio.areas.map((a) =>
          a.id === selectedAreaId ? { ...a, motos: [...a.motos, moto] } : a
        ),
      });
      setNovaMotoPlaca("");
      setNovaMotoModelo("");
    } catch {
      Alert.alert(t("moto.errorTitle"), t("moto.createError"));
    }
  };

  const handleDeleteMoto = async (id) => {
    if (!patio || !user) return;
    try {
      await deleteMoto(id, user.token);
      setPatio({
        ...patio,
        areas: patio.areas.map((a) => ({
          ...a,
          motos: a.motos.filter((m) => m.id !== id),
        })),
      });
    } catch {
      Alert.alert(t("moto.errorTitle"), t("moto.deleteError"));
    }
  };

  const handleEditMoto = (moto) => {
    setEditingMoto(moto);
    setEditPlaca(moto.placa);
    setEditModelo(moto.modelo);
  };

  const saveEditMoto = async () => {
    if (!patio || !user || !editingMoto) return;
    try {
      const updated = await updateMoto(
        editingMoto.id,
        { placa: editPlaca, modelo: editModelo, areaId: editingMoto.areaId },
        user.token
      );
      setPatio({
        ...patio,
        areas: patio.areas.map((a) => ({
          ...a,
          motos: a.motos.map((m) => (m.id === editingMoto.id ? updated : m)),
        })),
      });
      setEditingMoto(null);
    } catch {
      Alert.alert(t("moto.errorTitle"), t("moto.updateError"));
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <Text>{t("patio.loading")}</Text>
      </View>
    );

  if (!patio) {
    const patioFields = [
      { key: "nome", value: nome, setter: setNome },
      { key: "rua", value: rua, setter: setRua },
      { key: "numero", value: numero, setter: setNumero },
      { key: "bairro", value: bairro, setter: setBairro },
      { key: "cidade", value: cidade, setter: setCidade },
      { key: "estado", value: estado, setter: setEstado },
      { key: "cep", value: cep, setter: setCep },
      { key: "complemento", value: complemento, setter: setComplemento },
    ];

    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title={t("patio.registerPatio")} subtitle={t("patio.createSubtitle")} />
        {patioFields.map(({ key, value, setter }) => (
          <TextInput
            key={key}
            style={[styles.input, { borderColor: theme.border, color: theme.text }]}
            placeholder={t(`patio.${key}`)}
            placeholderTextColor={theme.placeholder}
            value={value}
            onChangeText={setter}
          />
        ))}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handleCadastroPatio}
        >
          <Text style={styles.addButtonText}>{t("patio.registerPatio")}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={t("patio.title")} subtitle={t("patio.subtitle")} />

      <PatioCard
        nome={patio.nome}
        endereco={`${patio.endereco.rua}, ${patio.endereco.numero} - ${patio.endereco.cidade}/${patio.endereco.estado}`}
        capacidade={patio.capacidade}
      />

      {/* ÁREAS */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{t("area.title")}</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={handleAddSecao}
          >
            <Text style={styles.addButtonText}>{t("area.new")}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
          placeholder={t("area.namePlaceholder")}
          value={novaSecao}
          onChangeText={setNovaSecao}
        />
        <AreaList areas={patio.areas} onEdit={handleEditArea} onDelete={handleDeleteArea} />
      </View>

      {/* MOTOS */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{t("moto.title")}</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={handleAddMoto}
          >
            <Text style={styles.addButtonText}>{t("moto.new")}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
          placeholder={t("moto.platePlaceholder")}
          value={novaMotoPlaca}
          onChangeText={setNovaMotoPlaca}
        />
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
          placeholder={t("moto.modelPlaceholder")}
          value={novaMotoModelo}
          onChangeText={setNovaMotoModelo}
        />
        {patio.areas.length > 0 && (
          <Picker
            selectedValue={selectedAreaId}
            onValueChange={(v) => setSelectedAreaId(v)}
            style={{ marginBottom: 12, color: theme.text }}
          >
            {patio.areas.map((a) => (
              <Picker.Item key={a.id} label={a.nome} value={a.id} />
            ))}
          </Picker>
        )}
        <MotoList areas={patio.areas} onEdit={handleEditMoto} onDelete={handleDeleteMoto} />
      </View>

      {/* Modais */}
      <EditAreaModal
        visible={!!editingArea}
        nome={editAreaNome}
        descricao={editAreaDesc}
        onChangeNome={setEditAreaNome}
        onChangeDescricao={setEditAreaDesc}
        onSave={saveEditArea}
        onCancel={() => setEditingArea(null)}
      />
      <EditMotoModal
        visible={!!editingMoto}
        placa={editPlaca}
        modelo={editModelo}
        onChangePlaca={setEditPlaca}
        onChangeModelo={setEditModelo}
        onSave={saveEditMoto}
        onCancel={() => setEditingMoto(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  addButton: { padding: 10, borderRadius: 6, alignItems: "center" },
  addButtonText: { color: "#fff", fontWeight: "bold" },
});
