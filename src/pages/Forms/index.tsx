import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,  } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Forms() {
  const [patio, setPatio] = useState<null | { nome: string; endereco: string; capacidade: string }>(null);
  const [form, setForm] = useState({ nome: '', endereco: '', capacidade: '' });
  const [editando, setEditando] = useState(false);


  const handleSalvar = async () => {
    try {
      await AsyncStorage.setItem('@patio', JSON.stringify(form));
      setPatio(form);
      setEditando(false);
      alert('Pátio salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar pátio:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <Feather name="home" color="#FFF" size={20} />
          </View>
          <Text style={styles.cardTitle}>Pátio</Text>
        </View>

        {!patio ? (
          <>
            <Text style={styles.label}>Nome do Pátio</Text>
            <TextInput
              style={styles.input}
              value={form.nome}
              onChangeText={(text) => setForm({ ...form, nome: text })}
            />

            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              value={form.endereco}
              onChangeText={(text) => setForm({ ...form, endereco: text })}
            />

            <Text style={styles.label}>Capacidade Total</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.capacidade}
              onChangeText={(text) => setForm({ ...form, capacidade: text })}
            />

            <TouchableOpacity style={styles.button} onPress={handleSalvar}>
              <Text style={styles.buttonText}>Salvar Pátio</Text>
            </TouchableOpacity>
          </>
        ) : !editando ? (
          <>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Nome:</Text>
              <Text style={styles.infoValue}>{patio.nome}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Endereço:</Text>
              <Text style={styles.infoValue}>{patio.endereco}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Capacidade Total:</Text>
              <Text style={styles.infoValue}>{patio.capacidade} motos</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => {
              setForm(patio);
              setEditando(true);
            }}>
              <Text style={styles.buttonText}>Editar Pátio</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Nome do Pátio</Text>
            <TextInput
              style={styles.input}
              value={form.nome}
              onChangeText={(text) => setForm({ ...form, nome: text })}
            />

            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              value={form.endereco}
              onChangeText={(text) => setForm({ ...form, endereco: text })}
            />

            <Text style={styles.label}>Capacidade Total</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.capacidade}
              onChangeText={(text) => setForm({ ...form, capacidade: text })}
            />

            <TouchableOpacity style={styles.button} onPress={handleSalvar}>
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
