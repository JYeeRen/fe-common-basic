import RoleDetailComponent from "./role-detail.component";
import { RoleDetailStore } from "./role-detail.store";
import { observer } from "mobx-react-lite";
import { RoleParams } from "./types";
import { useStore } from "@hooks";

const RoleDetailCreate = observer(() => {
  const { store, navigate, t } = useStore(RoleDetailStore)();

  const onCommit = async (params: RoleParams) => {
    await store.createRole(params);
    navigate(-1);
  };

  return (
    <RoleDetailComponent
      title={t("新增角色")}
      permissions={store.permissions}
      onCommit={onCommit}
      initialValues={store.initialValue}
    />
  );
});

export default RoleDetailCreate;
