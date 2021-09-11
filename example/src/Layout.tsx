import * as React from "react";
import { VisualState } from "../../src/types";
import useKBar from "../../src/useKBar";
import styles from "./Layout.module.scss";

interface Props {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const { query } = useKBar();
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button
          onClick={() =>
            // TODO: we can expose a query.toggle to handle this logic within the library itself
            query.setVisualState((vs) =>
              [VisualState.animatingOut, VisualState.hidden].includes(vs)
                ? VisualState.animatingIn
                : VisualState.animatingOut
            )
          }
        >
          ⌘
        </button>
        <h1>kbar</h1>
      </div>
      {props.children}
      <footer style={{ marginTop: "var(--unit)" }}>
        <a
          href="https://twitter.com/timcchang"
          rel="noreferrer"
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          @timcchang
        </a>
      </footer>
    </div>
  );
}
