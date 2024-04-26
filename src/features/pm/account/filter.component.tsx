import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  SelectProps,
  Space,
} from "@components";
import { net } from "@infra";
import localStorage from "@services/localStorage";
import { useRequest } from "ahooks";
import { useCallback, useMemo } from "react";
import styles from "./filter.module.less";
import clsx from "clsx";
import { t } from "@locale";

const fetchOptions = () => ({
  base: async () => (await net.post("/api/option/getBase")).actives,
  roles: async () => (await net.post("/api/option/getRoleNames")).options,
});

interface RemoteSelectProps extends SelectProps {
  type: "roles" | "base";
}

const RemoteSelect = (props: RemoteSelectProps) => {
  const { type } = props;
  const cacheKey = useMemo<"options.roles" | "options.base">(
    () => `options.${type}`,
    [type]
  );
  const request = useMemo(() => fetchOptions()[type], [type]);

  const { data, loading } = useRequest(request, {
    cacheKey,
    setCache: (data) => localStorage.setItem(cacheKey, data),
    getCache: () => localStorage.getItem(cacheKey),
  });

  const options = useMemo(
    () => data?.map((item) => ({ value: item.id, label: item.val })) ?? [],
    [data]
  );

  const filterOption = useCallback(
    (input: string, option?: { label: string; value: number }) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
    []
  );

  return (
    <Select<number, { value: number; label: string }>
      {...props}
      loading={loading}
      options={options}
      showSearch
      allowClear
      placeholder="全部"
      filterOption={filterOption}
    />
  );
};

interface FilterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFinish?: (values?: any) => void;
}

export function Filter(props: FilterProps) {
  const { onFinish } = props;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{t("数据筛选")}</div>
      <div className={styles.divider} />
    <div className={clsx("mb-4", styles.filter)}>
      <Form onFinish={onFinish} onReset={() => onFinish?.()}>
        <Row>
          <Col span={18}>
            <Row justify="space-around">
              <Col span={7}>
                <Form.Item name="account" label={t("输入查询")}>
                  <Input placeholder={t("用户账号/名称")} />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item name="roleId" label={t("账号角色")}>
                  <RemoteSelect type="roles" />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item name="activeType" label={t("账号状态")}>
                  <RemoteSelect type="base" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="flex justify-center">
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t("查询")}
                </Button>
                <Button htmlType="reset">{t("重置")}</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
    </div>
  );
}
