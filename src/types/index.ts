/* eslint-disable @typescript-eslint/no-explicit-any */
export * as Schema from './schema';

export type AnyObject = Record<PropertyKey, any>;

export interface Option {
  val: string;
  id: number;
}