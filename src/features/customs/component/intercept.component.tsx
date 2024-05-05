import { Checkbox, InputNumber, Space } from "@components";
import { CustomTemplateCol } from "../types";
import { useTranslation } from "@locale";
import { useBoolean } from "ahooks";
import clsx from "clsx";
import styles from "./intercept.module.less";

interface InterceptProps {
  record: CustomTemplateCol;
  handleRecordFieldChange: <K extends keyof CustomTemplateCol>(
    key: K,
    value: CustomTemplateCol[K],
    record: CustomTemplateCol
  ) => void;
}

export const Intercept = (props: InterceptProps) => {
  const [t] = useTranslation();
  const { record, handleRecordFieldChange } = props;
  const [
    interceptBeforeEditing,
    { toggle: toggleInterceptBefore, setFalse: setInterceptBeforeFalse },
  ] = useBoolean(false);
  const [
    interceptAfterEditing,
    { toggle: toggleInterceptAfter, setFalse: setInterceptAfterFalse },
  ] = useBoolean(false);
  return (
    <>
      <div>
        <Checkbox
          checked={record.interceptBefore}
          onChange={(e) => {
            handleRecordFieldChange(
              "interceptBefore",
              e.target.checked,
              record
            );
            handleRecordFieldChange("interceptBeforeStart", 0, record);
            handleRecordFieldChange("interceptBeforeEnd", 0, record);
            setInterceptBeforeFalse();
          }}
        >
          {t("从前段截取")}
        </Checkbox>
        <Space.Compact
          onDoubleClick={
            record.interceptBefore && !interceptBeforeEditing
              ? toggleInterceptBefore
              : undefined
          }
        >
          <InputNumber
            className={clsx({
              [styles.disabled]: !record.interceptBefore,
            })}
            readOnly={!interceptBeforeEditing || !record.interceptBefore}
            variant="borderless"
            controls={false}
            prefix={t("从第(")}
            suffix={t(")位")}
            min={0}
            size="small"
            precision={0}
            value={record.interceptBeforeStart || null}
            onChange={(value) =>
              handleRecordFieldChange(
                "interceptBeforeStart",
                value || 0,
                record
              )
            }
          />
          <InputNumber
            className={clsx({
              [styles.disabled]: !record.interceptBefore,
            })}
            readOnly={!interceptBeforeEditing || !record.interceptBefore}
            variant="borderless"
            controls={false}
            prefix={t("到第(")}
            suffix={t(")位")}
            min={0}
            size="small"
            precision={0}
            value={record.interceptBeforeEnd || null}
            onChange={(value) =>
              handleRecordFieldChange("interceptBeforeEnd", value || 0, record)
            }
          />
        </Space.Compact>
      </div>
      <div>
        <Checkbox
          checked={record.interceptAfter}
          onChange={(e) => {
            handleRecordFieldChange("interceptAfter", e.target.checked, record);
            handleRecordFieldChange("interceptAfterStart", 0, record);
            handleRecordFieldChange("interceptAfterEnd", 0, record);
            setInterceptAfterFalse();
          }}
        >
          {t("从后段截取")}
        </Checkbox>
        <Space.Compact
          onDoubleClick={
            record.interceptAfter && !interceptAfterEditing
              ? toggleInterceptAfter
              : undefined
          }
        >
          <InputNumber
            className={clsx({
              [styles.disabled]: !record.interceptAfter,
            })}
            readOnly={!interceptAfterEditing || !record.interceptAfter}
            variant="borderless"
            controls={false}
            prefix={t("从第(")}
            suffix={t(")位")}
            min={0}
            size="small"
            precision={0}
            value={record.interceptAfterStart || null}
            onChange={(value) =>
              handleRecordFieldChange("interceptAfterStart", value || 0, record)
            }
          />
          <InputNumber
            className={clsx({
              [styles.disabled]: !record.interceptAfter,
            })}
            readOnly={!interceptAfterEditing || !record.interceptAfter}
            variant="borderless"
            controls={false}
            prefix={t("到第(")}
            suffix={t(")位")}
            min={0}
            size="small"
            precision={0}
            value={record.interceptAfterEnd || null}
            onChange={(value) =>
              handleRecordFieldChange("interceptAfterEnd", value || 0, record)
            }
          />
        </Space.Compact>
      </div>
    </>
  );
};
