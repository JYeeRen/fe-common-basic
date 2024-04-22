import { ClientGridImpl } from "./client-grid";
import { GridStore } from "./grid.store";

export * as ClientGridTypes from "./types";

type ClientGridType = typeof ClientGridImpl & {
  GridStore: typeof GridStore;
};

const ClientGrid = ClientGridImpl as ClientGridType;
ClientGrid.GridStore = GridStore;

export default ClientGrid;
