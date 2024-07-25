import { Schema, Sources } from "@types";

export type WaybillStatistics = Schema.WaybillStatistics;

export type QueryParams =
  Sources["/api/dataStatistics/findList"]["params"];

export interface Row extends WaybillStatistics {
  
}