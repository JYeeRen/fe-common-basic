import { useState, useRef, useEffect, useCallback } from "react";
import {
  Modal,
  Transfer,
  Row,
  Space,
  Button,
  Form,
  Checkbox,
  Input,
  Collapse,
  Tag,
  message,
} from "antd";
import { CaretRightOutlined, MenuOutlined } from "@ant-design/icons";
import { DndProvider, useDrop, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./colManager.module.less";
import clsx from "clsx";
import { t } from "@locale";
import { v4 } from "uuid";

type Key = string | number;

export interface Item {
  key: Key;
  label: string;
}

interface Props<T extends Item> {
  loading?: boolean;
  visible: boolean;
  onClose?: () => void;
  fieldColumns?: T[];
  defaultColumns?: T[];
  selectedKeys?: Key[];
  showColumns?: T[];
  setShowColumns: (
    keys: Key[],
    short?: { name: string; shorts: Record<string, Key[]> }
  ) => void;
  title?: string;
  filter?: boolean;
  saveShort?: boolean;
  shortName?: string;
  shorts?: Record<string | number, Key[]>;
  onShortClose?: (name: string) => Promise<void>;
}

export function TableColSettings<T extends Item>(props: Props<T>) {
  const {
    loading,
    visible,
    onClose = () => void 0,
    fieldColumns = [],
    defaultColumns = [],
    selectedKeys,
    setShowColumns,
    title,
    saveShort = false,
    shorts: _shorts,
    shortName: _shortName,
    filter,
    onShortClose
  } = props;
  const [targetKeys, setTargetKeys] = useState<Key[]>(selectedKeys ?? []);

  const [saveAsShort, setSaveAsShort] = useState(_shortName ? true : false);

  const [shorts, setShorts] = useState(_shorts ?? {});

  useEffect(() => {
    if (visible) {
      return;
    }
    setTargetKeys(selectedKeys ?? []);
  }, [selectedKeys]);

  const onChange = (nextTargetKeys: Key[]) => {
    setTargetKeys(Array.from(new Set(nextTargetKeys)));
  };

  const [shortName, setShortName] = useState(_shortName ?? "");

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

    if (saveAsShort && shorts[shortName]) {
      message.error(t('快捷组名称重复'))
      return;
    }

    setShowColumns(
      targetKeys,
      {
        name: saveAsShort ? shortName || `${t("快捷组")}${Object.keys(shorts).length + 1}` : '',
        shorts: shorts ?? {},
      }
    );
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

  const filterOption = useCallback(
    (inputValue: string, option: Item) => option.label.indexOf(inputValue) > -1,
    []
  );

  return (
    <Modal
      maskClosable={false}
      open={visible}
      title={title ?? t("选择需要展示的尾程服务商")}
      onCancel={onClose}
      width={700}
      classNames={{ body: styles.modalBody }}
      destroyOnClose
      footer={
        <Row justify="end">
          <Space size="middle">
            <Button disabled={loading} onClick={onClose}>{t("取消")}</Button>
            <Button disabled={loading} type="primary" onClick={onOk}>
              {t("保存")}
            </Button>
          </Space>
        </Row>
      }
    >
      <DndProvider backend={HTML5Backend}>
        <Transfer
          disabled={loading}
          className={styles.transfer}
          rowKey={(record) => record.key}
          listStyle={{ flex: 1, width: 300 }}
          dataSource={fieldColumns}
          showSearch={filter}
          filterOption={filter ? filterOption : undefined}
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
      {saveShort && (
        <>
          <Row justify="end">
            <Form.Item
              style={{ margin: "10px 0" }}
              label={
                <Checkbox
                  disabled={loading}
                  checked={saveAsShort}
                  onChange={(e) => setSaveAsShort(e.target.checked)}
                >
                  {t("同时保存为常用选项组")}
                </Checkbox>
              }
            >
              <Input
                style={{ width: "200px" }}
                disabled={!saveAsShort || loading}
                placeholder={t("请输入组名")}
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
              />
            </Form.Item>
          </Row>
          <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            items={[
              {
                key: "1",
                label: t("最近保存"),
                children: (
                  <>
                    {Object.entries(shorts ?? {}).map(([name, value]) => (
                      <Tag
                        key={v4()}
                        style={{ padding: "2px 10px" }}
                        closable
                        onClick={() => {
                          onChange(value);
                          setShortName(name);
                        }}
                        onClose={async () => {
                          const newShorts = { ...shorts };
                          delete newShorts[name];
                          setShorts(newShorts);
                          await onShortClose?.(name);
                        }}
                      >
                        <span style={{ cursor: "pointer" }}>
                          {name}({value.length})
                        </span>
                      </Tag>
                    ))}
                  </>
                ),
              },
            ]}
          />
        </>
      )}
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
