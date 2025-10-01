import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/context/AuthContext";
import { ThemeProvider } from "../src/context/ThemeContext"; 

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider> 
            <Stack screenOptions={{ headerShown: false }}>

              <Stack.Screen name="index" options={{ headerShown: false }} />


              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              <Stack.Screen
                name="editUserScreen"
                options={{ headerShown: true, title: "Editar Usuário" }}
              />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
