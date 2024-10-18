import { net } from "@infra";
import { t } from "@locale";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Divider,
  Input,
  Row,
  Space,
  TableColumnType,
  TableColumnsType,
} from "@components";
import { Package, QueryParams } from "./type";
import { chain } from "lodash";
import { useEffect, useMemo, useState } from "react";

interface FilterProps {
  options: string[];
  onReset?: () => void;
  onConfirm?: (value: string[]) => void;
  selectedKeys: string[];
}

const Filter = (props: FilterProps) => {
  const [opts, setOpts] = useState(props.options);
  const [text, setText] = useState("");
  const [selected, setSelected] = useState<string[]>(props.selectedKeys ?? []);

  useEffect(() => {
    setOpts(props.options);
  }, [props.options]);

  const options = useMemo(() => {
    const res = opts.filter((v) => v.toString().includes(text));
    return res;
  }, [opts, text]);

  const selectedDict = useMemo(() => {
    return Object.fromEntries(selected.map((v) => [v, true]));
  }, [selected]);

  const checkAll = options.filter(v => !selectedDict[v]).length === 0;
  const indeterminate = selected.length > 0 && selected.length < options.length;

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setSelected(e.target.checked ? options : []);
  };

  const onReset = () => {
    setSelected([]);
    props.onReset?.();
  };

  const onConfirm = () => {
    props.onConfirm?.(selected);
    setTimeout(() => setText(''), 400);
  }

  const handleSearchChange = (value: string) => {
    setText(value);
    setSelected([]);
  }

  return (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        value={text}
        onChange={(e) => handleSearchChange(e.target.value)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Divider style={{ margin: "5px 0" }} />
      <div style={{ maxHeight: 300, overflow: "auto" }}>
        <Space direction="vertical">
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
          {options.map((v) => (
            <Checkbox
              key={v}
              checked={selectedDict[v]}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelected([...selected, v]);
                } else {
                  setSelected(selected.filter((s) => s !== v));
                }
              }}
            >
              {v}
            </Checkbox>
          ))}
        </Space>
      </div>
      <Divider style={{ margin: "10px 0" }} />
      <Row justify="space-around">
        <Button onClick={onReset}>重置</Button>
        <Button type="primary" onClick={onConfirm}>确定</Button>
      </Row>
    </div>
  );
};

const getColumnSearchProps = (
  options: FilterProps["options"]
): TableColumnType<Package> => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    // close,
  }) => {
    return (
      <Filter
        selectedKeys={selectedKeys as string[]}
        options={options}
        onReset={() => {
          clearFilters?.();
          setSelectedKeys([]);
          confirm();
        }}
        onConfirm={(values) => {
          setSelectedKeys(values);
          confirm();
        }}
      />
    );
  },
});

export const getColumns = (rows: Package[]): TableColumnsType<Package> => {
  return [
    {
      width: 60,
      key: "index",
      dataIndex: "index",
      title: t("序号"),
      render: (__v, __r, index) => index + 1,
    },
    {
      key: "masterWaybillNo",
      dataIndex: "masterWaybillNo",
      title: t("提单号"),
      ...getColumnSearchProps(
        chain(rows)
          .map("masterWaybillNo")
          .uniq()
          .compact()
          .value()
      ),
      onFilter: (value, record) => {
        return record.masterWaybillNo === value;
      },
    },
    {
      key: "bigBagNo",
      dataIndex: "bigBagNo",
      title: t("袋号"),
      ...getColumnSearchProps(
        chain(rows)
          .map("bigBagNo")
          .uniq()
          .compact()
          .value()
      ),
      onFilter: (value, record) => {
        return record.bigBagNo === value;
      },
    },
    {
      key: "trackingNo",
      dataIndex: "trackingNo",
      title: t("尾程单号"),
      ...getColumnSearchProps(
        chain(rows)
          .map("trackingNo")
          .uniq()
          .compact()
          .value()
      ),
      onFilter: (value, record) => {
        return record.trackingNo === value;
      },
    },
    {
      key: "providerOrderId",
      dataIndex: "providerOrderId",
      title: t("运单号"),
      ...getColumnSearchProps(
        chain(rows)
          .map("providerOrderId")
          .uniq()
          .compact()
          .value()
      ),
      onFilter: (value, record) => {
        return record.providerOrderId === value;
      },
    },
    {
      key: "declarationBillId",
      dataIndex: "declarationBillId",
      title: t("订单号"),
      ...getColumnSearchProps(
        chain(rows)
          .map("declarationBillId")
          .uniq()
          .compact()
          .value()
      ),
      onFilter: (value, record) => {
        return record.declarationBillId === value;
      },
    },
    {
      key: "nextProviderName",
      dataIndex: "nextProviderName",
      title: t("下一段服务商名称"),
      ...getColumnSearchProps(
        chain(rows)
          .map("nextProviderName")
          .uniq()
          .compact()
          .value()
      ),
      onFilter: (value, record) => {
        return record.nextProviderName === value;
      },
    }
  ];
};

export const getRows = async (params: QueryParams) => {
  return await net.post("/api/customsTrack/findAddPackageList", params);
};
