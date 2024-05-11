import optionsService, { Options } from "@services/options.service";
import { Select, SelectProps } from "antd";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

interface SearchSelectProps extends SelectProps {
  optionKey?: keyof Options | "roles";
}

export const SearchSelect = observer((props: SearchSelectProps) => {
  const { options, optionKey, ...restProps } = props;

  const selectOpts = options || optionsService.get(optionKey);
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
