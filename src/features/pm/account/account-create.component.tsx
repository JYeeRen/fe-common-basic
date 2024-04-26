import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import AccountDetailComponent from "./account-detail.component";
import { AccountDetailStore } from "./account-detail.store";
import { AccountParams } from "./types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@locale";

const AccountCreate = observer(() => {
  const [t] = useTranslation();
  const [store] = useState(new AccountDetailStore());
  const navigate = useNavigate();
  useEffect(() => {
    store.onLoad();
  }, [store]);

  const handleCommit = async (params: AccountParams) => {
    if (await store.create(params)) {
      navigate(-1);
    }
  } 

  return (
    <AccountDetailComponent
      title={t('新增账号')}
      onCommit={handleCommit}
      initialValues={store.initialValues}
      roleOptions={store.roles}
    />
  );
});

export default AccountCreate;
