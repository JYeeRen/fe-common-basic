import { DataGrid } from "@components";
import { observer } from "mobx-react-lite";
import * as roleListConfig from './role-list-config';

function RoleList() {
  return (
    <>
      <DataGrid
        getData={roleListConfig.getData}
        columns={roleListConfig.getGridColumns()}
      />
    </>
  );
}

const RoleListComponent = observer(RoleList);

export default RoleListComponent;