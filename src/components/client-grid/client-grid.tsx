import clsx from "clsx";
import { Pagination } from "antd";
import { observer } from "mobx-react-lite";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "@locale";
import { stateFormatter } from "./value-formatter/state-formatter";
import { CustomLoadingOverlay } from './custom-loading-overlay';
import { CustomNoRowsOverlay } from "./custom-norows-overlay";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./ag-grid.css";
import { ColumnDefs } from "@components/ag-grid/types";
import { Block } from "@components/block/block";
import { ClientGridStore } from "./client-grid.store";

interface ClientGridProps<T> {
  columns?: ColumnDefs<T>;
  store: ClientGridStore<T>;
  pagination?: boolean;
}

function InternalClientGrid<T>(props: ClientGridProps<T>) {
  const { columns = [], store, pagination = true } = props;

  const ref = useRef<AgGridReact>(null);

  const [t] = useTranslation();

  const columnTypes = useMemo(() => {
    return {
      state: {
        width: 150,
        valueFormatter: stateFormatter,
      }
    };
  }, []);

  const [columnDefs] = useState(columns);

  const pageSizeOptions = useMemo(() => [10, 20, 50, 100, 200, 500], []);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: false,
    };
  }, []);

  const showTotal = useCallback((total: number) => t("共{{total}}条", { total }), [t]);

  const onGridReady = useCallback(() => {}, []);

  const loadingOverlayComponent = useMemo(() => CustomLoadingOverlay, []);
  const loadingOverlayComponentParams = useMemo(() => ({ loadingMessage: t('请稍后...') }), [t]);
  const noRowsOverlayComponent = useMemo(() => { return CustomNoRowsOverlay }, []);
  const noRowsOverlayComponentParams = useMemo(() => ({}), []);

  return (
    <div className="flex flex-col w-full flex-1 overflow-hidden">
      <div className={clsx("ag-theme-quartz", "w-full flex-1")}>
        <AgGridReact
          ref={ref}
          rowData={store.rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          rowModelType="clientSide"
          columnTypes={columnTypes}
          onGridReady={onGridReady}
          reactiveCustomComponents
          loadingOverlayComponent={loadingOverlayComponent}
          loadingOverlayComponentParams={loadingOverlayComponentParams}
          noRowsOverlayComponent={noRowsOverlayComponent}
          noRowsOverlayComponentParams={noRowsOverlayComponentParams}
        />
      </div>
      <Block if={pagination}>
        <Pagination
          className="flex justify-end mt-4 mr-4 mb-8"
          total={store.total}
          current={store.page}
          pageSize={store.pageSize}
          pageSizeOptions={pageSizeOptions}
          showSizeChanger
          showQuickJumper
          onChange={store.onTableChange.bind(store)}
          showTotal={showTotal}
        />

      </Block>
    </div>
  );
}

export const ClientGridImpl = observer(InternalClientGrid);

// const ClientGrid = forwardRef(ClientGridImpl) as <R extends AnyObject = AnyObject>(
//   props: React.PropsWithChildren<AgGridProps<R>> &
//     React.RefAttributes<AgGridReact>
// ) => React.ReactElement;
