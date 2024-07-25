import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore.hook";
import { CustomTemplateOperationStore } from "./custom-template-operation.store";
import { useParams } from "react-router-dom";
import { Container, Form } from "@components";
import styles from "./custom-template-operation.module.less";
import { DragableTable } from "./component/dragable-table.component";
import optionsService from "@services/options.service";
import { find } from "lodash";

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
          <Form.Item
            name="typesetting"
            label={t("商品展示规则")}
            rules={[{ required: true }]}
          >
            {
              find(optionsService.customsDocumentTypesetting, {
                value: store.customTemplate?.typesetting,
              })?.label
            }
          </Form.Item>
          <Form.Item label={t("导出列配置")}></Form.Item>
        </div>
        <div className="flex flex-col align-middle justify-center mx-20">
          <DragableTable
            omitMerge={store.customTemplate?.typesetting !== 2}
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
