import { AgGridReactProps } from 'ag-grid-react';
import { state } from './state.column-type';

const columnTypes: AgGridReactProps['columnTypes'] = {
  custom_state: state
};

export default columnTypes;
