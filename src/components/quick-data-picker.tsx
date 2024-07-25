import { useTranslation } from "@locale";
import { Radio, RadioGroupProps } from "antd";
import { useEffect, useState } from "react";

export function QuickDatePicker(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: RadioGroupProps & { onChange?: (value: any) => void }
) {
  const { value, onChange, ...restProps } = props;

  const [_value, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  const handleRadioClick = (val: unknown) => {
    if (value === val) {
      setValue(undefined);
      onChange?.(undefined);
    } else {
      setValue(val);
      onChange?.(val);
    }
  };

  const [t] = useTranslation();

  return (
    <Radio.Group {...restProps} value={_value}>
      <Radio.Button
        onClick={() => handleRadioClick("yeaterday")}
        value="yeaterday"
      >
        {t("昨天")}
      </Radio.Button>
      <Radio.Button onClick={() => handleRadioClick("today")} value="today">
        {t("当天")}
      </Radio.Button>
      <Radio.Button
        onClick={() => handleRadioClick("threeday")}
        value="threeday"
      >
        {t("3天内")}
      </Radio.Button>
    </Radio.Group>
  );
}
