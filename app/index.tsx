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


export default function LoginScreen() {
  const { login, user, loading } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("Usuário logado:", user); // Logando os dados do usuário após o login
      router.replace("/patioScreen");
    } else {
      console.log("Usuário não está logado ou ainda não foi carregado.");
    }
  }, [user]); 

  const handleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      console.log("Tentando login com:", { email, password }); 
      await login(email, password);
    } catch (error: any) {
      setErrorMessage("Usuário ou senha inválidos"); 
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
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Sistema de Gerenciamento de Pátio de Motos
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.loginTitle, { color: theme.text }]}>Login</Text>
        <Text style={[styles.loginSubtitle, { color: theme.textSecondary }]}>
          Acesse sua conta para gerenciar o pátio de moto
        </Text>

        {errorMessage !== "" && (
          <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
        )}

        <Text style={[styles.label, { color: theme.text }]}>Usuário</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder="Digite seu usuário"
          placeholderTextColor={theme.placeholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: theme.text }]}>Senha</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder="Digite sua senha"
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
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.demoContainer}>
          <Text style={{ color: theme.textSecondary }}>
            Credenciais de demonstração: Usuário: admin | Senha: admin
          </Text>
        </View>

        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ color: theme.textSecondary }}>Não tem conta?</Text>
          <TouchableOpacity onPress={() => router.push("/CadastroScreenUser")}>
            <Text style={{ color: theme.primary, fontWeight: "bold" }}>Criar conta</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.themeToggle}>
          <Text style={{ color: theme.text }}>Tema escuro</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const lightTheme = {
  background: "#F0FDF4",
  card: "#FFFFFF",
  primary: "#10B981",
  text: "#111827",
  textSecondary: "#6B7280",
  inputBackground: "#F9FAFB",
  placeholder: "#9CA3AF",
};

const darkTheme = {
  background: "#1F2937",
  card: "#374151",
  primary: "#34D399",
  text: "#F9FAFB",
  textSecondary: "#D1D5DB",
  inputBackground: "#4B5563",
  placeholder: "#9CA3AF",
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  logo: { fontSize: 50 },
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
});
