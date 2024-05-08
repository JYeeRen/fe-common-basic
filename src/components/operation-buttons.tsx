import { Button } from "antd";
import { ReactElement } from "react";

interface OperationButtonsProps {
  items: {
    key: string;
    icon?: ReactElement;
    onClick?: () => void;
    label: string;
  }[];
  show?: boolean;
}

export function OperationButtons(props: OperationButtonsProps) {
  const { items } = props;
  return items.map(({ key, icon, onClick, label }) => (
    <Button
      key={key}
      type="link"
      icon={icon}
      onClick={onClick}
    >
      {label}
    </Button>
  ));
}