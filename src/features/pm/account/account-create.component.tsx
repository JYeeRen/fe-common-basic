import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import AccountDetailComponent from "./account-detail.component";
import { AccountDetailStore } from "./account-detail.store";
import { AccountParams } from "./types";
import { useStore } from "@hooks";

const AccountCreate = observer(() => {
  const { store, t, navigate } = useStore(AccountDetailStore)();

  useEffect(() => {
    store.onLoad();
  }, [store]);

  const handleCommit = async (params: AccountParams) => {
    await store.create(params)
    navigate(-1);
  } 

  return (
    <AccountDetailComponent
      title={t('新增账号')}
      onCommit={handleCommit}
      initialValues={store.initialValues}
      roleOptions={store.roles}
      loading={store.loading}
    />
  );
});

export default AccountCreate;
