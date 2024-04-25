import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import AccountDetailComponent from "./account-detail.component";
import { AccountDetailStore } from "./account-detail.store";
import { AccountParams } from "./types";
import { useNavigate } from "react-router-dom";

const AccountCreate = observer(() => {
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
      onCommit={handleCommit}
      initialValues={store.initialValues}
      roleOptions={store.roles}
    />
  );
});

export default AccountCreate;
