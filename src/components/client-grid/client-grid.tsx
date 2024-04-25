import clsx from "clsx";
import { Pagination } from "antd";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "@locale";
import { AnyObject } from "@types";
import { stateFormatter } from "./value-formatter/state-formatter";
import { CustomLoadingOverlay } from './custom-loading-overlay';
import { CustomNoRowsOverlay } from "./custom-norows-overlay";
import { ClientGridProps } from "./types";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./ag-grid.css";

function InternalClientGrid<T extends AnyObject>(props: ClientGridProps<T>) {
  const { columns = [], getRows } = props;

  const ref = useRef<AgGridReact>(null);

  const [t] = useTranslation();

  const [rowData, setRowData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [{ page, pageSize }, setPagination] = useState({ page: 1, pageSize: 50 });

  const onPaginationChange = useCallback((page: number, pageSize: number) => {
    setPagination({ page, pageSize });
  }, []);

  ref.current?.api?.showLoadingOverlay();

  useEffect(() => {
    getRows({ page, size: pageSize }).then(({ list, total }) => {
      setRowData(list);
      setTotal(total);
    });
  }, [ref, getRows, page, pageSize]);


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
          rowData={rowData}
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
      <Pagination
        className="flex justify-end mt-4 mr-4 mb-20"
        total={total}
        current={page}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger
        showQuickJumper
        onChange={onPaginationChange}
        showTotal={showTotal}
      />
    </div>
  );
}

export const ClientGridImpl = InternalClientGrid;

// const ClientGrid = forwardRef(ClientGridImpl) as <R extends AnyObject = AnyObject>(
//   props: React.PropsWithChildren<AgGridProps<R>> &
//     React.RefAttributes<AgGridReact>
// ) => React.ReactElement;
