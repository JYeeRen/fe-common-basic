import { Button, Form, FormProps, Row, Space } from "antd";
import { PropsWithChildren } from "react";
import styles from "./filter.module.less";
import clsx from "clsx";
import { t } from "@locale";
import { RedoOutlined, SearchOutlined } from "@ant-design/icons";

interface FilterProps extends PropsWithChildren {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFinish?: (values?: any) => void;
}

export function FilterContainer(props: FilterProps & FormProps) {
  const { onFinish, children, form, ...formProps } = props;

  const [internalForm] = Form.useForm(form);

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t("数据筛选")}</div>
      <div className={styles.divider} />
      <div className={clsx("mb-4", styles.filter)}>
        <Form
          form={internalForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          onReset={() => onFinish?.()}
          {...formProps}
        >
          <Row>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  {t("查询")}
                </Button>
                <Button htmlType="reset" icon={<RedoOutlined />}>
                  {t("重置")}
                </Button>
              </Space>
            </Form.Item>
          </Row>
          <Row align="middle">{children}</Row>
        </Form>
      </div>
    </div>
  );
}
