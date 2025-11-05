import { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: number;
  nome: string;
  email: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  platform: string;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const platform = Platform.OS;


  const getApiUrl = () => {
  if (Platform.OS === "android") return "http://10.0.2.2:5262/api/v1/auth/login"; 
  if (Platform.OS === "ios") return "http://localhost:5262/api/v1/auth/login";    
  return "http://192.168.0.26:5262/api/v1/auth/login"; 
};


  const checkStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@user");
      console.log("[v0] checkStoredUser - armazenado:", storedUser);

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        console.log("[v0] checkStoredUser - parseado:", parsed);
        setUser(parsed);
      }
    } catch (error) {
      console.log("[v0] Error checking stored user:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const initialize = async () => {

      await AsyncStorage.removeItem("@user");
      console.log("[v0] AsyncStorage limpo!");


      await checkStoredUser();
    };

    initialize();
  }, []);


  const login = async (email: string, password: string) => {
    const url = getApiUrl();
    console.log(`[v0] Tentando login na plataforma ${platform} usando URL: ${url}`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("[v0] Status da resposta:", response.status);
      const text = await response.text();
      console.log("[v0] Texto da resposta:", text);

      if (!response.ok) throw new Error(`Credenciais inválidas: ${text}`);

      const data = JSON.parse(text);
      console.log("[v0] Login data:", data);

      const userData: User = {
        id: data.id,       // lowercase 'id'
        nome: data.nome,   // lowercase 'nome'
        email: data.email, // lowercase 'email'
        token: data.token, // lowercase 'token'
      };
      console.log("[v0] userData criado:", userData);

      setUser(userData);
      await AsyncStorage.setItem("@user", JSON.stringify(userData));
      console.log("[v0] Usuário salvo no AsyncStorage");
    } catch (error: any) {
      console.log("[v0] Network error:", error.message);
      if (error.stack) console.log(error.stack);
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    console.log("[v0] Logging out user");
    setUser(null);
    await AsyncStorage.removeItem("@user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, platform }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
