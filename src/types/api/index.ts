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

export type { BackendOptions } from './options.types';

export interface ApiError {
  code: number;
  data: unknown;
  msg?: string;
}

export interface ApiSuccess<T = unknown> {
  code: 0;
  data: T;
}

export type ApiRes<T = unknown> = ApiSuccess<T> | ApiError;

export interface Sources
  extends AccountAPI,
    RoleAPI,
    OptionsAPI,
    CustomsItemAPI,
    CustomTemplateAPI,
    CustomsRiskAPI,
    CustomsStatusAPI,
    CustomsDocumentAPI,
    CustomsTrackAPI,
    CustomsTrackStatusAPI,
    CustomsTrackLogAPI
{}

export type URLs = keyof Sources;
