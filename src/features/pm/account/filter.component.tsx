import {
  Col,
  FilterContainer,
  Form,
  Input,
  Row,
  Select,
  SelectProps,
} from "@components";
import { net } from "@infra";
import localStorage from "@services/localStorage";
import { useRequest } from "ahooks";
import { useCallback, useMemo } from "react";
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
    (input: string, option?: { label: string; value: number | string }) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
    []
  );

  return (
    <Select<number, { value: number | string; label: string }>
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
    <FilterContainer onFinish={onFinish}>
      <Row justify="space-around">
        <Col span={8}>
          <Form.Item name="account" label={t("输入查询")}>
            <Input placeholder={t("用户账号/名称")} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="roleId" label={t("账号角色")}>
            <RemoteSelect type="roles" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="activeType" label={t("账号状态")}>
            <RemoteSelect type="base" />
          </Form.Item>
        </Col>
      </Row>
    </FilterContainer>
  );
}
