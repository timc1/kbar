import * as React from "react";
import type { Action } from "./types";

export interface KeyboardShortcutProps {
  actions: Record<string, Action>;
}

export default function KeyboardShortcuts(props: KeyboardShortcutProps) {
  const actionsRef = React.useRef(props.actions);

  if (!actionsRef.current) {
    actionsRef.current = props.actions;
  }

  React.useEffect(() => {
    const actionsList = Object.keys(actionsRef.current).map(
      (key) => actionsRef.current[key]
    );

    let buffer: string[] = [];
    let lastKeyStroke = Date.now();

    function handleKeyDown(event) {
      const charList = "abcdefghijklmnopqrstuvwxyz0123456789";
      const key = event.key.toLowerCase();

      // We are only interested in alphanumeric keys, additionally ignoring the meta key
      // and ignoring the current active element in the doc is an input type.
      const activeElement = document.activeElement;
      const inputs = ["input", "select", "button", "textarea"];
      const ignoreStrokes =
        activeElement &&
        inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1;

      if (event.metaKey || charList.indexOf(key) === -1 || ignoreStrokes) {
        return;
      }

      // keys pressed within 1 second of each other will
      const currentTime = Date.now();
      if (currentTime - lastKeyStroke > 1000) {
        buffer = [];
      }

      buffer.push(key);
      lastKeyStroke = currentTime;

      for (let action of actionsList) {
        const shortcut = action.shortcut;
        if (JSON.stringify(shortcut) === JSON.stringify(buffer)) {
          action.perform?.();
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return null;
}
