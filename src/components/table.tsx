import { useHeight } from "@hooks";
import { TableProps, Table as AntTable } from "antd";
import { useMemo } from "react";

export function Table(props: TableProps) {
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
      <AntTable {...props} scroll={{ y: heights.table }} />
    </div>
  );
}
