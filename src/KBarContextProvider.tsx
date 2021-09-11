import useStore from "./useStore";
import * as React from "react";
import InternalKeyboardEvents from "./InternalKeyboardEvents";
import { IKBarContext, KBarProviderProps } from "./types";

export const KBarContext = React.createContext<IKBarContext>(
  {} as IKBarContext
);

export const KBarProvider: React.FC<KBarProviderProps> = (props) => {
  const contextValue = useStore(props);

  return (
    <KBarContext.Provider value={contextValue}>
      <InternalKeyboardEvents />
      {props.children}
    </KBarContext.Provider>
  );
};
