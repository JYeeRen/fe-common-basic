import { Avatar, Dropdown, MenuProps } from '@components';
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

export function UserInfo() {

  const items: MenuProps['items'] = [
    {
      label: '修改密码',
      icon: <UserOutlined />,
      key: 'changepassword',
    },
    {
      label: '注销登录',
      icon: <LogoutOutlined />,
      key: 'logout',
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
    <div onClick={e => e.preventDefault()} className="mx-2">
      <Avatar style={{ backgroundColor: '#f56a00' }}>用户名</Avatar>
      <span className="ml-2">您好，用户名！</span>
    </div>
    </Dropdown>
  );
}


