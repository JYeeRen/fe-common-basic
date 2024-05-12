import { Block, Button, Modal, Row } from "@components";
import { useTranslation } from "@locale";
import { DeclrationStore } from "../declaration.store";
import { observer } from "mobx-react-lite";


export const ViewDocumentModal = observer(
  (props: { store: DeclrationStore }) => {
    const { store } = props;
    const [t] = useTranslation();
    return (
      <Modal
        open={Boolean(store.viewing)}
        footer={null}
        title={t("查看相关文件")}
        onCancel={store.setViewing.bind(store, null)}
      >
        <Row className="my-8">
          <p>
            {t("当前订单 “订单号{{no}}”，已制作文件如下，请下载查看：", {
              no: store.viewing?.masterWaybillNo,
            })}
          </p>
        </Row>
        <Row justify="space-around" className="mb-4">
          <Block if={store.viewing?.customsFile}>
            <Button
              loading={store.loading}
              onClick={store.downloadCustomsFile.bind(store, store.viewing?.id)}
              type="primary"
            >
              {t("下载清关文件")}
            </Button>
          </Block>
          <Block if={store.viewing?.prealertFile}>
            <Button
              loading={store.loading}
              onClick={store.downloadPrealert.bind(store, store.viewing?.id)}
              type="primary"
            >
              {t("下载预报文件")}
            </Button>
          </Block>
          <Block if={store.viewing?.copyImgFile}>
            <Button
              loading={store.loading}
              onClick={store.downloadCopyFile.bind(store, store.viewing?.id)}
              type="primary"
            >
              {t("下载清关提货文件")}
            </Button>
          </Block>
        </Row>
      </Modal>
    );
  }
);
