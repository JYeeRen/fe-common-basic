import { AccountAPI } from "./account.types";
import { OptionsAPI } from "./options.types";
import { RoleAPI } from "./role.trypes";
import { CustomsItemAPI } from "./customs-item.types";
import { CustomTemplateAPI } from "./custom-template.types";
import { CustomsRiskAPI } from "./customs-risk.types";
import { CustomsStatusAPI } from "./custom-status.type";
import { CustomsDocumentAPI } from "./custom-document.types";
import { CustomsTrackAPI } from "./customs-track.types";
import { CustomsTrackStatusAPI } from "./customs-track-status.types";
import { CustomsTrackLogAPI } from "./customs-track-log.types";
import { PackageStatusAPI } from "./package-status.types";
import {WarehouseAPI} from "./warehouse.ts";
import { DataStatisticsAPI } from "./data-statistics.types.ts";
import { BaseInfoAPI } from "./baseinfo.ts";
import { UserSettingAPI } from "./userSetting.types.ts";
import { SubEmailAPI } from "./subEmail.types.ts";
import { ToolsAPI } from "./tools.types.ts";
import { PackageMidCodeAPI } from "./packageMidCode.types.ts";

export type { BackendOptions, TZ } from './options.types';

export interface ApiError {
  code: number;
  data: unknown;
  msg?: string;
  traceId: string;
}

export interface ApiSuccess<T = unknown> {
  code: 0;
  data: T;
  traceId: string;
}

export type ApiRes<T = unknown> = ApiSuccess<T> | ApiError;

export interface Sources
  extends AccountAPI,
    RoleAPI,
    SubEmailAPI,
    UserSettingAPI,
    OptionsAPI,
    CustomsItemAPI,
    PackageMidCodeAPI,
    CustomTemplateAPI,
    CustomsRiskAPI,
    CustomsStatusAPI,
    CustomsDocumentAPI,
    CustomsTrackAPI,
    CustomsTrackStatusAPI,
    CustomsTrackLogAPI,
    PackageStatusAPI,
    DataStatisticsAPI,
    WarehouseAPI,
    ToolsAPI,
    BaseInfoAPI
{

}

export type URLs = keyof Sources;
