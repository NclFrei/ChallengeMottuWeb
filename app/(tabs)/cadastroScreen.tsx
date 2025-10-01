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
import { fetchPatios, createPatio } from "../../src/services/patioService"; // 👈 aqui está certo agora
import { createArea, updateArea, deleteArea } from "../../src/services/areaService";
import { createMoto, updateMoto, deleteMoto } from "../../src/services/motoService";
import { useAuth } from "../../src/context/AuthContext";
import { useTheme } from "../../src/context/ThemeContext"; 
import Header from "../../src/components/Header";
import PatioCard from "../../src/components/PatioCard";
import AreaList from "../../src/components/AreaList";
import MotoList from "../../src/components/MotoList";
import EditAreaModal from "../../src/components/EditAreaModal";
import EditMotoModal from "../../src/components/EditMotoModal";

type Moto = { id: number; placa: string; modelo: string; dono?: string; areaId: number };
type Area = { id: number; nome: string; descricao?: string; motos: Moto[] };
type Endereco = { rua: string; numero: number; cidade: string; estado: string; bairro?: string; cep?: string; complemento?: string };
type Patio = { id: number; nome: string; endereco: Endereco; capacidade: number; areas: Area[] };

export default function CadastroScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [patio, setPatio] = useState<Patio | null>(null);
  const [loading, setLoading] = useState(true);

  // Campos de cadastro do pátio
  const [nome, setNome] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [complemento, setComplemento] = useState("");

  // Campos de cadastro de área/moto
  const [novaSecao, setNovaSecao] = useState("");
  const [novaMotoPlaca, setNovaMotoPlaca] = useState("");
  const [novaMotoModelo, setNovaMotoModelo] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  // Estado para edição
  const [editingMoto, setEditingMoto] = useState<Moto | null>(null);
  const [editingArea, setEditingArea] = useState<Area | null>(null);

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
        console.error("Erro ao carregar pátio:", error);
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
      return Alert.alert("Erro", "Preencha os campos obrigatórios.");
    }

    const payload = {
      nome,
      endereco: {
        rua,
        numero: parseInt(numero) || 0,
        bairro,
        cidade,
        estado,
        cep,
        complemento,
      },
      userId: user.id,
    };

    try {
      const novoPatio = await createPatio(payload, user.token);
      Alert.alert("Sucesso", "Pátio cadastrado com sucesso!");
      setPatio(novoPatio); // agora já carrega o novo pátio
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível cadastrar o pátio.");
    }
  };

  // -------- CRUD DE ÁREA --------
  const handleAddSecao = async () => {
    if (!patio || !user) return;
    if (!novaSecao.trim()) return Alert.alert("Erro", "Digite um nome para a seção.");
    try {
      const area = await createArea(novaSecao, patio.id, user.token);
      setPatio({ ...patio, areas: [...patio.areas, area] });
      setNovaSecao("");
    } catch {
      Alert.alert("Erro", "Não foi possível adicionar a seção.");
    }
  };

  const handleDeleteArea = async (id: number) => {
    if (!user || !patio) return;
    try {
      await deleteArea(id, user.token);
      setPatio({ ...patio, areas: patio.areas.filter((a) => a.id !== id) });
    } catch {
      Alert.alert("Erro", "Não foi possível apagar a área.");
    }
  };

  const handleEditArea = (area: Area) => {
    setEditingArea(area);
    setEditAreaNome(area.nome);
    setEditAreaDesc(area.descricao || "");
  };

  const saveEditArea = async () => {
    if (!patio || !user || !editingArea) return;
    try {
      const updated = await updateArea(editingArea.id, { nome: editAreaNome, descricao: editAreaDesc, patioId: patio.id }, user.token);
      setPatio({ ...patio, areas: patio.areas.map((a) => (a.id === editingArea.id ? updated : a)) });
      setEditingArea(null);
    } catch {
      Alert.alert("Erro", "Não foi possível editar a área.");
    }
  };

  // -------- CRUD DE MOTO --------
  const handleAddMoto = async () => {
    if (!patio || !user || !selectedAreaId) return;
    if (!novaMotoPlaca.trim() || !novaMotoModelo.trim()) return Alert.alert("Erro", "Digite placa e modelo da moto.");
    try {
      const moto = await createMoto(novaMotoPlaca, novaMotoModelo, selectedAreaId, user.token);
      setPatio({
        ...patio,
        areas: patio.areas.map((a) => (a.id === selectedAreaId ? { ...a, motos: [...a.motos, moto] } : a)),
      });
      setNovaMotoPlaca(""); setNovaMotoModelo("");
    } catch {
      Alert.alert("Erro", "Não foi possível adicionar a moto.");
    }
  };

  const handleDeleteMoto = async (id: number) => {
    if (!patio || !user) return;
    try {
      await deleteMoto(id, user.token);
      setPatio({
        ...patio,
        areas: patio.areas.map((a) => ({ ...a, motos: a.motos.filter((m) => m.id !== id) })),
      });
    } catch {
      Alert.alert("Erro", "Não foi possível apagar a moto.");
    }
  };

  const handleEditMoto = (moto: Moto) => {
    setEditingMoto(moto);
    setEditPlaca(moto.placa);
    setEditModelo(moto.modelo);
  };

  const saveEditMoto = async () => {
    if (!patio || !user || !editingMoto) return;
    try {
      const updated = await updateMoto(editingMoto.id, { placa: editPlaca, modelo: editModelo, areaId: editingMoto.areaId }, user.token);
      setPatio({
        ...patio,
        areas: patio.areas.map((a) => ({ ...a, motos: a.motos.map((m) => (m.id === editingMoto.id ? updated : m)) })),
      });
      setEditingMoto(null);
    } catch {
      Alert.alert("Erro", "Não foi possível editar a moto.");
    }
  };

  if (loading) return <View style={styles.center}><Text>Carregando...</Text></View>;

  // --------- SE NÃO TEM PÁTIO: MOSTRA FORM DE CADASTRO ---------
  if (!patio) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Cadastrar Pátio" subtitle="Crie seu primeiro pátio" />

        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="Nome do Pátio" value={nome} onChangeText={setNome} />
        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="Rua" value={rua} onChangeText={setRua} />
        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="Número" value={numero} onChangeText={setNumero} keyboardType="numeric" />
        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="Estado" value={estado} onChangeText={setEstado} />
        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="CEP" value={cep} onChangeText={setCep} />
        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="Complemento" value={complemento} onChangeText={setComplemento} />

        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={handleCadastroPatio}>
          <Text style={styles.addButtonText}>Cadastrar Pátio</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // --------- SE JÁ TEM PÁTIO: MOSTRA GERENCIAMENTO ---------
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Cadastro" subtitle="Gerencie seções e motos" />
      
      <PatioCard
        nome={patio.nome}
        endereco={`${patio.endereco.rua}, ${patio.endereco.numero} - ${patio.endereco.cidade}/${patio.endereco.estado}`}
        capacidade={patio.capacidade}
      />

      {/* ÁREAS */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Seções</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={handleAddSecao}>
            <Text style={styles.addButtonText}>+ Nova</Text>
          </TouchableOpacity>
        </View>
        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="Nome da nova seção" value={novaSecao} onChangeText={setNovaSecao} />
        <AreaList areas={patio.areas} onEdit={handleEditArea} onDelete={handleDeleteArea} />
      </View>

      {/* MOTOS */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Motos</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={handleAddMoto}>
            <Text style={styles.addButtonText}>+ Nova</Text>
          </TouchableOpacity>
        </View>
        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="Placa da moto" value={novaMotoPlaca} onChangeText={setNovaMotoPlaca} />
        <TextInput style={[styles.input, { borderColor: theme.border, color: theme.text }]} placeholder="Modelo da moto" value={novaMotoModelo} onChangeText={setNovaMotoModelo} />
        {patio.areas.length > 0 && (
          <Picker selectedValue={selectedAreaId} onValueChange={(v) => setSelectedAreaId(v)} style={{ marginBottom: 12, color: theme.text }}>
            {patio.areas.map((a) => <Picker.Item key={a.id} label={a.nome} value={a.id} />)}
          </Picker>
        )}
        <MotoList areas={patio.areas} onEdit={handleEditMoto} onDelete={handleDeleteMoto} />
      </View>

      {/* Modais */}
      <EditAreaModal visible={!!editingArea} nome={editAreaNome} descricao={editAreaDesc} onChangeNome={setEditAreaNome} onChangeDescricao={setEditAreaDesc} onSave={saveEditArea} onCancel={() => setEditingArea(null)} />
      <EditMotoModal visible={!!editingMoto} placa={editPlaca} modelo={editModelo} onChangePlaca={setEditPlaca} onChangeModelo={setEditModelo} onSave={saveEditMoto} onCancel={() => setEditingMoto(null)} />
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
