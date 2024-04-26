import { useEffect, useMemo } from "react";
import { ClientGridImpl } from "./client-grid";
import { ClientGridStore } from "./client-grid.store";
import { getRowsFunc } from "./types";

export * as ClientGridTypes from "./types";

function useGridStore<T>(getRows: getRowsFunc<T>) {
  const gridStore = useMemo(() => new ClientGrid.GridStore(getRows), []);
  useEffect(() => {
    gridStore.loadData();
  }, []);
  return gridStore;
}

type ClientGridType = typeof ClientGridImpl & {
  GridStore: typeof ClientGridStore;
  useGridStore: typeof useGridStore;
};

const ClientGrid = ClientGridImpl as ClientGridType;
ClientGrid.GridStore = ClientGridStore;
ClientGrid.useGridStore = useGridStore;

export default ClientGrid;
