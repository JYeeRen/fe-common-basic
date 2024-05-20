import optionsService, { OptionKey } from "@services/options.service";
import { Select, SelectProps } from "antd";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";

type OptK = Exclude<OptionKey, 'templateColumns' | 'permissions'>;

interface SearchSelectProps<K extends OptK> extends SelectProps {
  optionKey?: K;
  omitKey?: (string | number)[];
}

export const SearchSelect = observer(function <K extends OptK>(props: SearchSelectProps<K>) {
  const { options, optionKey, omitKey = [], ...restProps } = props;

  const getOptions = (optionKey?: K) => {
    if (!optionKey) {
      return [];
    }
    const opts = optionsService[optionKey] ?? [];
    if (omitKey.length) {
      return opts.filter(opt => !omitKey.includes(opt.value));
    }
    return opts;
  };

  const selectOpts = options || getOptions(optionKey);

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
