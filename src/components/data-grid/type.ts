/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GridCell, GridColumn } from "@glideapps/glide-data-grid";

export type AnyObject = Record<PropertyKey, any>;

export type Column<RecordType = any> = GridColumn & {
  getContent?: (value: any, record: RecordType, index: number) => GridCell
};

type BaseNamePath = string | number | boolean | (string | number | boolean)[];

type DeepNamePath<Store = any, ParentNamePath extends any[] = []> =
  ParentNamePath['length'] extends 10
    ? never 
    : true extends (Store extends BaseNamePath ? true : false) 
      ? ParentNamePath['length'] extends 0
        ? Store | BaseNamePath
        : Store extends any[]
          ? [...ParentNamePath, number] 
          : never 
          : Store extends any[]
          ? // Connect path. e.g. { a: { b: string }[] }
[
    ...ParentNamePath,
    number
] | DeepNamePath<Store[number], [...ParentNamePath, number]> : keyof Store extends never ? Store : {
    [FieldKey in keyof Store]: Store[FieldKey] extends Function ? never : (ParentNamePath['length'] extends 0 ? FieldKey : never) | [...ParentNamePath, FieldKey] | DeepNamePath<Required<Store>[FieldKey], [...ParentNamePath, FieldKey]>;
}[keyof Store];

type SpecialString<T> = T | (string & {});

export type DataIndex<T = any> = DeepNamePath<T> | SpecialString<T> | number | (SpecialString<T> | number)[];

export interface DataGridProps<RecordType = any> {
  dataSource?: RecordType[];
  columns?: Column<RecordType>[];
}