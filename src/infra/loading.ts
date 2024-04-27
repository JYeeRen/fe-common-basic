/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyObject } from "@types";

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
        await originalMethod.apply(this, args);
      } finally {
        (this as any)[loadingKey] = false;
      }
    };
  };
}
