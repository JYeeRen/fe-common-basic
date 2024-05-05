import { Form, Table, TableColumnType, TableColumnsType } from "@components";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CustomTemplateCol } from "../types";
import { EditableCell } from "./editable-cell.component";
import { useTranslation } from "@locale";
import { useMemo } from "react";
import { Intercept } from "./intercept.component";

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row = (props: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const isDraggingStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 999,
  };
  if (props.className === "ant-table-placeholder") isDraggingStyle.zIndex = 0;
  if (!isDragging) isDraggingStyle.zIndex = 0;

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: "move",
    ...isDraggingStyle,
  };

  return (
    <Form component={false}>
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    </Form>
  );
};

interface DragableTableProps {
  dataSource: CustomTemplateCol[];
  handleRecordFieldChange: <K extends keyof CustomTemplateCol>(
    key: K,
    value: CustomTemplateCol[K],
    record: CustomTemplateCol
  ) => void;
  setDataSource: (dataSource: CustomTemplateCol[]) => void;
}

export function DragableTable(props: DragableTableProps) {
  const { dataSource, setDataSource, handleRecordFieldChange } = props;
  const [t] = useTranslation();

  const columnDefs: (TableColumnType<CustomTemplateCol> & {
    editable?: "custom" | "all";
  })[] = useMemo(
    () => [
      {
        width: 60,
        key: "index",
        dataIndex: "index",
        title: t("序号"),
        render: (__v, __r, index) => index + 1,
      },
      {
        width: 160,
        key: "enName",
        dataIndex: "enName",
        title: t("列英文"),
        editable: "custom",
      },
      {
        width: 160,
        key: "cnName",
        dataIndex: "cnName",
        title: t("列中文"),
        editable: "custom",
      },
      {
        width: 160,
        key: "exportName",
        dataIndex: "exportName",
        title: t("导出列名称"),
        editable: "all",
      },
      {
        width: 90,
        key: "fixedValue",
        dataIndex: "fixedValue",
        title: t("固定值"),
        editable: "all",
      },
      {
        width: 300,
        key: "intercept",
        dataIndex: "intercept",
        title: t("截取字段"),
        render: (__v, record) => (
          <Intercept
            record={record}
            handleRecordFieldChange={handleRecordFieldChange}
          />
        ),
      },
      {
        width: 100,
        key: "targetUnit",
        dataIndex: "targetUnit",
        title: t("单位换算"),
      },
    ],
    [handleRecordFieldChange, t]
  );

  const columns = useMemo(
    () =>
      columnDefs.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: CustomTemplateCol) => ({
            record,
            editable: col.editable === "all" || col.editable === record.type,
            cellkey: col.key,
            value: record[col.key as keyof CustomTemplateCol],
            onSave: handleRecordFieldChange,
          }),
        };
      }),
    [columnDefs, handleRecordFieldChange]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource(
        (() => {
          const prev = dataSource;
          const activeIndex = prev.findIndex((i) => i.key === active.id);
          const overIndex = prev.findIndex((i) => i.key === over?.id);
          return arrayMove(prev, activeIndex, overIndex);
        })()
      );
    }
  };

  if (dataSource.length === 0) {
    return (
      <Table
        columns={columns as TableColumnsType}
        dataSource={[]}
        size="small"
        scroll={{ x: "max-content" }}
        pagination={false}
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={dataSource.map((i) => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          bordered
          components={{ body: { row: Row, cell: EditableCell } }}
          rowKey="key"
          columns={columns as TableColumnsType<CustomTemplateCol>}
          dataSource={dataSource}
          size="small"
          scroll={{ x: "max-content", y: 300 }}
          pagination={false}
        />
      </SortableContext>
    </DndContext>
  );
}
