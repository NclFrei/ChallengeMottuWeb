import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Suas telas
import Login from './src/pages/login';
import Home from './src/pages/Home';
import Forms from './src/pages/Forms'; // importe a tela que será aberta após o login

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Página Inicial' }}
        />
        <Stack.Screen
          name="Forms"
          component={Forms}
          options={{ title: 'Formulário' }} // <- Título da tela
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}