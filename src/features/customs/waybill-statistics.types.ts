import { Schema, Sources } from "@types";

export interface WaybillStatistics
  extends Omit<Schema.WaybillStatistics, "tailProviders"> {
  tailProviders: Record<
    string,
    Schema.WaybillStatistics["tailProviders"][number]
  >;
}

export type R = WaybillStatistics;

export type QueryParams = Sources["/api/dataStatistics/findList"]["params"];

export interface Row extends WaybillStatistics {}
