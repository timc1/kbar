import * as React from "react";
import styles from "./Layout.module.scss";

interface Props {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  return <div className={styles.wrapper}>{props.children}</div>;
}
