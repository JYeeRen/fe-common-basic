import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore.hook";
import { CustomTemplateOperationStore } from "./custom-template-operation.store";
import { useParams } from "react-router-dom";
import { Container, Form } from "@components";
import styles from "./custom-template-operation.module.less";
import { DragableTable } from "./component/dragable-table.component";

const CustomTemplateDetail = observer(() => {
  const { id } = useParams();
  const { store, t } = useStore(CustomTemplateOperationStore)(id);

  return (
    <Container
      className={styles.container}
      title={t("查看模板")}
      loading={store.loading}
      backable
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
        <div className={styles.form}>
          <Form.Item label={t("模板编号")}>
            {store.customTemplate?.id}
          </Form.Item>
          <Form.Item label={t("模板名称")}>
            {store.customTemplate?.name}
          </Form.Item>
          <Form.Item label={t("模板类型")}>
            {
              store.templateTypes.find(
                (t) => t.value === store.customTemplate?.type
              )?.label
            }
          </Form.Item>
          <Form.Item label={t("是否启用")}>
            {store.customTemplate?.active ? t("已启用") : t("已停用")}
          </Form.Item>
          <Form.Item label={t("按运单号合并商品")}>
            {store.customTemplate?.active ? t("是") : t("否")}
          </Form.Item>
          <Form.Item label={t("导出列配置")}></Form.Item>
        </div>
        <div className="flex flex-col align-middle justify-center mx-20">
          <DragableTable
            readonly
            dataSource={store.templateColumns}
            handleRecordFieldChange={store.handleRecordFieldChange.bind(store)}
            setDataSource={store.setTemplateColumns.bind(store)}
          />
        </div>
      </Form>
    </Container>
  );
});

export default CustomTemplateDetail;
