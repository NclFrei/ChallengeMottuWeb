import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LanguageContextType = {
  language: "pt" | "es";
  changeLanguage: (lang: "pt" | "es") => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "pt",
  changeLanguage: () => {},
});

export const LanguageProvider = ({ children }: any) => {
  const [language, setLanguage] = useState<"pt" | "es">("pt");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("@language");
      if (stored === "es" || stored === "pt") {
        i18n.changeLanguage(stored);
        setLanguage(stored);
      }
    })();
  }, []);

  const changeLanguage = async (lang: "pt" | "es") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem("@language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
