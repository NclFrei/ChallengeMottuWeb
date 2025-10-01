import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

type ThemeType = typeof lightTheme;

type ThemeContextType = {
  isDark: boolean;
  theme: ThemeType;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Carrega preferencia do AsyncStorage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("@theme");
      if (saved) setIsDark(saved === "dark");
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem("@theme", newTheme ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        theme: isDark ? darkTheme : lightTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
