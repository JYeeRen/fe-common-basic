import { t } from "@locale";

export const stateFormatter = (params: { value: boolean }) => {
  if (params.value === true) {
    return t("启用");
  }
  return t("停用");
};
