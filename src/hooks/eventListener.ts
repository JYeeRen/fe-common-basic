export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['addEventListener']> | [string | null, unknown]
): void {
  if (obj?.addEventListener != null) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>));
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['removeEventListener']> | [string | null, unknown]
): void {
  if (obj?.removeEventListener != null) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>));
  }
}
