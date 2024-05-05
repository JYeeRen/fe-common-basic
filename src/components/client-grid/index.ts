import { useEffect, useMemo } from "react";
import { ClientGridImpl } from "./client-grid";
import { ClientGridStore } from "./client-grid.store";
import { getRowsFunc } from "./types";
import { TextEditor } from './editor/text-editor';

export * as ClientGridTypes from "./types";

function useGridStore<T>(getRows?: getRowsFunc<T>) {
  const gridStore = useMemo(() => new ClientGrid.GridStore(getRows), []);
  useEffect(() => {
    gridStore.loadData?.();
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

export default ClientGrid;
