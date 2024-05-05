import { AccountAPI } from "./account.types";
import { OptionsAPI } from "./options.types";
import { RoleAPI } from "./role.trypes";
import { CustomsItemAPI} from './customs-item.types';
import { CustomTemplateAPI } from "./custom-template.types";

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

export interface Sources extends AccountAPI, RoleAPI, OptionsAPI, CustomsItemAPI, CustomTemplateAPI {}

export type URLs = keyof Sources;