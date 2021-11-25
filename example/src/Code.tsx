import Highlight, { defaultProps } from "prism-react-renderer";
import * as React from "react";
import { classnames } from "./utils";
import styles from "./Code.module.scss";

interface Props {
  code: string;
}

export default function Code(props: Props) {
  return (
    <Highlight
      {...defaultProps}
      code={props.code.trim()}
      language="tsx"
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={classnames(className, styles.pre)} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

const theme = {
  plain: {
    color: "var(--foreground)",
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["builtin"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["number", "variable", "inserted"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["operator"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["constant", "char"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["tag"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["deleted", "string"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["changed", "punctuation"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["function", "keyword"],
      style: {
        color: "var(--foreground)",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "var(--foreground)",
      },
    },
  ],
};
