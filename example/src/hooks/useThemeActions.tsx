import { useRegisterActions } from "../../../src/useRegisterActions";
import toast from "react-hot-toast";
import * as React from "react";

function Toast({ title, action, buttonText }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: 14 }}>{title}</span>
      <button
        onClick={action}
        style={{
          background: "#fff",
          border: "none",
          boxShadow: "0 0 0 1px #000",
          padding: "4px 8px",
          cursor: "pointer",
          borderRadius: 4,
          fontSize: 14,
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

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
        toast(
          <div>
            <Toast
              title="Dark theme enabled"
              buttonText="Undo"
              action={() => {
                actionImpl.command.history.undo();
                toast.dismiss("dark");

                toast(
                  <Toast
                    title="Dark theme undone"
                    buttonText="Redo"
                    action={() => {
                      actionImpl.command.history.redo();
                      toast.dismiss("dark-undo");
                    }}
                  />,
                  {
                    id: "dark-undo",
                  }
                );
              }}
            />
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
      perform: (actionImpl) => {
        const attribute = "data-theme-dark";
        const doc = document.documentElement;
        const isDark = doc.getAttribute(attribute) !== null;
        document.documentElement.removeAttribute(attribute);

        toast(
          <div>
            <Toast
              title="Light theme enabled"
              buttonText="Undo"
              action={() => {
                actionImpl.command.history.undo();
                toast.dismiss("light");

                toast(
                  <Toast
                    title="Light theme undone"
                    buttonText="Redo"
                    action={() => {
                      actionImpl.command.history.redo();
                      toast.dismiss("light-undo");
                    }}
                  />,
                  {
                    id: "light-undo",
                  }
                );
              }}
            />
          </div>,
          {
            id: "light",
          }
        );

        return () => {
          if (isDark) doc.setAttribute(attribute, "");
        };
      },
      parent: "theme",
    },
  ]);
}
