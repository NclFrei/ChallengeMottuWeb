import React from 'react';
import { Feather } from "@expo/vector-icons"
import {
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { style } from './styles';

export default function Login() {
  const navigation = useNavigation<any>(); // <== Adicione isso

  const handleLogin = () => {
    navigation.navigate('Home'); // substitua 'Home' pelo nome da tela/diretório desejado
  };

  return (
    <View style={style.container}>
        <View style={style.boxTop}>
          <View style={style.iconWrapper}>
            <Feather name="home" color="#FFF" size={28} />
          </View>
          <Text style={style.title}>Mottu Challenge</Text>
          <Text style={style.subtitle}>Sistema de Gerenciamento de Pátios</Text>
        </View>
        <View style={style.card}>
            <Text style={style.loginTitle}>Login</Text>
            <Text style={style.loginDesc}>Acesse sua conta para gerenciar o pátio</Text>

            <View style={style.boxMid}>
              <Text style={style.label}>Usuário</Text>
              <TextInput style={style.input} placeholder="Digite seu usuário" />

              <Text style={style.label}>Senha</Text>
              <TextInput style={style.input} placeholder="Digite sua senha" secureTextEntry />
            </View>

            <View style={style.row}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={style.checkbox} />
                  <Text style={style.rowText}>Lembrar-me</Text>
              </View>
              <Text style={style.link}>Esqueceu a senha?</Text>
            </View>

            <TouchableOpacity style={style.button} onPress={handleLogin}>
              <Text style={style.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={style.footer}>
              <Text style={style.footerText}>© 2025 Mottu Challenge. Todos os direitos reservados.</Text>
            </View>
        </View>
    </View>
  );
}
