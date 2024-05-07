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
  const { onFinish, children, ...formProps } = props;

  const [form] = Form.useForm();

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t("数据筛选")}</div>
      <div className={styles.divider} />
      <div className={clsx("mb-4", styles.filter)}>
        <Form
          form={form}
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
          <Row>{children}</Row>
        </Form>
      </div>
    </div>
  );
}
