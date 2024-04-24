import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, MenuProps, theme } from "@components";
import appService from "@services/app.service";
import { UserInfo } from "./components/user-info.component";
import { Lang } from "./components/lang.component";
import { formatNavItems, getNavItems, topnavConfig } from "./nav-config";
import styles from "./layout.module.less";
import { observer } from "mobx-react-lite";
import { t } from "i18next";

const { Header, Content, Sider } = Layout;

const MainLayout = observer(() => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  useEffect(() => {
    appService.init({ navigate });
  }, [navigate]);

  const [topnav, setTopnav] = useState('权限管理');

  const navitemDict = useMemo(() => (formatNavItems(getNavItems())), []);

  const sideNavItem = useMemo(() => navitemDict[topnav], [navitemDict, topnav]);

  const handleLogoClick = () => navigate('/');

  const topnavItems = useMemo(() => [
    { key: '关务风控', label: t('关务风控') },
    { key: '权限管理', label: t('权限管理') },
  ], []);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleSideNacSelect: MenuProps['onSelect'] = ({ key, selectedKeys }) => {
    navigate(key);
    setSelectedKeys(selectedKeys);
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo} onClick={handleLogoClick}>
          R&T
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["/customs/basic-data"]}
          items={topnavItems}
          className={styles.topnav}
          onSelect={({ key }) => setTopnav(key)}
          selectedKeys={[topnav]}
        />
        <Lang />
        <UserInfo />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            className={styles.sidenav}
            mode="inline"
            items={sideNavItem}
            onSelect={handleSideNacSelect}
            selectedKeys={selectedKeys}
            openKeys={appService.opensidenav}
          />
        </Sider>
        <Layout className={styles.main}>
          <Content
            className={styles.content}
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              flex: 1
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
});

export default MainLayout;
