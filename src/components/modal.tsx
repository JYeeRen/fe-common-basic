import { t } from "@locale";
import { Modal } from "antd";

export const deleteConfirm = (onOk: () => void | Promise<void>) => {
  Modal.confirm({
    title: t("操作确认"),
    content: t(
      "警告！一旦确认继续，数据将永久删除，此操作不可恢复，请谨慎操作"
    ),
    okType: "danger",
    onOk,
    // async onOk() {
    //   await store.delteAccount(id);
    //   notification.success({
    //     message: t("用户删除成功"),
    //     description: t("用户删除成功"),
    //   });
    //   gridStore.loadData();
    // },
    okText: t("确认删除"),
    cancelText: t("取消"),
  });
};
