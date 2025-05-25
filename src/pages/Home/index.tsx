import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import AreaCard from '../../components/AreaCard/AreaCard';
import TabNavigator from '../../components/menu';


export default function Home() {
  const [activeTab, setActiveTab] = useState('visualizacao');
  const [patio, setPatio] = useState<null | {
    nome: string;
    endereco: string;
    capacidade: string;
  }>(null);

  const [areas, setAreas] = useState([
    {
      nome: 'Seção A - Premium',
      descricao: 'Área coberta para motos de alto valor',
      capacidade: 30,
      motos: [
        { modelo: 'Honda CB 500F', placa: 'ABC-1234', dono: 'João Silva', cor: '#ef4444' },
        { modelo: 'Yamaha MT-07', placa: 'DEF-5678', dono: 'Maria Oliveira', cor: '#111827' },
        { modelo: 'Kawasaki Ninja 400', placa: 'GHI-9012', dono: 'Pedro Santos', cor: '#22c55e' },
        { modelo: 'BMW R 1250 GS', placa: 'STU-5678', dono: 'Roberto Almeida', cor: '#3b82f6' },
        { modelo: 'Harley-Davidson Iron 883', placa: 'YZA-3456', dono: 'Marcelo Souza', cor: '#111827' },
      ],
    },
  ]);

  const loadPatio = async () => {
    try {
      const json = await AsyncStorage.getItem('@patio');
      if (json) {
        setPatio(JSON.parse(json));
      }
    } catch (error) {
      console.error('Erro ao carregar pátio:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPatio();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Feather name="home" color="#FFF" size={28} />
        </View>
        <Text style={styles.title}>Gerenciamento de Pátio de Motos</Text>
      </View>

      {/* Menu de Abas */}
      <TabNavigator activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Conteúdo Dinâmico */}
      {activeTab === 'visualizacao' ? (
        patio ? (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconSmall}>
                  <Feather name="home" color="#FFF" size={20} />
                </View>
                <Text style={styles.cardTitle}>{patio.nome}</Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.label}>Endereço</Text>
                <Text style={styles.value}>{patio.endereco}</Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.label}>Capacidade Total</Text>
                <Text style={styles.value}>{patio.capacidade} motos</Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.label}>Ocupação</Text>
                <View style={styles.occupancyRow}>
                  <Text style={styles.value}>15 motos</Text>
                  <Text style={styles.percent}>13%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: '13%' }]} />
                </View>
              </View>
            </View>

            {/* Áreas do Pátio */}
            {areas.map((area, index) => (
              <AreaCard
                key={index}
                nome={area.nome}
                descricao={area.descricao}
                capacidade={area.capacidade}
                motos={area.motos}
              />
            ))}
          </>
        ) : (
          <Text style={styles.value}>Nenhum pátio cadastrado ainda.</Text>
        )
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Formulário de Cadastro</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconWrapper: {
    backgroundColor: '#22c55e',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    gap: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  iconSmall: {
    backgroundColor: '#22c55e',
    padding: 6,
    borderRadius: 8,
  },
  cardInfo: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 10,
  },
  label: {
    fontWeight: '600',
    color: '#65a30d',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  occupancyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percent: {
    color: '#16a34a',
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#d1fae5',
    borderRadius: 4,
    marginTop: 5,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#16a34a',
    borderRadius: 4,
  },
});
