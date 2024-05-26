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

export function AntConfigProvider(props: ConfigProviderProps) {
  return <ConfigProvider {...props} locale={langs[appService.lang]} />
}
