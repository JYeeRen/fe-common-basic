import { useEffect, useMemo } from "react";
import { ClientGridImpl } from "./client-grid";
import { ClientGridStore } from "./client-grid.store";
import { getRowsFunc } from "./types";
import { TextEditor } from './editor/text-editor';

export * as ClientGridTypes from "./types";

interface UseGridStoreOptions {
  autoLoad?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues?: any;
}

function useGridStore<T>(getRows?: getRowsFunc<T>, options?: UseGridStoreOptions) {
  const { autoLoad = true, initialValues } = options || {};
  const gridStore = useMemo(() => new ClientGrid.GridStore(getRows), []);
  useEffect(() => {
    if (initialValues) {
      gridStore.setQueryParams(initialValues);
    }
    if (autoLoad) {
      gridStore.loadData?.();
    }
  }, []);
  return gridStore;
}

type ClientGridType = typeof ClientGridImpl & {
  GridStore: typeof ClientGridStore;
  useGridStore: typeof useGridStore;
  TextEditor: typeof TextEditor;
};

const ClientGrid = ClientGridImpl as ClientGridType;
ClientGrid.GridStore = ClientGridStore;
ClientGrid.useGridStore = useGridStore;
ClientGrid.TextEditor = TextEditor;

export { ClientGridStore } from "./client-grid.store";

export default ClientGrid;
