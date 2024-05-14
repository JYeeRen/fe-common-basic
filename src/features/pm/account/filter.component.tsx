import {
  Col,
  FilterContainer,
  Form,
  Input,
  Row,
  SearchSelect,
} from "@components";
import { t } from "@locale";


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
            <SearchSelect optionKey="roles" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="activeType" label={t("账号状态")}>
            <SearchSelect optionKey="actives" />
          </Form.Item>
        </Col>
      </Row>
    </FilterContainer>
  );
}
