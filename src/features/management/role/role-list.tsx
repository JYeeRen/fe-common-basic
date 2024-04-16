import { DataGrid } from "@components";
import { observer } from "mobx-react-lite";
import * as roleListConfig from './role-list-config';
function RoleList() {
  return (
    <>
      <DataGrid
        columns={roleListConfig.getGridColumns()}
        dataSource={[]}
      />
    </>
  );
}

const RoleListComponent = observer(RoleList);

export default RoleListComponent;