/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router-dom";

type Newable = new (...args: any[]) => any;

interface ContentResult<T extends Newable> {
  store: InstanceType<T>;
  navigate: NavigateFunction;
  t: TFunction;
}

export function useStore<T extends Newable>(Store: T) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [store] = useState(new Store({ navigate }));

  function useOnload(...args: unknown[]): ContentResult<T> {
    useEffect(() => {
      store.onLoad?.();
    }, [...args]);

    return { store, navigate, t };
  }

  return useOnload;
}
