import { Button, DataGrid, Row } from "@components";
import { observer } from "mobx-react-lite";
import { UsergroupAddOutlined } from "@ant-design/icons";
import * as roleListConfig from "./role-list-config";
import styles from "./role-list.module.less";

function RoleList() {
  const columns = roleListConfig.getGridColumns();

  return (
    <>
      <Row className={styles.header}>
        <span className={styles.title}>角色管理</span>
      </Row>
      <Row>
        <Button icon={<UsergroupAddOutlined />}>新增角色</Button>
      </Row>
      <DataGrid
        // getData={roleListConfig.getData}
        columns={columns}
        dataSource={[{ name: '1', linkedCount: 1, active: true }]}
      />
    </>
  );
}

const RoleListComponent = observer(RoleList);

export default RoleListComponent;
