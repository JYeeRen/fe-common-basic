/* eslint-disable @typescript-eslint/no-explicit-any */
export * as Schema from './schema';
export * from './common';
export * from './api';

export type AnyObject = Record<PropertyKey, any>;

export interface ImportRes {
  fileName: string;
  url: string;
  total: number;
  success: number;
  rejected: { rowIndex: number, row: string[], reason: string }[];
}