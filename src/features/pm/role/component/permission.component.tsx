import { PropsWithChildren, useMemo, useState } from "react";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { Card, Checkbox, Col, Row } from "@components";
import { Schema } from "@types";
import styles from "./permission.component.module.less";
import { intersection } from "lodash";

interface PermissionGroupProps extends PropsWithChildren {
  permission: Schema.Permission;
  value?: string[];
  onChange?: (value: string[]) => void;
  readonly?: boolean;
}

export function PermissionGroup(props: PermissionGroupProps) {
  const { permission, value, onChange, readonly = false } = props;
  const childrenKeys = useMemo(
    () => permission.items.map((item) => item.key),
    [permission]
  );

  const [checked, setChecked] = useState<string[]>(value ?? []);

  const handlerCheckboxChange = (e: CheckboxChangeEvent) => {
    if (readonly) return;
    const { checked } = e.target;
    if (checked) {
      setChecked(childrenKeys);
      onChange?.(childrenKeys);
      return;
    }
    setChecked([]);
    onChange?.([]);
  };

  const checkedCount = useMemo(
    () => intersection(value || checked, childrenKeys).length,
    [value, checked, childrenKeys]
  );

  const indeterminate = useMemo(
    () => (value || checked).length > 0 && checkedCount < childrenKeys.length,
    [value, checked, checkedCount, childrenKeys.length]
  );

  const checkbox = (
    <Checkbox
      indeterminate={indeterminate}
      checked={checkedCount === childrenKeys.length}
      onChange={handlerCheckboxChange}
    >
      {permission.text}
    </Checkbox>
  );

  return (
    <Card key={permission.key} title={checkbox} className={styles.card}>
      <Checkbox.Group
        className="w-full"
        value={value || checked}
        onChange={(values) => {
          if (readonly) return;
          setChecked(values);
          onChange?.(values);
        }}
      >
        <Row>
          {permission.items.map((item, idx) => (
            <Col span={6} key={`${item.key}_${idx}col`}>
              <Checkbox key={item.key} value={item.key}>
                {item.text}
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </Card>
  );
}
