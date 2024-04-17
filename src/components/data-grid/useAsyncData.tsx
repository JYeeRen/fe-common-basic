import { range } from "lodash";
import {
  CompactSelection,
  DataEditorProps,
  DataEditorRef,
  Item,
  Rectangle,
} from "@glideapps/glide-data-grid";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type RowCallback<T> = (page: number) => Promise<{ list: readonly T[], total: number }>;

export function useAsyncData<R>(
  pageSize: number,
  getRowData: RowCallback<R> | undefined,
  gridRef: MutableRefObject<DataEditorRef | null>,
  dataRef: MutableRefObject<R[]>
): Pick<DataEditorProps, "onVisibleRegionChanged" | "rows"> {
  pageSize = Math.max(pageSize, 1);

  const [rows, setRows] = useState(0);
  // const gridRef = useRef<DataEditorRef>(null);
  const loadingRef = useRef(CompactSelection.empty());

  const [visiblePages, setVisiblePages] = useState<Rectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const visiblePagesRef = useRef(visiblePages);
  visiblePagesRef.current = visiblePages;

  const onVisibleRegionChanged: NonNullable<
    DataEditorProps["onVisibleRegionChanged"]
  > = useCallback((r) => {
    setVisiblePages((cv) => {
      if (
        r.x === cv.x &&
        r.y === cv.y &&
        r.width === cv.width &&
        r.height === cv.height
      )
        return cv;
      return r;
    });
  }, []);

  const loadPage = useCallback(
    async (page: number) => {
      loadingRef.current = loadingRef.current.add(page);
      const startIndex = page * pageSize;
      const { list = [], total = 0 } = await getRowData?.(page + 1) || {};
      setRows(total);
      const vr = visiblePagesRef.current;

      const damageList: { cell: Item }[] = [];
      const data = dataRef.current;
      for (const [i, element] of list.entries()) {
        data[i + startIndex] = element;
        for (let col = vr.x; col <= vr.x + vr.width; col++) {
          damageList.push({
            cell: [col, i + startIndex],
          });
        }
      }
      gridRef.current?.updateCells(damageList);
    },
    [dataRef, getRowData, gridRef, pageSize]
  );

  useEffect(() => {
    const r = visiblePages;
    const firstPage = Math.max(0, Math.floor((r.y - pageSize / 2) / pageSize));
    const lastPage = Math.floor((r.y + r.height + pageSize / 2) / pageSize);
    for (const page of range(firstPage, lastPage + 1)) {
      if (loadingRef.current.hasIndex(page)) continue;
      void loadPage(page);
    }
  }, [loadPage, pageSize, visiblePages]);


  if (!getRowData) {
    return { rows };
  }

  return { rows, onVisibleRegionChanged };
}
