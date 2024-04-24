import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, theme } from "@components";
import { useNav } from '@hooks';
import appService from "@services/app.service";
import { UserInfo } from "./components/user-info.component";
import { Lang } from "./components/lang.component";
import { topnavConfig } from "./nav-config";
import styles from "./layout.module.less";

const { Header, Content, Sider } = Layout;

function Home() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  useEffect(() => {
    appService.init({ navigate });
  }, [navigate]);

  const [activeNav, setActiveNav] = useState<string>("");

  const navConfig = useMemo(() => topnavConfig(), []);

  const { activeTopNav, activeSideNav, openSideKeys } = useNav(navConfig);
  console.log({ activeTopNav, activeSideNav, openSideKeys });

  const sideNavItem = useMemo(() => {
    return navConfig.find((item) => item.key === activeNav)?.sidenavs || [];
  }, [activeNav, navConfig]);

  const handleLogoClick = () => navigate('/');

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
          items={navConfig}
          className={styles.topnav}
          onSelect={({ key }) =>setActiveNav(key)}
          activeKey={activeTopNav}
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
            onSelect={({ key }) => navigate(key)}
            activeKey={activeSideNav}
            openKeys={openSideKeys}
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
}

export default Home;
