import { Row, Spin } from "antd";
import { PropsWithChildren, ReactNode } from "react";
import { Block } from "@components/block/block";
import styles from "./container.module.less";
import clsx from "clsx";

interface ContainerProps extends PropsWithChildren {
  title?: string;
  operation?: ReactNode;
  className?: string;
  loading?: boolean;
}

export function Container(props: ContainerProps) {
  const { title, operation, children, className, loading = false } = props;

  return (
    <div className={clsx("flex h-full flex-col", styles.content, className)}>
      <Block if={title}>
        <Row className={styles.header}>
          <span className={styles.title}>{title}</span>
        </Row>
      </Block>
      <Block if={Boolean(operation)}>
        <Row className={styles.operation}>{operation}</Row>
      </Block>
      <div className="flex flex-col flex-1 overflow-auto">
        <Spin wrapperClassName={styles.loading} spinning={loading}>
          {children}
        </Spin>
      </div>
    </div>
  );
}
