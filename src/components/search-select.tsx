import optionsService, { OptionKey } from "@services/options.service";
import { Select, SelectProps } from "antd";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

interface SearchSelectProps<K extends OptionKey> extends SelectProps {
  optionKey?: K;
}

export const SearchSelect = observer(function <K extends OptionKey>(
  props: SearchSelectProps<K>
) {
  const { options, optionKey, ...restProps } = props;

  const selectOpts = options || (optionKey ? optionsService[optionKey] : []);

  const filterOption = useCallback(
    (input: string, option?: { label: string; value: number }) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
    []
  );

  return (
    <Select
      showSearch
      allowClear
      options={selectOpts}
      placeholder="全部"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filterOption={filterOption as any}
      {...restProps}
    />
  );
});
