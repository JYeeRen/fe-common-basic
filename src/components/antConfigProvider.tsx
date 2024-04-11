import { ConfigProvider, ConfigProviderProps } from "antd";
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';


export function AntConfigProvider(props: ConfigProviderProps) {
  return <ConfigProvider {...props} locale={zhCN} />
}
