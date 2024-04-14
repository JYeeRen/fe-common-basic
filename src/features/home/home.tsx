import { Outlet } from "react-router-dom";
import { Layout, Menu, theme } from '@components';
import styles from './home.module.less';

const { Header, Content, Sider } = Layout;

function Home() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header className="flex items-center">
        <div className={styles.logo} />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['/customs/basic-data']}
          items={[
            {
              key: '/customs',
              label: '关务',
              children: [
                { key: '/customs/basic-data', label: '关务基础数据' },
                { key: '/customs/declareation', label: '关务单证' },
                { key: '/customs/risk-control', label: '关务风控' },
              ]
            },
            {
              key: '/data-template',
              label: '资料模板',
              children: [
                { key: '/data-template/maintenance', label: '资料模板维护' },
                { key: '/data-template/add', label: '资料模板新增' },
              ]
            },
            {
              key: '/trajectory',
              label: '轨迹维护',
              children: [
                { key: '/trajectory/maintenance', label: '轨迹维护' },
              ]
            }
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: '/customs',
                label: '关务',
                children: [
                  { key: '/customs/basic-data', label: '关务基础数据' },
                  { key: '/customs/declareation', label: '关务单证' },
                  { key: '/customs/risk-control', label: '关务风控' },
                ]
              },
              {
                key: '/data-template',
                label: '资料模板',
                children: [
                  { key: '/data-template/maintenance', label: '资料模板维护' },
                  { key: '/data-template/add', label: '资料模板新增' },
                ]
              },
              {
                key: '/trajectory',
                label: '轨迹维护',
                children: [
                  { key: '/trajectory/maintenance', label: '轨迹维护' },
                ]
              }
            ]}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
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
