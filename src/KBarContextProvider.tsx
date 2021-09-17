import useStore from "./useStore";
import * as React from "react";
import { IKBarContext, KBarProviderProps } from "./types";
import InternalEvents from "./InternalEvents";

export const KBarContext = React.createContext<IKBarContext>(
  {} as IKBarContext
);

export const KBarProvider: React.FC<KBarProviderProps> = (props) => {
  const contextValue = useStore(props);

  return (
    <KBarContext.Provider value={contextValue}>
      <InternalEvents />
      {props.children}
    </KBarContext.Provider>
  );
};
