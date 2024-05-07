/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { useEffect, EffectCallback as ReactEffectCallback } from 'react';

type Destructor = () => void;
type EffectCallback = () => (void | Promise<void> | Destructor | ReactEffectCallback);

export function useEffectOnce(effect: EffectCallback): void {
  useEffect(() => {
    effect();
  }, []);
}
