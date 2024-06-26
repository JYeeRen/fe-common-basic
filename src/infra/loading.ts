/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyObject } from "@types";
import { runInAction } from "mobx";

export function loading(loadingKey: string = 'loading') {
  return function (
    __target: AnyObject,
    __propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      (this as any)[loadingKey] = true;
      try {
        return await originalMethod.apply(this, args);
      } finally {
        runInAction(() => {
          (this as any)[loadingKey] = false;
        });
      }
    };
  };
}
