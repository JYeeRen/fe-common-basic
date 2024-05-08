import { Block } from "@components";
import { useHeight } from "@hooks";
import { TableProps, Table as AntTable, Pagination } from "antd";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

export const Table = observer((props: TableProps) => {

  const { pagination, ...restProps } = props

  const height = useHeight("#table-container");

  const heights = useMemo(() => {
    const container = Math.max(300, height - 36);
    const table = Math.max(200, height - 150);
    return { container, table };
  }, [height]);

  return (
    <div
      id="table-container"
      className="w-full overflow-hidden"
      style={{ height: `${heights.container}px` }}
    >
      <AntTable {...restProps} scroll={{ y: heights.table, x: 'max-content' }} pagination={false} />
      <Block if={Boolean(pagination)}>
        <Pagination
          className="flex justify-end mt-4 mr-4 mb-8"
          {...pagination}
        />
      </Block>
    </div>
  );
})
