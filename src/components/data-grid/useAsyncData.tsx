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

type RowCallback<T> = (page: number) => Promise<readonly T[]>;

export function useAsyncData<R>(
  pageSize: number,
  getRowData: RowCallback<R>,
  gridRef: MutableRefObject<DataEditorRef | null>,
  dataRef: MutableRefObject<R[]>
): Pick<DataEditorProps, "onVisibleRegionChanged"> {
  pageSize = Math.max(pageSize, 1);

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
      const d = await getRowData(page + 1);
      const vr = visiblePagesRef.current;

      const damageList: { cell: Item }[] = [];
      const data = dataRef.current;
      for (const [i, element] of d.entries()) {
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


  return { onVisibleRegionChanged };
}
