import { PropsWithChildren } from "react";
import { useResizeDetector } from "react-resize-detector";
import clsx from "clsx";
import cls from "./wrapper.module.less";

interface BeautifulProps extends PropsWithChildren {
  title?: string;
  description?: React.ReactNode;
}

export const BeautifulWrapper: React.FC<BeautifulProps> = (p) => {
  const { title, children, description } = p;

  const { ref, width, height } = useResizeDetector();

  return (
    <div className={clsx(cls.wrapper)}>
      {title && <h1>{title}</h1>}
      {description}
      <div className={cls.sizer}>
        <div className={cls["sizer-clip"]} ref={ref}>
          <div
            style={{
              position: "relative",
              width: width ?? 100,
              height: height ?? 100,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
