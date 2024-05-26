import i18next, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import localStorage from "@services/localStorage";
import common from "./trans/common.json";

type Lng = "en" | "zh";
type Entry = Record<Lng, string>;
type Translation = Record<string, Entry>;

type _Resource = Record<
  Lng,
  {
    [ns: string]: {
      [key: string]: string;
    };
  }
>;

function formatTranslation(trans: Record<string, Translation>): Resource {
  const resources: _Resource = {
    en: {},
    zh: {},
  };

  for (const [ns, nsTrans] of Object.entries(trans)) {
    resources.en[ns] = {};
    resources.zh[ns] = {};
    for (const [key, entry] of Object.entries(nsTrans)) {
      const { en, zh } = entry;
      resources.en[ns][key] = en;
      resources.zh[ns][key] = zh;
    }
  }

  return resources;
}

export function init() {
  const resources = formatTranslation({ common });
  i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      debug: true,
      lng: localStorage.getItem("lang") as Lng || "zh",
      fallbackLng: "zh-CN",
      ns: ["common"],
      defaultNS: "common",
      resources: resources,
    });
}

export const t = i18next.t.bind(i18next);
export { useTranslation } from "react-i18next";

export const changeLanguage = i18next.changeLanguage.bind(i18next);
