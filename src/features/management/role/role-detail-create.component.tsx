import { useEffect, useState } from 'react';
import RoleDetailComponent from './role-detail.component';
import { RoleDetailStore } from './role-detail.store';
import { observer } from 'mobx-react-lite';
import { RoleParams } from './types';
import { useNavigate } from 'react-router-dom';

const RoleDetailCreate = observer(() => {
  const [store] = useState(new RoleDetailStore);
  const navigate = useNavigate();

  useEffect(() => {
    store.onLoad();
  }, [store]);

  const onCommit = async (params: RoleParams) => {
    if (await store.createRole(params)) {
      navigate(-1);
    }
  };

  return (
    <RoleDetailComponent
      permissions={store.permissions}
      onCommit={onCommit}
      initialValues={store.initialValue}
    />
  );
});

export default RoleDetailCreate;
