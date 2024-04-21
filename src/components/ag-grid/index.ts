import InternalAgGrid from './ag-grid';
import * as renderer from './renderer';

type InternalAgGridType = typeof InternalAgGrid & {
  renderer: typeof renderer;  
};
type CompoundedComponent = InternalAgGridType;
const AgGrid = InternalAgGrid as CompoundedComponent;

AgGrid.renderer = renderer;

export default AgGrid;

export * as AgGridTypes from './types';