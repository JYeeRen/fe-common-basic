import i18next, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

import common from "./trans/common.json";
import 首页 from "./trans/首页.json";

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
  const resources = formatTranslation({ common, 首页 });
  i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      lng: "zh",
      fallbackLng: "zh",
      ns: ["common", "首页"],
      defaultNS: "common",
      resources: resources,
    });
}

export { useTranslation } from "react-i18next";
