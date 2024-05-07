import { useRafState } from './useRafState';
import { useEffectOnce } from './useEffectOnce';
import { off, on } from './eventListener';

export const useWindowSize = (): { height: number, width: number } => {
  const [state, setState] = useRafState<{ height: number, width: number }>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffectOnce(() => {
    const handler = (): void => {
      setState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    on(window, 'resize', handler);

    return () => {
      off(window, 'resize', handler);
    };
  });

  return state;
};
