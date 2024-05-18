import { Form, Input, InputRef, Modal } from "antd";
import { useBoolean } from "ahooks";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { dayjs } from "@infra";
import { t } from "i18next";

interface EditableDateCellProps extends PropsWithChildren {
  value: string;
  onSave: (value: string) => Promise<boolean>;
  editable?: boolean;
  children: React.ReactNode;
}

export function EditableDateCell(props: EditableDateCellProps) {
  const { value, onSave, editable = false, children, ...restProps } = props;
  const inputRef = useRef<InputRef>(null);
  const [editing, { toggle }] = useBoolean(false);
  const [inputValue, setInputValue] = useState(value);

  const handleDoubleClick = useCallback(() => {
    if (editable) {
      toggle();
    }
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  

  const errorNotice = useCallback(() => {
    Modal.confirm({
      title: t('警告！'),
      content: t('输入的日期格式不正确。请参照 2000-01-01T00:00:00+08:00 格式输入。'),
      okText: t('修改日期'),
      cancelText: t('放弃修改'),
      onCancel: () => {
        toggle();
        setInputValue(value);
      },
      onOk: () => {
        inputRef.current?.focus();
        inputRef.current?.select();
      },
    });
  }, [toggle, value]);

  const handleSave = useCallback(async () => {
    if (inputValue === value) {
      toggle();
      return;
    }

    const reg = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
    if (!reg.test(inputValue)) {
      errorNotice();
      return;
    }
    if (!dayjs(inputValue).isValid()) {
      errorNotice();
      return;
    }
    if (await onSave(inputValue)) {
      toggle();
    // } else {
    //   Modal.confirm({
    //     title: t('保存失败'),
    //     okText: t('保存失败'),
    //     onOk: async () => onSave(inputValue),
    //     onCancel: toggle,
    //   });
    }
    // await onSave(inputValue);
    // toggle();
  }, [errorNotice, inputValue, onSave, toggle, value]);

  let childNode = children;

  if (editable && editing) {
    childNode = (
      <Form.Item noStyle>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSave}
          // onBlur={handleSave}
          variant="borderless"
        />
      </Form.Item>
    );
  }

  const styles = useMemo(() => ( editing ? { border: '1px solid #1677ff' } : undefined), [editing]);

  return (
    <td onDoubleClick={handleDoubleClick} {...restProps} style={styles}>
      {childNode}
    </td>
  );
}
