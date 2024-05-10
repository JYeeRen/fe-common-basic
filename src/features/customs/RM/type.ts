import { Schema, Sources } from "@types";

export type Customer = Schema.CustomsRisk;

export type CustomerQueryParams = Sources["/api/customsRisk/findList"]["params"];