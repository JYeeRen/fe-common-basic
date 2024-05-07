import { useWindowSize } from './useWindowSize';

/**
 * 初次渲染时元素还没有渲染出来，所以会返回 0
 * 只有再次渲染时（如Effect中设置了页面的值），才能获取到正确的值
 * @param name
 * @returns
 */
export function useHeight(name: string): number {
  const element = document.querySelector(name);
  const { height } = useWindowSize();

  if (element == null) {
    return 0;
  }
  const { top } = element.getBoundingClientRect();
  return height - top;
}
