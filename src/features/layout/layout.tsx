import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, theme } from "@components";
import appService from "@services/app.service";
import { UserInfo } from "./components/user-info.component";
import { Lang } from "./components/lang.component";
import { observer } from "mobx-react-lite";
import { useMenuCtrl } from "./useMenuCtrl";
import styles from "./layout.module.less";

const { Header, Content, Sider } = Layout;

const MainLayout = observer(() => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  useEffect(() => (appService.init({ navigate }), undefined), [navigate]);


  const {
    topnav, topnavs, sidenavs, defaultSelectedKeys, defaultOpenKeys, onOpenChange, setTopnav
  } = useMenuCtrl();

  const onLogoClick = () => navigate('/');
  const onSideMenuSelect = ({ key }: { key: string }) => navigate(key);

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo} onClick={onLogoClick}>
          R&T
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          items={topnavs}
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
            items={sidenavs}
            defaultOpenKeys={defaultOpenKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            onOpenChange={onOpenChange}
            onSelect={onSideMenuSelect}
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
