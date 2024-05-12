import { Form, Input, InputRef } from "antd";
import { useBoolean } from "ahooks";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface EditableCellProps extends PropsWithChildren {
  value: string;
  onSave: (value: string) => void;
  editable?: boolean;
  children: React.ReactNode;
}

export function EditableCell(props: EditableCellProps) {
  const { value, onSave, editable = false, children, ...restProps } = props;
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
    onSave(inputValue);
    toggle();
  }, [inputValue, onSave]);

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
