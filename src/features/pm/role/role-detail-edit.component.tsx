import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "@components";
import RoleDetailComponent from "./role-detail.component";
import { RoleDetailStore } from "./role-detail.store";
import { observer } from "mobx-react-lite";
import { RoleParams } from "./types";
import { useTranslation } from "@locale";

const RoleDetailEdit = observer(() => {
  const { id } = useParams();
  const [t] = useTranslation();
  const navigate = useNavigate();

  const [store] = useState(new RoleDetailStore());

  useEffect(() => {
    store.onLoad(id != null ? Number(id) : undefined);
  }, [id, store]);

  const onCommit = async (params: RoleParams) => {
    const { active: curState } = params;
    const originState = store.role?.active;

    if (curState !== originState) {
      const content = curState
        ? "确定要将【{{roleName}}】启用吗？"
        : "禁用后，关联的账号将失去角色所具有的权限，确定要将【{{roleName}}】禁用吗？";
      Modal.confirm({
        title: t("操作确认"),
        content: t(content, { roleName: store.role?.name }),
        async onOk() {
          await store.updateRole(params);
          navigate(-1);
        },
        okText: t("确认"),
        cancelText: t("取消"),
      });
      return;
    }

    await store.updateRole(params);
    navigate(-1);
  };

  return (
    <RoleDetailComponent
      loading={store.loading}
      title={t('编辑角色信息')}
      permissions={store.permissions}
      onCommit={onCommit}
      initialValues={store.initialValue}
      linkedAccounts={store.role?.linkedAccounts ?? []}
      unlinkAccount={store.unlinkAccount.bind(store)}
    />
  );
});

export default RoleDetailEdit;
