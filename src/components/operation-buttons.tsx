import { Button } from "antd";
import { ReactElement } from "react";

interface OperationButtonsProps {
  items: {
    key: string;
    icon?: ReactElement;
    onClick?: () => void;
    label: string;
    disabled?: boolean;
  }[];
  show?: boolean;
}

export function OperationButtons(props: OperationButtonsProps) {
  const { items, show = true } = props;
  if (!show) {
    return <span style={{ height: '32px', display: 'inline-block' }} />;
  }
  return items.map(({ key, icon, onClick, label, disabled }) => (
    <Button
      disabled={disabled}
      key={key}
      type="link"
      icon={icon}
      onClick={onClick}
    >
      {label}
    </Button>
  ));
}