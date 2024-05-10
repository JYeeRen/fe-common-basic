import { Input } from "antd";
import type { TextAreaProps } from "antd/es/input/TextArea";
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface FilterTextAreaProps
  extends Omit<TextAreaProps, "onChange" | "value"> {
  value?: string[];
  onChange?: (value: string[]) => void;
}

export const FilterTextArea = (props: FilterTextAreaProps) => {
  const { value, onChange, ...restProps } = props;
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      const val = e.target.value.split(/,|\n+|\r+|\s+/);
      setInternalValue(val);
      onChange?.(val);
    },
    [onChange]
  );

  const style = useMemo(
    () => ({
      height: 120,
      // resize: "none",
    }),
    []
  );

  return (
    <Input.TextArea
      value={(value || internalValue)?.join("\n")}
      onChange={handleChange}
      {...restProps}
      count={{
        show: true,
        max: 50,
        strategy: (value: string) => (value ? value.split("\n").length : 0),
      }}
      style={style}
    />
  );
};
