import * as React from "react";
import { BaseAction } from "./types";
import useKBar from "./useKBar";

export default function useRegisterActions(
  actions: BaseAction[],
  dependencies: React.DependencyList = []
) {
  const { query } = useKBar();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const actionsCache = React.useMemo(() => actions, dependencies);

  React.useEffect(() => {
    if (!actionsCache.length) {
      return;
    }

    const unregister = query.registerActions(actionsCache);
    return () => {
      unregister();
    };
  }, [query, actionsCache]);
}
