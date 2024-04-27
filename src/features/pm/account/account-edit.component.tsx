import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import AccountDetailComponent from "./account-detail.component";
import { AccountDetailStore } from "./account-detail.store";
import { AccountParams } from "./types";
import { useParams } from "react-router-dom";
import { Modal } from "@components";
import { useStore } from "@hooks";

const AccountEdit = observer(() => {
  const { store, t, navigate } = useStore(AccountDetailStore)();
  const { id } = useParams();
  useEffect(() => {
    store.onLoad(Number(id));
  }, [id, store]);

  const onCommit = async (params: AccountParams) => {
    const { active: curState } = params;
    const originState = store.account?.active;

    if (curState !== originState) {
      const content = curState
        ? "确定要将【{{username}}】启用吗？"
        : "禁用后，该账号将无法登陆系统。确认要将【{{username}}】禁用吗？";
      Modal.confirm({
        title: t("操作确认"),
        content: t(content, { username: store.account?.username }),
        async onOk() {
          if (await store.update(params)) {
            navigate(-1);
          }
        },
        okText: t("确认"),
        cancelText: t("取消"),
      });
      return;
    }

    await store.update(params);
    navigate(-1);
  };

  return (
    <AccountDetailComponent
      loading={store.loading}
      title={t('编辑账号信息')}
      onCommit={onCommit}
      initialValues={store.initialValues}
      roleOptions={store.roles}
    />
  );
});

export default AccountEdit;
