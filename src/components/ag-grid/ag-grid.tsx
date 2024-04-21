import { forwardRef, useCallback, useMemo, useState } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { AgGridProps, AgGridServerProps, AnyObject, OnGridReady } from "./types";
import columnTypes from './column-types';

import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./ag-grid.css";

function AgGridImpl<T extends AnyObject>(props: AgGridProps<T>, ref?: React.Ref<AgGridReact>) {
  
  const { columns = [], useAsyncData } = props;
  const { getRows, getTotalCount } = props as AgGridServerProps<T>;

  const [columnDefs] = useState(columns);

  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: false,
    };
  }, []);

  const onGridReady = useCallback<OnGridReady<T>>(async (params) => {
    if (!useAsyncData) return;

    const total = await getTotalCount();
    const dataSource: AgGridReactProps<T>["datasource"] = {
      rowCount: total,
      getRows: async (params) => {
        const { list, total } = await getRows!({
          page: params.startRow / 100 + 1,
          size: 100,
        });
        params.successCallback(list, total);
      },
    };
    params.api.setGridOption("datasource", dataSource);
  }, [getRows, getTotalCount, useAsyncData]);



  return (
    // <BeautifulWrapper>
      <div style={gridStyle} className={"ag-theme-quartz"}>
        <AgGridReact
          ref={ref}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowBuffer={0}
          rowSelection={"multiple"}
          rowModelType={"infinite"}
          cacheBlockSize={100}
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={1}
          infiniteInitialRowCount={1000}
          maxBlocksInCache={10}
          onGridReady={onGridReady}
          columnTypes={columnTypes}
        />
      </div>
    // </BeautifulWrapper>
  );
}

const AgGrid = forwardRef(AgGridImpl) as (<R extends AnyObject = AnyObject>(
  props: React.PropsWithChildren<AgGridProps<R>> & React.RefAttributes<AgGridReact>,
) => React.ReactElement);

export default AgGrid;
