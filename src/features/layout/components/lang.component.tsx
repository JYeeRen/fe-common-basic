import { TranslationOutlined } from "@ant-design/icons";
import { Dropdown, MenuItemProps, MenuProps } from "@components";
import { changeLanguage } from "@locale";
import appService from "@services/app.service";
import { observer } from "mobx-react-lite";

function LangComponent() {
  const items: MenuProps["items"] = [
    {
      label: "中文",
      key: "zh",
    },
    {
      label: "English",
      key: "en",
    },
  ];

  const handlerItemClick: MenuItemProps['onClick'] = ({ key }) => {
    appService.setLang(key as 'en' | 'zh');
    changeLanguage(key);
  };

  return (
    <Dropdown menu={{ items, onClick: handlerItemClick, selectedKeys: [appService.lang] }} trigger={["click"]}>
      <div onClick={(e) => e.preventDefault()} className="mx-2">
      <TranslationOutlined />
      </div>
    </Dropdown>
  );
}

export const Lang = observer(LangComponent);
