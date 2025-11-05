import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { useTranslation } from "react-i18next"; 

const API_URL = "http://10.0.2.2:5262/api/v1/Auth/Cadastro";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();
  const { t } = useTranslation(); 

  const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t("register.errorTitle"), t("register.fillAll"));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        nome,
        email,
        password,
      });

      console.log("Cadastro ok:", response.data);
      Alert.alert(t("register.successTitle"), t("register.successMessage"));
      router.replace("/");
    } catch (error: any) {
      console.error("Erro no cadastro:", error.response?.data || error.message);
      Alert.alert(t("register.errorTitle"), t("register.errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {t("register.title")}
      </Text>

      <Text style={[styles.label, { color: theme.text }]}>
        {t("register.name")}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder={t("register.namePlaceholder")}
        placeholderTextColor={theme.placeholder}
        value={nome}
        onChangeText={setNome}
      />

      <Text style={[styles.label, { color: theme.text }]}>
        {t("register.email")}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder={t("register.emailPlaceholder")}
        placeholderTextColor={theme.placeholder}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={[styles.label, { color: theme.text }]}>
        {t("register.password")}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder={t("register.passwordPlaceholder")}
        placeholderTextColor={theme.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleCadastro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.onPrimary} />
        ) : (
          <Text style={[styles.buttonText, { color: theme.onPrimary }]}>
            {t("register.button")}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={[styles.link, { color: theme.primary }]}>
          {t("register.alreadyAccount")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 14, marginTop: 10, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 20, textAlign: "center" },
});
