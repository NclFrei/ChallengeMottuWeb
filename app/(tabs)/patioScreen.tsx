import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPatios } from "../../src/services/patioService";
import { useAuth } from "../../src/context/AuthContext";
import Header from "../../src/components/Header";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../src/context/ThemeContext";
import { useRouter } from "expo-router";

type Moto = { id: number; placa: string; modelo: string; dono?: string; areaId: number };
type Area = { id: number; nome: string; patioId: number; motos: Moto[] };
type Endereco = { rua: string; numero: number; bairro: string; cidade: string; estado: string };
type Patio = { id: number; nome: string; endereco: Endereco; userId: number; areas: Area[] };

export default function PatioScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [patios, setPatios] = useState<Patio[]>([]);

  const carregarPatios = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await fetchPatios(user.id, user.token);
      const patiosArray = Array.isArray(data) ? data : [data];
      setPatios(patiosArray);
    } catch (error) {
      console.error("Erro ao carregar pátios:", error);
      setPatios([]); // se der erro, garante vazio
    } finally {
      setLoading(false);
    }
  };

  // 🔄 sempre recarrega ao focar na tela
  useFocusEffect(
    useCallback(() => {
      carregarPatios();

      return () => {
        // cleanup (opcional)
        setPatios([]);
        setLoading(true);
      };
    }, [user])
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Carregando pátios...</Text>
      </View>
    );
  }

  // 🚨 Se não encontrou nenhum pátio
  if (patios.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <Header title="Meus Pátios" subtitle="Gerencie suas áreas e motos" />
        
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            Nenhum pátio encontrado.
          </Text>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push("(tabs)/cadastroScreen")}
          >
            <Text style={styles.addButtonText}>Cadastrar Pátio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="Meus Pátios" subtitle="Gerencie suas áreas e motos" />

      <FlatList
        data={patios}
        keyExtractor={(patio) => patio.id.toString()}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={carregarPatios} />
        }
        renderItem={({ item: patio }) => (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {/* Header do pátio */}
            <Text style={[styles.titulo, { color: theme.text }]}>{patio.nome}</Text>
            <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
              {patio.endereco.rua}, {patio.endereco.numero}, {patio.endereco.cidade} -{" "}
              {patio.endereco.estado}
            </Text>

            {/* Áreas */}
            <Text style={[styles.secaoTitulo, { color: theme.text }]}>
              Seções do Pátio
              <Text style={[styles.secaoCount, { color: theme.primary }]}>
                {" "}
                {patio.areas.length} seções
              </Text>
            </Text>

            {patio.areas.map((area) => {
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
                    styles.cardSecao,
                    {
                      borderLeftColor: secaoColor,
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.headerSecao}>
                    <Text style={[styles.nomeSecao, { color: theme.text }]}>{area.nome}</Text>
                    <Text style={[styles.andar, { color: theme.textSecondary }]}>Térreo</Text>
                  </View>

                  <Text style={[styles.descricao, { color: theme.textSecondary }]}>
                    {area.nome.includes("Premium")
                      ? "Área coberta para motos de alto valor"
                      : "Área principal para motos comuns"}
                  </Text>

                  {/* Motos */}
                  {area.motos.length === 0 ? (
                    <Text style={{ color: theme.textSecondary }}>
                      Nenhuma moto cadastrada nesta área.
                    </Text>
                  ) : (
                    <FlatList
                      data={area.motos}
                      keyExtractor={(item) => item.id.toString()}
                      scrollEnabled={false}
                      renderItem={({ item }) => {
                        const statusColor =
                          item.placa.endsWith("1")
                            ? "#EF4444"
                            : item.placa.endsWith("2")
                            ? "#111"
                            : "#22C55E";

                        return (
                          <View
                            style={[
                              styles.motoBox,
                              { backgroundColor: theme.card, borderColor: theme.border },
                            ]}
                          >
                            <View
                              style={[styles.statusIndicator, { backgroundColor: statusColor }]}
                            />
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.itemTitle, { color: theme.text }]}>
                                {item.modelo}
                              </Text>
                              <Text style={{ color: theme.textSecondary }}>
                                {item.dono || "Sem dono"}
                              </Text>
                              <View style={styles.motoInfo}>
                                <Text
                                  style={[
                                    styles.motoTag,
                                    { backgroundColor: theme.badge, color: theme.text },
                                  ]}
                                >
                                  {item.placa}
                                </Text>
                                <Text
                                  style={[
                                    styles.motoTag,
                                    { backgroundColor: theme.badge, color: theme.text },
                                  ]}
                                >
                                  {area.nome}
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      }}
                    />
                  )}
                </View>
              );
            })}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },

  titulo: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  subtitulo: { fontSize: 14, marginBottom: 12 },

  secaoTitulo: { fontSize: 16, fontWeight: "bold", marginVertical: 12 },
  secaoCount: { fontSize: 12, fontWeight: "600" },

  cardSecao: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  headerSecao: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  nomeSecao: { fontSize: 15, fontWeight: "bold" },
  andar: { fontSize: 12 },
  descricao: { fontSize: 13, marginBottom: 8 },

  itemTitle: { fontSize: 15, fontWeight: "bold" },

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
  motoTag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    fontSize: 12,
  },
  addButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
