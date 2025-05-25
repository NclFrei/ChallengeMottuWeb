import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Moto = {
  modelo: string;
  placa: string;
  dono: string;
  cor: string;
};

type AreaProps = {
  nome: string;
  descricao: string;
  capacidade: number;
  motos: Moto[];
};

export default function AreaCard({ nome, descricao, capacidade, motos }: AreaProps) {
  const ocupacao = motos.length;
  const percentual = Math.round((ocupacao / capacidade) * 100);

  return (
    <View style={styles.areaCard}>
      <Text style={styles.areaTitle}>{nome}</Text>
      <Text style={styles.areaSubtitle}>{descricao}</Text>

      <View style={styles.occupancyRow}>
        <Feather name="activity" size={14} color="#22c55e" />
        <Text style={styles.occupancyText}>
          Ocupação: {ocupacao}/{capacidade} ({percentual}%)
        </Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentual}%` }]} />
      </View>

      {motos.map((moto, index) => (
        <View key={index} style={styles.motoItem}>
          <View style={[styles.colorDot, { backgroundColor: moto.cor }]} />
          <View>
            <Text style={styles.motoNome}>{moto.modelo}</Text>
            <Text style={styles.motoInfo}>{moto.placa} • {moto.dono}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  areaCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    gap: 10,
  },
  areaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  areaSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 5,
  },
  occupancyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  occupancyText: {
    fontSize: 13,
    color: '#065f46',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0f2f1',
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  motoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  motoNome: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#111827',
  },
  motoInfo: {
    fontSize: 12,
    color: '#6b7280',
  },
});
