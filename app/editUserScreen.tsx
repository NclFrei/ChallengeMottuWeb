import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { fetchUser, updateUser } from "../src/services/userService";
import { useTheme } from "../src/context/ThemeContext";
import { useTranslation } from "react-i18next"; 

export default function EditUserScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation(); 

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const carregarUser = async () => {
      try {
        const data = await fetchUser(user.id, user.token);
        setNome(data.nome);
        setEmail(data.email);
      } catch (error) {
        console.error(error);
        Alert.alert(t("user.errorTitle"), t("user.loadError"));
      } finally {
        setLoading(false);
      }
    };
    carregarUser();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const payload: any = {};
    if (nome) payload.nome = nome;
    if (email) payload.email = email;
    if (password) payload.password = password;

    try {
      await updateUser(user.id, user.token, payload);
      Alert.alert(t("user.successTitle"), t("user.successMessage"));
      setPassword("");
    } catch (error) {
      console.error(error);
      Alert.alert(t("user.errorTitle"), t("user.updateError"));
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>{t("user.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {t("user.editTitle")}
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
        placeholder={t("user.name")}
        placeholderTextColor={theme.placeholder}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder={t("user.email")}
        placeholderTextColor={theme.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder={t("user.newPassword")}
        placeholderTextColor={theme.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleSave}
      >
        <Text style={[styles.buttonText, { color: theme.onPrimary }]}>
          {t("user.save")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { fontWeight: "bold", fontSize: 16 },
});
