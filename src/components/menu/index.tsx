import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './styles';

type MenuProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

type RootStackParamList = {
  Home: undefined;
  Forms: undefined;
};

export default function TabNavigator({ activeTab, setActiveTab }: MenuProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'visualizacao' && styles.activeTab,
        ]}
        onPress={() => setActiveTab('visualizacao')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'visualizacao' && styles.activeTabText,
          ]}
        >
          Visualização do Pátio
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'cadastro' && styles.activeTab,
        ]}
        onPress={() => navigation.navigate('Forms')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'cadastro' && styles.activeTabText,
          ]}
        >
          Cadastro
        </Text>
      </TouchableOpacity>
    </View>
  );
}
