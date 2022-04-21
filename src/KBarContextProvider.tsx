import { useStore } from "./useStore";
import * as React from "react";
import { InternalEvents } from "./InternalEvents";
import type { IKBarContext, KBarProviderProps } from "./types";

export const KBarContext = React.createContext<IKBarContext>(
  {} as IKBarContext
);

export const KBarProvider: React.FC<
  React.PropsWithChildren<KBarProviderProps>
> = (props) => {
  const contextValue = useStore(props);

  return (
    <KBarContext.Provider value={contextValue}>
      <InternalEvents />
      {props.children}
    </KBarContext.Provider>
  );
};
