import { useState, useRef, useEffect } from "react";
import { Modal, Transfer, Row, Space, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { DndProvider, useDrop, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./colManager.module.less";
import clsx from "clsx";
import { t } from "@locale";

type Key = string;

interface Item {
  key: Key;
  label: string;
}

interface Props<T extends Item> {
  visible: boolean;
  onClose?: () => void;
  fieldColumns?: T[];
  defaultColumns?: T[];
  selectedKeys?: Key[];
  showColumns?: T[];
  setShowColumns: (keys: Key[]) => void;
}

export function TableColSettings<T extends Item>(props: Props<T>) {
  const {
    visible,
    onClose = () => void 0,
    fieldColumns = [],
    defaultColumns = [],
    selectedKeys,
    setShowColumns,
  } = props;
  const [targetKeys, setTargetKeys] = useState<Key[]>(selectedKeys ?? []);

  useEffect(() => {
    setTargetKeys(selectedKeys ?? []);
  }, [selectedKeys]);

  const onChange = (nextTargetKeys: Key[]) => {
    setTargetKeys(Array.from(new Set(nextTargetKeys)));
  };

  const onOk = () => {
    let mapping: Record<string, string> = {};
    const columns = fieldColumns.filter((col) =>
      new Set(targetKeys).has(col.key)
    );

    columns.forEach((col) => {
      mapping[col.key.toString()] = col.label;
    });

    let finalColumns = targetKeys.map((tar) => ({
      key: tar,
      label: mapping[tar.toString()],
    }));

    if (!finalColumns.length) {
      finalColumns = defaultColumns;
    }

    setShowColumns(targetKeys);
    onClose();
  };

  // const reset = () => {
  //   const finalKeys = defaultColumns.map((it) => it.key);
  //   setTargetKeys(finalKeys);
  // };

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const clonedList = targetKeys;
    const el = clonedList.splice(dragIndex, 1)[0];
    clonedList.splice(hoverIndex, 0, el);
    onChange(clonedList);
  };

  return (
    <Modal
      maskClosable={false}
      open={visible}
      title={t("选择需要展示的尾程服务商")}
      onCancel={onClose}
      width={700}
      classNames={{ body: styles.modalBody }}
      destroyOnClose
      footer={
        <Row justify="end">
          <Space size="middle">
            <Button onClick={onClose}>
              {t("取消")}
            </Button>
            <Button type="primary" onClick={onOk}>
              {t("保存")}
            </Button>
          </Space>
        </Row>
      }
    >
      <DndProvider backend={HTML5Backend}>
        <Transfer
          className={styles.transfer}
          rowKey={(record) => record.key}
          listStyle={{ flex: 1 }}
          dataSource={fieldColumns}
          render={(it) => (
            <DraggableItem
              index={targetKeys.findIndex((key) => key === it.key)}
              label={it.label}
              moveRow={moveRow}
            />
          )}
          locale={{
            itemUnit: t("项"),
            itemsUnit: t("项"),
            searchPlaceholder: t("请输入搜索内容"),
          }}
          titles={[t("待选项"), t("已选项")]}
          targetKeys={targetKeys}
          onChange={(keys) => onChange(keys as string[])}
        />
      </DndProvider>
    </Modal>
  );
}

const type = "DraggableItem";

interface DraggableItemProps {
  index: number;
  label: string;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableItem = ({ index, label, moveRow }: DraggableItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || ({} as any);
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? `drop-over-downward` : `drop-over-upward`,
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });

  const [_, drag, preview] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(ref));

  return (
    <div
      key={label}
      ref={ref}
      className={clsx(styles.itemWrapper, {
        [styles[dropClassName ?? ""]]: isOver,
      })}
    >
      <span className="label">{label}</span>
      {index !== -1 && (
        <span ref={drag}>
          <MenuOutlined />
        </span>
      )}
    </div>
  );
};
