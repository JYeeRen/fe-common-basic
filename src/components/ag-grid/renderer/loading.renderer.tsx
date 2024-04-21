import ic_loading from "@assets/loading.gif";
import { CellRendererProps } from "../types";

export const loading = (params: CellRendererProps) => {
  if (params.value) {
    return params.value;
  }
  return <img src={ic_loading} />;
};
