import { TranslationOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "@components";

export function Lang() {
  const items: MenuProps["items"] = [
    {
      label: "中文",
      key: "zh-CN",
    },
    {
      label: "English",
      key: "en",
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <div onClick={(e) => e.preventDefault()} className="mx-2">
      <TranslationOutlined />
      </div>
    </Dropdown>
  );
}
