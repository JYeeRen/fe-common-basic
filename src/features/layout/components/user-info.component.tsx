import { useMemo } from 'react';
import { Avatar, Dropdown, MenuProps } from '@components';
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import localStorage from '@services/localStorage';
import { useNavigate } from 'react-router-dom';
import { authProvider } from '@services/auth.service';
import { useTranslation } from '@locale';

export function UserInfo() {
  const navigate = useNavigate();
  const userName =  useMemo(() => localStorage.getItem('user')?.username ?? '', []);
  const [t] = useTranslation();

  const items: MenuProps['items'] = [
    {
      label: t('修改密码'),
      icon: <UserOutlined />,
      key: 'changepassword',
      onClick: () => {
        navigate('/pm/accounts/change-passwd');
      }
    },
    {
      label: t('注销登录'),
      icon: <LogoutOutlined />,
      key: 'logout',
      onClick: async () => {
        await authProvider.signout();
        navigate('/login', { replace: true });
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
    <div onClick={e => e.preventDefault()} className="mx-2">
      <Avatar style={{ backgroundColor: '#f56a00' }}>{userName}</Avatar>
      <span className="ml-2">{t('您好，{{userName}}！', { userName })}</span>
    </div>
    </Dropdown>
  );
}


