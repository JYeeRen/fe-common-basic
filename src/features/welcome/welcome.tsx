import { useMemo } from 'react';
import { Typography } from '@components';
import localStorage from '@services/localStorage';

function Welcome() {
  const userName =  useMemo(() => localStorage.getItem('user')?.name ?? '', []);
  return (
    <Typography.Title level={2}>{userName}！</Typography.Title>
  );
}

export default Welcome;
