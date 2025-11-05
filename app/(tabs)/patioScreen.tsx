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
import { useTranslation } from "react-i18next";

type Moto = { id: number; placa: string; modelo: string; dono?: string; areaId: number };
type Area = { id: number; nome: string; patioId: number; motos: Moto[] };
type Endereco = { rua: string; numero: number; bairro: string; cidade: string; estado: string };
type Patio = { id: number; nome: string; endereco: Endereco; userId: number; areas: Area[] };

export default function PatioScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [patios, setPatios] = useState<Patio[]>([]);


  const carregarPatios = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await fetchPatios(user.id, user.token);

      // Se o backend retornar vazio ou 404, apenas mostra a tela "Nenhum pátio"
      if (!data || data.status === 404) {
        setPatios([]);
      } else {
        const patiosArray = Array.isArray(data) ? data : [data];
        setPatios(patiosArray);
      }
    } catch (error: any) {
      // Não exibe o erro no console se for apenas "404"
      if (error.message?.includes("404")) {
        setPatios([]);
      } else {
        console.warn("⚠️ Erro inesperado ao carregar pátios:", error.message || error);
        setPatios([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Atualiza sempre que a tela é focada
  useFocusEffect(
    useCallback(() => {
      carregarPatios();
      return () => {
        setPatios([]);
        setLoading(true);
      };
    }, [user])
  );

  // ⏳ Tela de carregamento
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>{t("patio.loading")}</Text>
      </View>
    );
  }

  // 📭 Nenhum pátio encontrado
  if (patios.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <Header title={t("patio.title")} subtitle={t("patio.subtitle")} />

        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            {t("patio.noPatio")}
          </Text>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push("(tabs)/cadastroScreen")}
          >
            <Text style={styles.addButtonText}>{t("patio.registerPatio")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Lista de pátios
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title={t("patio.title")} subtitle={t("patio.subtitle")} />

      <FlatList
        data={patios}
        keyExtractor={(patio) => patio.id.toString()}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={carregarPatios} />
        }
        renderItem={({ item: patio }) => (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.titulo, { color: theme.text }]}>{patio.nome}</Text>
            <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
              {patio.endereco.rua}, {patio.endereco.numero}, {patio.endereco.cidade} -{" "}
              {patio.endereco.estado}
            </Text>

            <Text style={[styles.secaoTitulo, { color: theme.text }]}>
              {t("patio.section")}
              <Text style={[styles.secaoCount, { color: theme.primary }]}>
                {" "}
                {patio.areas.length} {t("patio.section").toLowerCase()}
              </Text>
            </Text>

            {patio.areas.map((area) => (
              <View
                key={area.id}
                style={[
                  styles.cardSecao,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={styles.headerSecao}>
                  <Text style={[styles.nomeSecao, { color: theme.text }]}>{area.nome}</Text>
                  <Text style={[styles.andar, { color: theme.textSecondary }]}>Térreo</Text>
                </View>

                <Text style={[styles.descricao, { color: theme.textSecondary }]}>
                  {area.motos.length === 0
                    ? t("moto.noMotos")
                    : t("moto.title") + `: ${area.motos.length}`}
                </Text>
              </View>
            ))}
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
  card: { borderRadius: 16, padding: 16, marginBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  titulo: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  subtitulo: { fontSize: 14, marginBottom: 12 },
  secaoTitulo: { fontSize: 16, fontWeight: "bold", marginVertical: 12 },
  secaoCount: { fontSize: 12, fontWeight: "600" },
  cardSecao: { borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1 },
  headerSecao: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  nomeSecao: { fontSize: 15, fontWeight: "bold" },
  andar: { fontSize: 12 },
  descricao: { fontSize: 13, marginBottom: 8 },
  addButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
