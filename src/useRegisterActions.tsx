import * as React from "react";
import { Action } from "./types";
import useKBar from "./useKBar";

export default function useRegisterActions(actions: Action[]) {
  const { query } = useKBar();

  const actionsRef = React.useRef(actions || []);
  React.useEffect(() => {
    const actions = actionsRef.current;
    if (!actions.length) {
      return;
    }

    const unregister = query.registerActions(actions);
    return () => {
      unregister();
    };
  }, [query]);
}
