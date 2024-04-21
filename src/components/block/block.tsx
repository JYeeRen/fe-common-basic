import { PropsWithChildren } from "react";

interface BlockProps extends PropsWithChildren {
  if: boolean | string | number | null | undefined;
}
export function Block(props: BlockProps): JSX.Element {
  const { if: condition, children } = props;

  if (condition) {
    return <>{children}</>;
  }

  return <></>;
}
