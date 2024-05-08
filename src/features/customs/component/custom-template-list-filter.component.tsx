import { Col, FilterContainer, Form, Input, SearchSelect } from "@components";
import { useTranslation } from "@locale";
import { Options } from "@types";
import { useMemo } from "react";

interface FilterProps {
  templateTypeOptions: Options;
  activeOptions: Options;
  onFinish: (values: {
    templateId?: number;
    templateName?: string;
    templateType?: number;
    active?: number;
  }) => void;
}

export const CustomTemplateListFilterComponent = (props: FilterProps) => {
  const { templateTypeOptions, activeOptions, onFinish } = props;
  const [t] = useTranslation();

  const initialValues = useMemo(() => ({
    templateType: 0,
    active: 0
  }), []);

  return (
    <FilterContainer initialValues={initialValues} onFinish={onFinish}>
        <Col span={6}>
          <Form.Item name="templateId" label={t("模板编号")}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="templateName" label={t("模板名称")}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="templateType" label={t("模板类型")}>
            <SearchSelect options={templateTypeOptions} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="active" label={t("模板状态")}>
            <SearchSelect options={activeOptions} />
          </Form.Item>
        </Col>
    </FilterContainer>
  );
};
