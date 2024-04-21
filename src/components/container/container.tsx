import { Row } from "antd";
import { PropsWithChildren, ReactNode } from "react";
import { Block } from "@components/block/block";
import styles from "./container.module.less";

interface ContainerProps extends PropsWithChildren {
  title?: string;
  operation?: ReactNode;
}

export function Container(props: ContainerProps) {
  const { title, operation, children } = props;

  return (
    <div className="flex h-full flex-col">
      <Block if={title}>
        <Row className={styles.header}>
          <span className={styles.title}>{title}</span>
        </Row>
      </Block>
      <Block if={Boolean(operation)}>
        <Row className={styles.operation}>{operation}</Row>
      </Block>
      <div className="flex flex-1 overflow-auto">{children}</div>
    </div>
  );
}
