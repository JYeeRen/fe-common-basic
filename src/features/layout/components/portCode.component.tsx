import { Dropdown, MenuItemProps, Modal } from "@components";
import { useStore } from "@hooks";
import { net } from "@infra";
import { t } from "@locale";
import appService from "@services/app.service";
import optionsService from "@services/options.service";
import { keyBy } from "lodash";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

class PortCodeStore {
  portCode: string = "all";

  constructor() {
    makeAutoObservable(this);
  }

  async getPortCode() {
    const { portCode } = await net.post("/api/userSetting/getPortCode");
    runInAction(() => {
      this.portCode = portCode || 'all';
    });
  }

  async setPortCode(portCode: string) {
    await net.post("/api/userSetting/setPortCode", { portCode });
    await this.getPortCode();
  }
}

function PortCodeComponent() {
  const { store } = useStore(PortCodeStore)();

  useEffect(() => { store.getPortCode() }, []);

  const items: { label: string; key: string }[] = [
    { label: t("全部口岸数据"), key: "all" },
    ...optionsService.portCodes.map(({ label, value }) => ({
      label,
      key: value as string,
    })),
  ];

  const itemDict = keyBy(items, "key");

  const handlerItemClick: MenuItemProps["onClick"] = ({ key }) => {
    Modal.confirm({
        title: t('操作确认'),
        content: (
          <>
            <p>{t("确认后，全系统数据将切换为选中口岸的数据，是否确认切换口岸？")}</p>
            <p style={{ height: '10px' }}></p>
            <p>当前口岸: {itemDict[store.portCode].label}</p>
            <p>待切换口岸: {itemDict[key].label}</p>
          </>
        ),
        okText: t("确认"),
        cancelText: t("取消"),
        onOk: () => store.setPortCode(key === 'all' ? '' : key)
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '10px'
      }}
    >
      {t("口岸选择")}:
      <Dropdown
        menu={{
          items,
          onClick: handlerItemClick,
          selectedKeys: [appService.lang],
        }}
        trigger={["click"]}
      >
        <div
          onClick={(e) => e.preventDefault()}
          style={{
            marginRight: "20px",
            color: '#fff',
            backgroundColor: '#1890ff',
            padding: '0 10px',
            margin: '0 10px',
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '100px'
          }}
        >
          {itemDict[store.portCode]?.label}
        </div>
      </Dropdown>
    </div>
  );
}

export const PortCode = observer(PortCodeComponent);
