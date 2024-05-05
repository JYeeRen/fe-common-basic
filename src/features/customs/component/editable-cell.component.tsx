import { Form, Input, InputRef } from "@components";
import { useBoolean } from "ahooks";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CustomTemplateCol } from "../types";

interface EditableCellProps extends PropsWithChildren {
  cellkey: string;
  record: CustomTemplateCol
  value: string;
  onSave: (key: string, value: string, record: CustomTemplateCol) => void;
  editable?: boolean;
  children: React.ReactNode;
}

export function EditableCell(props: EditableCellProps) {
  const { cellkey, value, onSave, editable = false, children, record, ...restProps } = props;
  const inputRef = useRef<InputRef>(null);
  const [editing, { toggle }] = useBoolean(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleSave = useCallback(() => {
    onSave(cellkey, inputValue, record);
    toggle();
  }, [cellkey, inputValue, onSave, record, toggle]);

  let childNode = children;

  if (editable && editing) {
    childNode = (
      <Form.Item noStyle>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSave}
          onBlur={handleSave}
        />
      </Form.Item>
    );
  }

  return (
    <td onDoubleClick={toggle} {...restProps}>
      {childNode}
    </td>
  );
}
