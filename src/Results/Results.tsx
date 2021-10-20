import * as React from "react";
import { useKBar } from "..";

interface Context {
  map: Record<
    string,
    {
      index: number;
      props?: any;
    }
  >;
  reset: () => void;
  getIndex: (id: string) => number;
  getHandlers: (index: number, opts: any) => any;
  activeIndex: number;
}

export const ResultsContext = React.createContext({} as Context);

export default function Results({ children }: { children: React.ReactNode }) {
  const manager = useManager();
  return <InternalResults manager={manager}>{children}</InternalResults>;
}

function InternalResults(props: {
  children: React.ReactNode;
  manager: Context;
}) {
  props.manager.reset();
  return (
    <ResultsContext.Provider value={props.manager}>
      {props.children}
    </ResultsContext.Provider>
  );
}

function useManager() {
  const map = React.useRef({} as any);
  const count = React.useRef(0);
  const scrollRef = React.useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    function handleKeyDown(event) {
      const total = count.current;

      if (event.key === "ArrowDown" || (event.ctrlKey && event.key === "n")) {
        setActiveIndex((current) => (current < total ? current + 1 : current));
      } else if (
        event.key === "ArrowUp" ||
        (event.ctrlKey && event.key === "p")
      ) {
        setActiveIndex((current) => (current > 0 ? current - 1 : current));
      } else if (event.key === "Enter") {
        scrollRef.current?.click();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  const { search, currentRootActionId } = useKBar((state) => ({
    search: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
  }));

  React.useEffect(() => {
    setActiveIndex(0);
  }, [search, currentRootActionId]);

  const getHandlers = (index: number, cb: () => void) => ({
    ref: activeIndex === index ? scrollRef : null,
    onMouseOver: () => setActiveIndex(index),
    onPointerDown: () => setActiveIndex(index),
    onClick: cb,
  });

  const reset = () => {
    map.current = {};
    count.current = -1;
  };

  const getIndex = (id: string) => {
    if (!map.current[id]) {
      count.current++;
      map.current[id] = {
        index: count.current,
      };
    }
    return map.current[id].index;
  };

  return {
    map,
    reset,
    getIndex,
    activeIndex,
    getHandlers,
  } as unknown as Context;
}
