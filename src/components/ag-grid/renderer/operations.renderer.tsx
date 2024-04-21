import { Button } from "antd";
import { CellRendererProps } from "../types";

interface Action<T> {
  key: string;
  icon?: JSX.Element;
  onClick: (data: T) => void;
  label: string;
}

export function operations<T>(
  actions: Action<T>[],
  enable?: (data?: T) => boolean
) {
  return (params: CellRendererProps<T>) => {
    if (!(enable?.(params.data) ?? true)) {
      return;
    }
    return (
      <>
        {actions.map(({ key, icon, onClick, label }) => (
          <Button
            key={key}
            type="link"
            icon={icon}
            onClick={() => onClick(params.data)}
          >
            {label}
          </Button>
        ))}
      </>
    );
  };
}
