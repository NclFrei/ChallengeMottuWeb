import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

const pt = require("./locales/pt.json");
const es = require("./locales/es.json");

// ✅ tratamento de fallback
const deviceLocale = Localization?.locale ?? "pt-BR";
const language = deviceLocale.toLowerCase().startsWith("es") ? "es" : "pt";

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    lng: language,
    fallbackLng: "pt",
    resources: {
      pt: { translation: pt },
      es: { translation: es },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
