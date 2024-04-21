import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, theme } from "@components";
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

  const [activeNav, setActiveNav] = useState<string>("");

  const topNavItems = useMemo(() => topnavConfig(), []);

  const sideNavItem = useMemo(() => {
    return topNavItems.find((item) => item.key === activeNav)?.subs || [];
  }, [activeNav, topNavItems]);

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
          items={topNavItems}
          className={styles.topnav}
          onSelect={({ key }) =>setActiveNav(key)}
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
