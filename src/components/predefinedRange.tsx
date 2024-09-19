import { convertDate, dayjs } from "@infra";
import { useTranslation } from "@locale";
import { DatePicker, DatePickerProps, Form, Radio, Space } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { useEffect, useState } from "react";
import { SearchSelect } from "./search-select";

export const convertPredefinedRange = (value?: Omit<Value, 'predefined'>) => {
  if (!value) {
    return undefined;
  }
  const val = { ...value };
  if (!val.start) {
    return undefined;
  }
  return {
    ...val,
    start: convertDate(dayjs(val.start), val.zone).format("YYYY-MM-DDTHH:mm:ssZ"),
    end: convertDate(dayjs(val.end), val.zone).format("YYYY-MM-DDTHH:mm:ssZ")
  };
};

export const disabled31DaysDate: DatePickerProps["disabledDate"] = (
  current,
  { from }
) => {
  if (from) {
    return Math.abs(current.diff(from, "days")) >= 31;
  }

  return false;
};

export function getTime(values: any): Value | undefined {
  const { zone, range, predefined } = values || {};
  const time: Value = {
    predefined: predefined,
    zone: zone,
    start: range?.[0]?.format() ?? "",
    end: range?.[1]?.format() ?? "",
  };
  const now = dayjs();
  if (predefined === 1) {
    time.start = now.startOf('day').format();
    time.end = now.endOf('day').format();
  }
  if (predefined === 7) {
    time.start = now.subtract(7, "day").format();
    time.end = now.format();
  }
  if (predefined === 31) {
    time.start = now.subtract(31, "day").format();
    time.end = now.format();
  }
  
  return time.start ? time : undefined;
}

interface Value {
  predefined: number;
  start: string;
  end: string;
  zone: string;
}

interface PredefinedRangeProps {
  label?: string;
  value?: Value;
  onChange?: (value: PredefinedRangeProps['value']) => void;
}

export function PredefinedRange(props: PredefinedRangeProps) {
  const { label, value, onChange } = props;
  const [predefined, setPredefined] = useState<number | undefined>(1);
  const [range, setRange] = useState<RangePickerProps["value"]>();
  const [zone, setZone] = useState<number>();

  useEffect(() => {
    setPredefined(value?.predefined);
    if (value?.predefined) {
      return;
    }
    let newRange: RangePickerProps["value"] = [null, null];
    if (value?.start) {
      newRange[0] = dayjs(value.start);
    }
    if (value?.end) {
      newRange[1] = dayjs(value.end);
    }
    setRange(newRange);
  }, [value]);

  const [t] = useTranslation();

  return (
    <Form.Item label={label ?? t("扫描时间")} style={{ minWidth: 830 }}>
      <Form.Item noStyle>
        <Radio.Group
          value={predefined}
          onChange={(event) => {
            setPredefined(event.target.value);
            setRange(undefined);
            const val = getTime({ predefined: event.target.value, range });
            onChange?.(val);
          }}
        >
          <Radio.Button value={1}>{t("当天")}</Radio.Button>
          <Radio.Button value={7}>{t("近7天")}</Radio.Button>
          <Radio.Button value={31}>{t("近31天")}</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Space.Compact style={{ marginLeft: "10px" }}>
      <Form.Item noStyle>
        <SearchSelect
          optionKey="timeZones"
          placeholder={t("选择时区")}
          style={{ width: "200px" }}
          onChange={zone => {
            setZone(zone);
            const val = getTime({ zone, predefined, range });
            onChange?.(val);
          }}
          value={zone}
        />
      </Form.Item>
      <Form.Item noStyle>
        <DatePicker.RangePicker
          // style={{ marginLeft: "10px" }}
          showTime
          value={range}
          disabledDate={disabled31DaysDate}
          onChange={(dates) => {
            setRange(dates);
            setPredefined(undefined);
            const val = getTime({ zone, predefined: undefined, range: dates });
            onChange?.(val);
          }}
        />
      </Form.Item>
        </Space.Compact>
    </Form.Item>
  );
}
