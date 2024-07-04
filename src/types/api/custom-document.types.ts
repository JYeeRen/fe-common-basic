import * as Schema from "../schema";
import { File, ListParams, ListRes } from "./common.types";

export interface CustomsDocumentAPI {
  "/api/customsDocument/uploadClearanceFiles": {
    params: FormData;
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/downloadClearanceFile": {
    params: { id: number };
    res: { filename: string; url: string };
  };
  "/api/customsDocument/findList": {
    params: ListParams & {
      masterWaybillNoList?: string[];
    };
    res: ListRes<Schema.CustomsDocument>;
  };
  "/api/customsDocument/findClearanceList": {
    params: ListParams & {
      noList?: string[];
      noType?: number;
    };
    res: ListRes<Schema.CustomsDocument>;
  };

  "/api/customsDocument/editRemark": {
    params: {
      id: number;
      remark: string;
    };
    res: never;
  };
  "/api/customsDocument/createDocument": {
    params: {
      ids: number[];
    };
    res: never;
  };
  "/api/customsDocument/cancelCreate": {
    params: {
      ids: number[];
    };
    res: {
      failed: { number: string; reason: string }[];
    };
  };
  "/api/customsDocument/export": {
    params?: {
      noList?: string[];
      noType?: number;
      uploadDate?: {
        zone: string;
        start: string;
        end: string;
      };
      flightDate?: {
        zone: string;
        start: string;
        end: string;
      };
      customsDocumentType?: string;
    };
    res: { filename: string; url: string };
  };
  "/api/customsDocument/downloadCopyFile": {
    params: { ids: number[] };
    res: File;
  };
  "/api/customsDocument/downloadCustomsFile": {
    params: { ids: number[] };
    res: File;
  };
  "/api/customsDocument/downloadPrealert": {
    params: { ids: number[] };
    res: File;
  };
  "/api/customsDocument/createCustomsFile": {
    params: { ids: number[]; templateId: number };
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/createTempCustomsFile": {
    params: { ids: number[]; templateId: number };
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/createTempPrealert": {
    params: { ids: number[]; templateId: number };
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/useTempPrealert": {
    params: { ids: number[]; };
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/downloadTempCustomsFile": {
    params: { ids: number[]; };
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/downloadTempPrealert": {
    params: { ids: number[]; };
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/useTempCustomsFile": {
    params: { ids: number[] };
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/createPrealert": {
    params: { ids: number[]; templateId: number };
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/uploadCustomsFile": {
    // params: { id: number; file: unknown };
    params: FormData;
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/uploadCustomsFiles": {
    // params: { files: unknown[] };
    params: FormData;
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/uploadPrealert": {
    // params: { id: number; file: unknown };
    params: FormData;
    res: { failed: { number: string; reason: string }[] };
  };
  "/api/customsDocument/uploadPrealerts": {
    // params: { files: unknown[] };
    params: FormData;
    res: { failed: { number: string; reason: string }[] };
  };
}
