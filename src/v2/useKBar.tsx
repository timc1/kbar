import React from "react";
import { KBarContext } from "./KBarContextProvider";
import type { ActionTree, KBarQuery, KBarState } from "./types";

export default function useKBar<C>(collector?: (state: KBarState) => C): C & {
  query: KBarQuery;
  options: any;
  actions: ActionTree;
} {
  const { query, getState, subscribe, options, actions } =
    React.useContext(KBarContext);

  const collected = React.useRef(collector?.(getState()));
  const collectorRef = React.useRef(collector);

  const onCollect = React.useCallback(
    (collected: any) => ({
      ...collected,
      query,
      options,
      actions,
    }),
    [query, options, actions]
  );

  const [render, setRender] = React.useState(onCollect(collected.current));

  React.useEffect(() => {
    let unsubscribe;
    if (collectorRef.current) {
      unsubscribe = subscribe(
        (current) => (collectorRef.current as any)(current),
        (collected) => setRender(onCollect(collected))
      );
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [onCollect, subscribe]);

  return render;
}
