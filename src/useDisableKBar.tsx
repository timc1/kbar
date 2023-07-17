import * as React from "react";
import { useKBar } from "./useKBar";

export function useDisableKBar(
  disableKBar: boolean,
) {
  const { query, options } = useKBar();

  React.useEffect(() => {
    if (options.disableKBar === disableKBar) {
      return;
    }

    query.setDisableKBar(disableKBar);
  }, [query, disableKBar, options]);
}
