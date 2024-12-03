export interface UserSettingAPI {
  "/api/userSetting/setPortCode": {
    params: { portCode: string };
    res?: never;
  }
  "/api/userSetting/getPortCode": {
    params?: never;
    res: { portCode: string };
  }
}