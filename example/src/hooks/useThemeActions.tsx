import useRegisterActions from "../../../src/useRegisterActions";
import toast from "react-hot-toast";
import * as React from "react";

export default function useThemeActions() {
  useRegisterActions([
    {
      id: "theme",
      name: "Change theme…",
      keywords: "interface color dark light",
      section: "Preferences",
    },
    {
      id: "darkTheme",
      name: "Dark",
      keywords: "dark theme",
      section: "",
      perform: (actionImpl) => {
        const attribute = "data-theme-dark";
        const doc = document.documentElement;
        doc.setAttribute(attribute, "");
        toast.success(
          <div>
            <div>Dark theme enabled</div>
            <button
              onClick={() => {
                actionImpl.command.history.undo();
                toast.dismiss("dark");

                toast.success(
                  <div>
                    <div>Dark theme undone</div>
                    <button
                      onClick={() => {
                        actionImpl.command.history.redo();
                        toast.dismiss("dark-undo");
                      }}
                    >
                      Redo
                    </button>
                  </div>,
                  {
                    id: "dark-undo",
                  }
                );
              }}
            >
              Undo
            </button>
          </div>,
          {
            id: "dark",
          }
        );
        return () => {
          doc.removeAttribute(attribute);
        };
      },
      parent: "theme",
    },
    {
      id: "lightTheme",
      name: "Light",
      keywords: "light theme",
      section: "",
      perform: () => {
        const attribute = "data-theme-dark";
        const doc = document.documentElement;
        const isDark = doc.getAttribute(attribute) !== null;
        document.documentElement.removeAttribute(attribute);
        return () => {
          if (isDark) doc.setAttribute(attribute, "");
        };
      },
      parent: "theme",
    },
  ]);
}
