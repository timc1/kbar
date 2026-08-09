import * as React from "react";
import styles from "./styles.module.scss";
import { Link, Switch, useLocation, Route } from "react-router-dom";
import data from "./data";
import { classnames } from "../utils";

export default function Docs() {
  const location = useLocation();

  const routes = React.useMemo(() => {
    function generateRoute(tree) {
      return Object.keys(tree).map((key) => {
        const item = tree[key];
        if (item.children) {
          return generateRoute(item.children);
        }
        return (
          <Route
            key={key}
            path={item.slug.split("#")[0]}
            component={item.component}
          />
        );
      });
    }
    return generateRoute(data);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toc}>
        {Object.keys(data).map((key, index) => {
          const section = data[key];
          const childKeys = Object.keys(section.children);
          return (
            // the first three sections start expanded
            <details key={key} open={index < 3}>
              <summary>
                <h3>{section.name}</h3>
              </summary>
              {childKeys.length > 0 ? (
                <ul>
                  {childKeys.map((key) => {
                    const child = section.children[key];
                    return (
                      <li key={key}>
                        <Link
                          to={child.slug}
                          className={classnames(
                            !child.component && styles.comingSoon,
                            (location.pathname + location.hash).includes(
                              child.slug
                            ) && styles.active
                          )}
                        >
                          {child.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </details>
          );
        })}
      </div>
      <Switch>{routes}</Switch>
    </div>
  );
}
