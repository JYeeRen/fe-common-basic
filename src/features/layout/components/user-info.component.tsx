import { useMemo } from 'react';
import { Avatar, Dropdown, MenuProps } from '@components';
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import localStorage from '@services/localStorage';
import * as authService from '@services/auth.service';
import { useNavigate } from 'react-router-dom';

export function UserInfo() {

  const navigate = useNavigate();
  const userName =  useMemo(() => localStorage.getItem('user')?.name ?? '', []);

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
      onClick: async () => {
        await authService.signout();
        navigate('/login');
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
    <div onClick={e => e.preventDefault()} className="mx-2">
      <Avatar style={{ backgroundColor: '#f56a00' }}>{userName}</Avatar>
      <span className="ml-2">您好，{userName}！</span>
    </div>
    </Dropdown>
  );
}


