import { ConfigProvider, ConfigProviderProps } from "antd";
import zh_CN from 'antd/locale/zh_CN';
import en_US from 'antd/locale/en_US';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import appService from "@services/app.service";

const langs = {
  'zh-CN': zh_CN,
  en: en_US
};

const theme = {
  "components": {
    "Table": {
      "rowHoverBg": "rgba(22,119,255,0.15)"
    }
  }
};

export function AntConfigProvider(props: ConfigProviderProps) {
  return <ConfigProvider theme={theme} {...props} locale={langs[appService.lang]} />
}
