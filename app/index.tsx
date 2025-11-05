import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { useLanguage } from "../src/context/LanguageContext";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const { login, user, loading } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("Usuário logado:", user);
      router.replace("/patioScreen");
    }
  }, [user]);

  const handleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      console.log("Tentando login com:", { email, password });
      await login(email, password);
    } catch (error: any) {
      setErrorMessage(t("login.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.logoContainer}>
        <Text style={[styles.title, { color: theme.primary }]}>Eco</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>{t("login.subtitle")}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.loginTitle, { color: theme.text }]}>{t("login.title")}</Text>
        <Text style={[styles.loginSubtitle, { color: theme.textSecondary }]}>{t("login.subtitle")}</Text>

        {errorMessage !== "" && (
          <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
        )}

        <Text style={[styles.label, { color: theme.text }]}>{t("login.email")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder={t("login.emailPlaceholder")}
          placeholderTextColor={theme.placeholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: theme.text }]}>{t("login.password")}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder={t("login.passwordPlaceholder")}
          placeholderTextColor={theme.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("login.enter")}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.demoContainer}>
          <Text style={{ color: theme.textSecondary }}>{t("login.demo")}</Text>
        </View>

        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ color: theme.textSecondary }}>{t("login.noAccount")}</Text>
          <TouchableOpacity onPress={() => router.push("/CadastroScreenUser")}>
            <Text style={{ color: theme.primary, fontWeight: "bold" }}>{t("login.createAccount")}</Text>
          </TouchableOpacity>
        </View>

        {/* Tema escuro */}
        <View style={styles.themeToggle}>
          <Text style={{ color: theme.text }}>{t("theme.darkMode")}</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        {/* Seletor de idioma */}
        <View style={styles.langContainer}>
          <TouchableOpacity onPress={() => changeLanguage("pt")}>
            <Text style={{ color: theme.text, marginRight: 10, fontWeight: language === "pt" ? "bold" : "normal" }}>
              🇧🇷 PT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage("es")}>
            <Text style={{ color: theme.text, fontWeight: language === "es" ? "bold" : "normal" }}>🇪🇸 ES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  subtitle: { fontSize: 14, textAlign: "center", marginTop: 5 },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  loginTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  loginSubtitle: { fontSize: 14, marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5, marginTop: 10 },
  input: { borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 10 },
  button: { padding: 14, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  demoContainer: { marginTop: 15, alignItems: "center" },
  themeToggle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
  langContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 },
});
