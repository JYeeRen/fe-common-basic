import { Row, Spin } from "antd";
import { PropsWithChildren, ReactNode } from "react";
import { Block } from "@components/block/block";
import styles from "./container.module.less";
import clsx from "clsx";
import { t } from "i18next";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface ContainerProps extends PropsWithChildren {
  title?: string;
  operation?: ReactNode;
  className?: string;
  loading?: boolean;
  backable?: boolean;
  onBack?: () => void;
  wrapperClassName?: string;
  table?: boolean;
  titleExtend?: ReactNode;
}

export function Container(props: ContainerProps) {
  const {
    title,
    operation,
    children,
    className,
    backable,
    onBack,
    loading = false,
    wrapperClassName,
    table,
    titleExtend
  } = props;

  const navigate = useNavigate();

  const handleback = () => navigate(-1);

  return (
    <div className={clsx("flex h-full flex-col", styles.content, { [styles.heightunset]: table }, className)}>
      <Block if={title}>
        <Row className={styles.header}>
          <span>
            <span className={styles.title}>{title}</span>
            {titleExtend}
          </span>
          <Block if={backable}>
            <span className="flex align-middle cursor-pointer" onClick={onBack ?? handleback}>
              <LeftOutlined className={styles.backIcon} />
              <span className={styles.back}>{t("返回")}</span>
            </span>
          </Block>
        </Row>
      </Block>
      <Block if={Boolean(operation)}>
        <Row className={styles.operation}>{operation}</Row>
      </Block>
      <div className="flex flex-col flex-1 overflow-auto">
        <Spin wrapperClassName={clsx(styles.loading, wrapperClassName)} spinning={loading}>
          {children}
        </Spin>
      </div>
    </div>
  );
}
